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
      const { 
        speaker = 'Anonymous', 
        text = '', 
        avatar = '', 
        position = 'left', 
        style = 'default', 
        bgColor = '',
        textColor = '',
        iconColor = ''
      } = value;
      
      const isLeft = position === 'left';
      
      // スタイルに基づいて背景色とテキスト色を決定
      let bubbleBgColor = '';
      let bubbleTextColor = 'text-white';
      let avatarBgColor = 'bg-gray-500';
      let tailClasses = '';
      
      switch (style) {
        case 'simple':
          bubbleBgColor = isLeft ? 'bg-gray-700' : 'bg-purple-800';
          tailClasses = '';
          break;
        case 'think':
          bubbleBgColor = isLeft ? 'bg-blue-700' : 'bg-indigo-800';
          tailClasses = 'after:content-[""] after:absolute after:border-8 ' + 
            (isLeft ? 'after:-left-4 after:border-r-blue-700 after:border-l-transparent' : 
                      'after:-right-4 after:border-l-indigo-800 after:border-r-transparent') + 
            ' after:border-t-transparent after:border-b-transparent after:top-5';
          break;
        case 'shout':
          bubbleBgColor = isLeft ? 'bg-red-700' : 'bg-orange-800';
          bubbleTextColor = 'text-white font-bold';
          break;
        case 'whisper':
          bubbleBgColor = isLeft ? 'bg-gray-600' : 'bg-gray-700';
          bubbleTextColor = 'text-gray-200 italic';
          break;
        case 'memo':
          bubbleBgColor = isLeft ? 'bg-yellow-600' : 'bg-amber-700';
          break;
        default: // default
          bubbleBgColor = isLeft ? 'bg-gray-700' : 'bg-purple-800';
          tailClasses = 'after:content-[""] after:absolute after:border-8 ' + 
            (isLeft ? 'after:-left-4 after:border-r-gray-700 after:border-l-transparent' : 
                      'after:-right-4 after:border-l-purple-800 after:border-r-transparent') + 
            ' after:border-t-transparent after:border-b-transparent after:top-5';
      }
      
      // カスタム色が指定されている場合は上書き
      if (bgColor) bubbleBgColor = bgColor;
      if (textColor) bubbleTextColor = textColor;
      if (iconColor) avatarBgColor = iconColor;
      
      // 吹き出しの角丸スタイル
      const cornerClasses = isLeft ? 'rounded-tr-lg rounded-bl-lg rounded-br-lg' : 'rounded-tl-lg rounded-bl-lg rounded-br-lg';
      
      // アバター画像のURLがSanityの参照形式かどうかをチェック
      const isImageReference = typeof avatar === 'object' && avatar?._type === 'image' && avatar?.asset?._ref;
      
      return (
        <div className={`flex items-start my-6 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
          <div className={`w-16 h-16 rounded-full ${avatarBgColor} flex-shrink-0 flex items-center justify-center font-bold text-white overflow-hidden border-2 border-white/20 shadow-lg`}>
            {avatar ? (
              isImageReference ? (
                <Image 
                  src={urlFor(avatar).width(64).height(64).url()} 
                  alt={speaker} 
                  width={64} 
                  height={64} 
                  className="w-full h-full object-cover" 
                />
              ) : typeof avatar === 'string' && avatar.startsWith('http') ? (
                <Image 
                  src={avatar} 
                  alt={speaker} 
                  width={64} 
                  height={64} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <span>{speaker.charAt(0).toUpperCase()}</span>
              )
            ) : (
              <span>{speaker.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className={`mx-4 flex-1`}>
            <p className={`font-bold mb-1 ${isLeft ? 'text-left' : 'text-right'} text-cyan-300`}>{speaker}</p>
            <div className={`relative p-4 ${cornerClasses} ${bubbleBgColor} ${bubbleTextColor} ${tailClasses}`}>
              <div className="whitespace-pre-wrap prose prose-invert prose-sm max-w-none">{text}</div>
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
