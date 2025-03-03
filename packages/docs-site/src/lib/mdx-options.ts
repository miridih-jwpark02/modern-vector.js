import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkGfm from 'remark-gfm';

/**
 * MDX 변환에 사용되는 옵션
 */
export const mdxOptions = {
  // MDX를 파싱하기 위한 remark 플러그인
  remarkPlugins: [remarkGfm],
  // HTML 변환을 위한 rehype 플러그인
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
        theme: 'github-dark',
        keepBackground: true,
        defaultLang: 'plaintext',
        onVisitLine(node: any) {
          // 라인 번호 추가
          if (node.children.length === 0) {
            node.children = [{ type: 'text', value: ' ' }];
          }
        },
        onVisitHighlightedLine(node: any) {
          node.properties.className = ['highlighted'];
        },
        onVisitHighlightedWord(node: any) {
          node.properties.className = ['word'];
        },
        // 코드 블록에 라인 번호 표시
        showLineNumbers: true,
        // 메타 정보 표시 (언어 이름)
        filterMetaString: (meta: any) => meta,
      },
    ],
  ],
};
