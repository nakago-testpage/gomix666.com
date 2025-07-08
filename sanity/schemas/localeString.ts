import {defineType, defineField} from 'sanity'

// サポートする言語を定義
export const supportedLanguages = [
  {id: 'ja', title: 'Japanese', isDefault: true},
  {id: 'en', title: 'English'},
]

// デフォルト言語を取得
export const baseLanguage = supportedLanguages.find((l) => l.isDefault)

// 多言語対応の文字列型を定義
export const localeString = defineType({
  title: 'Localized string',
  name: 'localeString',
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
      type: 'string',
      // デフォルト言語でない場合は、折りたたみ可能なフィールドセットに含める
      fieldset: lang.isDefault ? undefined : 'translations',
      validation: (Rule) => (lang.isDefault ? Rule.required() : Rule),
    })
  ),
});
