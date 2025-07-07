import {defineType, defineField} from 'sanity'
import {supportedLanguages} from './localeString'

// 多言語対応のリッチテキスト型を定義
export const localeBlockContent = defineType({
  title: 'Localized block content',
  name: 'localeBlockContent',
  type: 'object',
  fieldsets: [
    {
      title: 'Translations',
      name: 'translations',
      options: {collapsible: true},
    },
  ],
  // 各言語の入力フィールドを動的に生成
  fields: supportedLanguages.map((lang) =>
    defineField({
      title: lang.title,
      name: lang.id,
      type: 'array',
      // 本文に含めることができる要素（テキストブロック、画像など）
      of: [{type: 'block'}, {type: 'image'}],
      fieldset: lang.isDefault ? undefined : 'translations',
      validation: (Rule) => (lang.isDefault ? Rule.required() : Rule),
    })
  ),
});
