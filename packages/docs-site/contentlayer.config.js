import { defineDocumentType, makeSource } from 'contentlayer/source-files';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkGfm from 'remark-gfm';

/**
 * API 문서 타입 정의
 */
export const ApiDoc = defineDocumentType(() => ({
  name: 'ApiDoc',
  filePathPattern: `api-docs/**/*.md`,
  contentType: 'markdown',
  fields: {
    title: {
      type: 'string',
      description: 'API 문서의 제목',
      required: true,
    },
    description: {
      type: 'string',
      description: 'API 문서의 간략한 설명',
      required: false,
    },
    category: {
      type: 'string',
      description: '문서 카테고리 (classes, interfaces, type-aliases 등)',
      required: false,
    },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: doc => doc._raw.flattenedPath.replace('api-docs/', ''),
    },
    url: {
      type: 'string',
      resolve: doc => `/api-docs/${doc._raw.flattenedPath.replace('api-docs/', '')}`,
    },
  },
}));

/**
 * 일반 문서 타입 정의
 */
export const Doc = defineDocumentType(() => ({
  name: 'Doc',
  filePathPattern: `docs/**/*.md`,
  contentType: 'markdown',
  fields: {
    title: {
      type: 'string',
      description: '문서 제목',
      required: true,
    },
    description: {
      type: 'string',
      description: '문서 설명',
      required: false,
    },
    order: {
      type: 'number',
      description: '문서 정렬 순서',
      required: false,
    },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: doc => doc._raw.flattenedPath.replace('docs/', ''),
    },
    url: {
      type: 'string',
      resolve: doc => `/docs/${doc._raw.flattenedPath.replace('docs/', '')}`,
    },
  },
}));

/**
 * Contentlayer 소스 설정
 */
export default makeSource({
  contentDirPath: 'public',
  documentTypes: [ApiDoc, Doc],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ['anchor'],
            ariaLabel: 'anchor',
          },
          behavior: 'wrap',
          content: {
            type: 'element',
            tagName: 'span',
            properties: {
              className: ['anchor-icon'],
            },
            children: [
              {
                type: 'text',
                value: '#',
              },
            ],
          },
        },
      ],
      [
        rehypePrettyCode,
        {
          theme: 'one-dark',
          keepBackground: true,
          defaultLang: 'plaintext',
          onVisitLine(node) {
            // 라인 번호 추가
            if (node.children.length === 0) {
              node.children = [{ type: 'text', value: ' ' }];
            }
          },
          onVisitHighlightedLine(node) {
            node.properties.className = ['highlighted'];
          },
          onVisitHighlightedWord(node) {
            node.properties.className = ['word'];
          },
          // 코드 블록에 라인 번호 표시
          showLineNumbers: true,
          // 메타 정보 표시 (언어 이름)
          filterMetaString: meta => meta,
        },
      ],
    ],
  },
});
