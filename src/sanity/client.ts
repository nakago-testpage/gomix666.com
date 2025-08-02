import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION
const token = process.env.SANITY_API_TOKEN

// デバッグログ
console.log('Sanity Client Configuration:')
console.log(`- Project ID: ${projectId || 'not set'}`)
console.log(`- Dataset: ${dataset || 'not set'}`)
console.log(`- API Version: ${apiVersion || 'not set'}`)
console.log(`- Token exists: ${token ? 'Yes' : 'No'}`)

export const client = createClient({
  projectId: projectId || '',
  dataset: dataset || 'production',
  apiVersion: apiVersion || '2023-05-03', 
  useCdn: false, // CDNキャッシュを無効化して常に最新データを取得
  perspective: 'published',
  stega: {
    enabled: false,
  },
  token, // 認証トークンがあれば使用
  // トークンがなくても読み取り専用アクセスを許可
  ignoreBrowserTokenWarning: true
})
