const fs = require('fs');
const path = require('path');
const { XMLParser } = require('fast-xml-parser');
const { htmlToBlocks } = require('@portabletext/block-tools');
const { JSDOM } = require('jsdom');
const { createClient } = require('@sanity/client');
const { Schema } = require('@sanity/schema');
const fetch = require('node-fetch');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

// --- 設定ここから ---
const XML_FILE_PATH = path.resolve(__dirname, '../../gomix666com.WordPress.2025-07-03.xml');
const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET;
const SANITY_API_WRITE_TOKEN = process.env.SANITY_API_WRITE_TOKEN;
// --- 設定ここまで ---

if (!SANITY_PROJECT_ID || !SANITY_DATASET || !SANITY_API_WRITE_TOKEN) {
  console.error('Error: Sanity project ID, dataset, or write token is not configured.');
  console.error('Please check your .env.local file and ensure it contains:');
  console.error('NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, and SANITY_API_WRITE_TOKEN');
  process.exit(1);
}

const sanityClient = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  token: SANITY_API_WRITE_TOKEN,
  useCdn: false,
  apiVersion: '2024-07-01',
});

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  cdataPropName: '__cdata',
});

async function migrate() {
  console.log('🚀 Starting WordPress to Sanity migration...');

  // 1. XMLファイルを読み込み、パースする
  let xmlData;
  try {
    xmlData = fs.readFileSync(XML_FILE_PATH, 'utf-8');
  } catch (error) {
    console.error(`❌ Error reading XML file at: ${XML_FILE_PATH}`);
    return;
  }
  const parsed = parser.parse(xmlData);
  const channel = parsed.rss.channel;
  const siteUrl = channel.link;

  // 2. 著者情報を取得・登録
  console.log('👤 Migrating author...');
  const wpAuthor = channel['wp:author'];
  const authorDoc = {
    _type: 'author',
    _id: 'author-' + wpAuthor['wp:author_id'],
    name: wpAuthor['wp:author_login']['__cdata'],
  };
  await sanityClient.createOrReplace(authorDoc);
  console.log(`✅ Author "${authorDoc.name}" migrated.`);

  // 3. カテゴリを移行
  console.log('🗂️ Migrating categories...');
  const wpCategories = channel['wp:category'];
  const categoryRefs = {};
  for (const cat of wpCategories) {
    const catDoc = {
      _type: 'category',
      _id: 'category-' + cat['wp:term_id'],
      title: { _type: 'localeString', ja: cat['wp:cat_name']['__cdata'] },
      slug: { _type: 'slug', current: decodeURIComponent(cat['wp:category_nicename']['__cdata']) },
    };
    await sanityClient.createOrReplace(catDoc);
    categoryRefs[cat['wp:cat_name']['__cdata']] = { _type: 'reference', _ref: catDoc._id };
    console.log(`  - Category "${catDoc.title.ja}" migrated.`);
  }
  console.log('✅ Categories migrated.');

  // 4. タグを移行
  console.log('🏷️ Migrating tags...');
  const wpTags = channel['wp:tag'];
  const tagRefs = {};
  for (const tag of wpTags) {
    const tagDoc = {
      _type: 'tag',
      _id: 'tag-' + tag['wp:term_id'],
      title: { _type: 'localeString', ja: tag['wp:tag_name']['__cdata'] },
      slug: { _type: 'slug', current: tag['wp:tag_slug']['__cdata'] },
    };
    await sanityClient.createOrReplace(tagDoc);
    tagRefs[tag['wp:tag_name']['__cdata']] = { _type: 'reference', _ref: tagDoc._id };
    console.log(`  - Tag "${tagDoc.title.ja}" migrated.`);
  }
  console.log('✅ Tags migrated.');

  // 5. itemを投稿とアタッチメントに分類する
  const allItems = [].concat(channel.item);
  const attachments = allItems.filter(item => item['wp:post_type'] && item['wp:post_type']['__cdata'] === 'attachment');
  const wpPosts = allItems.filter(item => 
    item['wp:post_type'] && item['wp:post_type']['__cdata'] === 'post' && 
    item['wp:status'] && item['wp:status']['__cdata'] === 'publish'
  );

  // 6. アタッチメント（画像）のURLをマッピング
  console.log('🖼️ Mapping attachments...');

  const attachmentMap = attachments.reduce((acc, item) => {
    const postId = item['wp:post_id'];
    const imageUrl = item.guid && item.guid['#text']; // Correctly access the URL from the '#text' property

    if (postId && imageUrl) {
      acc[postId] = imageUrl;
    }
    return acc;
  }, {});
  console.log(`✅ Mapped ${Object.keys(attachmentMap).length} attachments.`);

  // 7. 投稿を移行
  console.log('📝 Migrating posts...');
  let migratedCount = 0;
  for (const post of wpPosts) {
    const postTitle = post.title['__cdata'] || `(No Title - ID: ${post['wp:post_id']})`;
    console.log(`  - Migrating post: "${postTitle}"`);

    const bodyHtml = post['content:encoded']['__cdata'];
    const speechBubbleRule = {
      deserialize(el, next, block) {
        // Rule only applies to DIV elements with a class attribute containing "balloon"
        if (el.tagName && el.tagName.toLowerCase() === 'div' && el.className && typeof el.className === 'string' && el.className.toLowerCase().includes('balloon')) {
          const faceIcon = el.querySelector('.faceicon');
          const chatting = el.querySelector('.chatting .says');

          if (!faceIcon || !chatting) {
            return undefined;
          }

          const speakerEl = faceIcon.querySelector('p');
          const avatarEl = faceIcon.querySelector('img');
          const textHtml = chatting.innerHTML;

          const speaker = speakerEl ? speakerEl.textContent.trim() : (avatarEl ? avatarEl.getAttribute('alt') : 'Anonymous');
          const avatar = avatarEl ? avatarEl.getAttribute('src') : '';
          const position = el.className.toLowerCase().includes('_l') ? 'left' : 'right';

          const textBlocks = htmlToBlocks(textHtml, blockContentType);

          return block({
            _type: 'speechBubble',
            speaker,
            avatar,
            position,
            text: textBlocks,
          });
        }

        // Let the default rules handle this
        return undefined;
      },
    };

    const bodySchema = Schema.compile({
      name: 'bodySchema',
      types: [
        {
          name: 'speechBubble',
          type: 'object',
          fields: [
            { name: 'speaker', type: 'string' },
            { name: 'avatar', type: 'string' },
            { name: 'position', type: 'string' },
            {
              name: 'text',
              type: 'array',
              of: [{
                type: 'block',
                styles: [],
                lists: [],
                marks: {
                  decorators: [{ title: 'Strong', value: 'strong' }, { title: 'Emphasis', value: 'em' }],
                  annotations: [{ name: 'link', type: 'object', fields: [{ name: 'href', type: 'url' }] }]
                }
              }]
            }
          ]
        },
        {
          name: 'body',
          type: 'array',
          of: [
            {
              type: 'block',
              styles: [
                { title: 'Normal', value: 'normal' },
                { title: 'H1', value: 'h1' },
                { title: 'H2', value: 'h2' },
                { title: 'H3', value: 'h3' },
                { title: 'H4', value: 'h4' },
                { title: 'Quote', value: 'blockquote' },
              ],
              lists: [
                { title: 'Bullet', value: 'bullet' },
                { title: 'Numbered', value: 'number' },
              ],
              marks: {
                decorators: [
                  { title: 'Strong', value: 'strong' },
                  { title: 'Emphasis', value: 'em' },
                  { title: 'Code', value: 'code' },
                ],
                annotations: [
                  {
                    name: 'link',
                    type: 'object',
                    title: 'URL',
                    fields: [{ name: 'href', type: 'url' }],
                  },
                ],
              },
            },
            { type: 'image' },
            { type: 'speechBubble' },
          ],
        }
      ]
    });

    const blockContentType = bodySchema.get('body');
    const portableTextBody = htmlToBlocks(
      bodyHtml,
      blockContentType,
      {
        parseHtml: (html) => new JSDOM(html).window.document,
        rules: [speechBubbleRule],
      }
    );

    const postCategories = [].concat(post.category).filter(c => c['@_domain'] === 'category').map(c => categoryRefs[c['__cdata']]).filter(Boolean);
    const postTags = [].concat(post.category).filter(c => c['@_domain'] === 'post_tag').map(c => tagRefs[c['__cdata']]).filter(Boolean);

    const postDoc = {
      _type: 'post',
      _id: 'post-' + post['wp:post_id'],
      title: { _type: 'localeString', ja: postTitle },
      slug: { _type: 'slug', current: decodeURIComponent(post['wp:post_name']['__cdata']) },
      excerpt: { _type: 'localeText', ja: post['excerpt:encoded']['__cdata'] || '' },
      publishedAt: new Date(post['wp:post_date_gmt']['__cdata'] + 'Z').toISOString(),
      author: { _type: 'reference', _ref: authorDoc._id },
      categories: postCategories.length > 0 ? [postCategories[0]] : [], // 最初のカテゴリのみ
      tags: postTags,
      body: { _type: 'localeBlock', ja: portableTextBody },
    };

    // アイキャッチ画像の処理
    const postMeta = [].concat(post['wp:postmeta']);
    const thumbnailIdMeta = postMeta.find(meta => meta['wp:meta_key']['__cdata'] === '_thumbnail_id');
    if (thumbnailIdMeta) {
      const thumbnailId = thumbnailIdMeta['wp:meta_value']['__cdata'];
      const imageUrl = attachmentMap[thumbnailId];
      if (imageUrl) {
        console.log(`  - Found thumbnail for "${postTitle}": ${imageUrl}`);

        try {
          // Resolve relative URLs to absolute URLs
          const absoluteImageUrl = new URL(imageUrl, siteUrl).href;
          console.log(`    - Attempting to fetch from: ${absoluteImageUrl}`);

          const imageResponse = await fetch(absoluteImageUrl);
          if (!imageResponse.ok) {
            throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
          }
          const imageBuffer = await imageResponse.buffer();
          const urlObject = new URL(absoluteImageUrl);
          const imageAsset = await sanityClient.assets.upload('image', imageBuffer, {
            filename: path.basename(urlObject.pathname),
          });

          postDoc.mainImage = {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: imageAsset._id,
            },
          };
          console.log(`    - ✅ Successfully uploaded and linked image for post "${postTitle}"`);
        } catch (err) {
          console.error(`    - ❌ Failed to upload image for post "${postTitle}": ${err.message}`);
        }
      }
    }

    await sanityClient.createOrReplace(postDoc);
    migratedCount++;
  }
  console.log(`✅ ${migratedCount} posts migrated.`);
  console.log('🎉 Migration completed successfully!');
}

migrate().catch(err => {
  console.error('❌ An unexpected error occurred during migration:', err);
});
