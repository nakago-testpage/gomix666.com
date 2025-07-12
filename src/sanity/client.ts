import { createClient } from 'next-sanity'

// 環境変数を取得してデバッグログを出力
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03'
const token = process.env.SANITY_API_TOKEN

// デバッグログ
console.log('Sanity Client Configuration:')
console.log('- Project ID:', projectId || 'Not set')
console.log('- Dataset:', dataset || 'Not set')
console.log('- API Version:', apiVersion)
console.log('- Token exists:', token ? 'Yes' : 'No')

// 環境変数が設定されていない場合の警告
if (!projectId || !dataset) {
  console.error('WARNING: Sanity environment variables are missing!')
}

// プロジェクトIDが短すぎる場合の警告
if (projectId && projectId.length < 10) {
  console.warn('WARNING: Sanity project ID seems too short. Please verify it is correct.')
}

export const client = createClient({
  projectId: projectId || '',
  dataset: dataset || 'production',
  apiVersion, 
  useCdn: false, // CDNキャッシュを無効化して常に最新データを取得
  perspective: 'published',
  stega: {
    enabled: false,
  },
  token, // 認証トークンがあれば使用
  // トークンがなくても読み取り専用アクセスを許可
  ignoreBrowserTokenWarning: true
})
