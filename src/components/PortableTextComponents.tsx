import React from 'react';
import { urlFor } from '@/sanity/image';
import Image from 'next/image';
import Link from 'next/link';
import { PortableTextReactComponents } from '@portabletext/react';

const PortableTextComponents: Partial<PortableTextReactComponents> = {
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) {
        return null;
      }
      return (
        <div className="my-8">
          <Image
            src={urlFor(value).width(1200).height(675).fit('max').auto('format').url()}
            alt={value.alt || ' '}
            width={1200}
            height={675}
            className="rounded-lg w-full h-auto"
            loading="lazy"
          />
        </div>
      );
    },
    speechBubble: ({ value }) => {
      const { speaker = 'Anonymous', text = '', avatar = '', position = 'left' } = value;
      const isLeft = position === 'left';

      const bubbleClasses = isLeft
        ? 'bg-gray-700 rounded-br-lg'
        : 'bg-purple-800 rounded-bl-lg';

      return (
        <div className={`flex items-start my-6 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
          <div className="w-16 h-16 rounded-full bg-gray-500 flex-shrink-0 flex items-center justify-center font-bold text-white overflow-hidden">
            {avatar ? (
              <Image src={avatar} alt={speaker} width={64} height={64} className="w-full h-full object-cover" />
            ) : (
              <span>{speaker.charAt(0)}</span>
            )}
          </div>
          <div className={`mx-4 flex-1`}>
            <p className={`font-bold mb-1 ${isLeft ? 'text-left' : 'text-right'}`}>{speaker}</p>
            <div className={`relative p-4 rounded-lg text-white ${bubbleClasses}`}>
              <p className="whitespace-pre-wrap">{text}</p>
            </div>
          </div>
        </div>
      );
    },
  },
  marks: {
    link: ({ children, value }) => {
      const rel = !value?.href?.startsWith('/') ? 'noreferrer noopener' : undefined;
      const target = !value?.href?.startsWith('/') ? '_blank' : undefined;
      return (
        <Link href={value?.href || '#'} rel={rel} target={target} className="text-purple-400 hover:text-purple-300 underline">
          {children}
        </Link>
      );
    },
  },
  block: {
    h1: ({ children }) => <h1 className="text-4xl font-extrabold my-6 text-cyan-300">{children}</h1>,
    h2: ({ children }) => <h2 className="text-3xl font-bold my-5 text-cyan-300">{children}</h2>,
    h3: ({ children }) => <h3 className="text-2xl font-bold my-4 text-cyan-300">{children}</h3>,
    h4: ({ children }) => <h4 className="text-xl font-bold my-3 text-cyan-300">{children}</h4>,
    blockquote: ({ children }) => <blockquote className="border-l-4 border-purple-500 pl-4 my-6 italic text-gray-400">{children}</blockquote>,
  },
};

export default PortableTextComponents;
