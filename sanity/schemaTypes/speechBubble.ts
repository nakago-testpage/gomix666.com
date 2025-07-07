import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'speechBubble',
  title: 'Speech Bubble',
  type: 'object',
  fields: [
    defineField({
      name: 'speaker',
      title: 'Speaker',
      type: 'string',
      description: 'The name of the person speaking.',
    }),
    defineField({
      name: 'avatar',
      title: 'Avatar',
      type: 'image',
      description: 'An image of the speaker.',
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'text',
      description: 'The content of the speech bubble.',
    }),
    defineField({
      name: 'position',
      title: 'Position',
      type: 'string',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Right', value: 'right' },
        ],
        layout: 'radio',
      },
      initialValue: 'left',
    }),
  ],
});
