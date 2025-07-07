import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {documentInternationalization} from '@sanity/document-internationalization'

// Import schemas
import post from './schemas/post'
import category from './schemas/category'
import tag from './schemas/tag'
import author from './schemas/author'
import blockContent from './schemas/blockContent'
import {localeString} from './schemas/localeString'
import {localeBlockContent} from './schemas/localeBlockContent'

const schemaTypes = [post, category, tag, author, blockContent, localeString, localeBlockContent]

export default defineConfig({
  name: 'default',
  title: 'gomix666 blog',

  projectId: '9e48b1ir',
  dataset: 'production',

  plugins: [
    structureTool(),
    visionTool(),
    documentInternationalization({
      supportedLanguages: [
        {id: 'ja', title: 'Japanese'},
        {id: 'en', title: 'English'}
      ],
      schemaTypes: ['post', 'author', 'category', 'tag'],
    })
  ],

  schema: {
    types: schemaTypes,
  },
})
