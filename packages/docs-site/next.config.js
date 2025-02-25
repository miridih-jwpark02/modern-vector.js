/** @type {import('next').NextConfig} */
import { withContentlayer } from 'next-contentlayer';

const nextConfig = {
  output: 'export', // 정적 사이트 생성을 위한 설정
  distDir: 'dist',
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