import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION

export const client = createClient({
  projectId,
  dataset,
  apiVersion, 
  useCdn: false, // CDNキャッシュを無効化して常に最新データを取得
  perspective: 'published',
  stega: {
    enabled: false,
  },
  // リクエストタイムアウトを増やす
  token: process.env.SANITY_API_TOKEN, // 認証トークンがあれば使用
})
