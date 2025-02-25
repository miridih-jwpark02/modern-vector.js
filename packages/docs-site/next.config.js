/** @type {import('next').NextConfig} */
import { withContentlayer } from 'next-contentlayer';

// GitHub Pages 배포를 위한 base path 설정
const isProduction = process.env.NODE_ENV === 'production';
const repoName = 'modern-vector.js'; // GitHub 저장소 이름에 맞게 수정

const nextConfig = {
  output: 'export', // 정적 사이트 생성을 위한 설정
  distDir: 'dist',
  basePath: isProduction ? `/${repoName}` : '',
  assetPrefix: isProduction ? `/${repoName}/` : '',
  images: {
    unoptimized: true, // 정적 내보내기를 위해 이미지 최적화 비활성화
  },
  eslint: {
    ignoreDuringBuilds: true, // 빌드 중 ESLint 오류 무시
  },
  typescript: {
    ignoreBuildErrors: true, // 빌드 중 TypeScript 오류 무시
  },
};

export default withContentlayer(nextConfig); 