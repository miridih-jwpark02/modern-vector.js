#!/usr/bin/env node

/**
 * Markdown 파일에 필요한 메타데이터를 추가하는 스크립트
 * 
 * Contentlayer에서 필요한 title, category 등의 메타데이터를 추가합니다.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM에서 __dirname 대체
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// API 문서 디렉토리 경로
const API_DOCS_DIR = path.join(__dirname, '../public/api-docs');

/**
 * 파일 이름에서 타이틀 추출
 */
function extractTitleFromFilename(filename) {
  return path.basename(filename, '.md');
}

/**
 * 디렉토리 이름에서 카테고리 추출
 */
function getCategoryFromDir(dirPath) {
  const dirName = path.basename(dirPath);
  return dirName;
}

/**
 * Markdown 파일에 메타데이터 추가
 */
function addMetadataToMarkdown(filePath, category) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const title = extractTitleFromFilename(filePath);
    
    // 이미 메타데이터가 있는지 확인
    if (content.startsWith('---\n')) {
      console.log(`Skipping ${filePath} - already has metadata`);
      return;
    }
    
    // 메타데이터 추가
    const metadata = `---
title: ${title}
category: ${category}
---

`;
    
    // 새 내용 작성
    const newContent = metadata + content;
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Added metadata to ${filePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

/**
 * 디렉토리 내의 모든 Markdown 파일 처리
 */
function processDirectory(dirPath) {
  try {
    const category = getCategoryFromDir(dirPath);
    const files = fs.readdirSync(dirPath);
    
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        // 하위 디렉토리 처리
        processDirectory(filePath);
      } else if (file.endsWith('.md')) {
        // Markdown 파일 처리
        addMetadataToMarkdown(filePath, category);
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${dirPath}:`, error);
  }
}

/**
 * 메인 함수
 */
function main() {
  console.log('Adding metadata to Markdown files...');
  
  // README.md 파일 처리
  const readmePath = path.join(API_DOCS_DIR, 'README.md');
  if (fs.existsSync(readmePath)) {
    addMetadataToMarkdown(readmePath, 'general');
  }
  
  // 각 카테고리 디렉토리 처리
  const categories = ['classes', 'interfaces', 'type-aliases'];
  for (const category of categories) {
    const categoryDir = path.join(API_DOCS_DIR, category);
    if (fs.existsSync(categoryDir)) {
      processDirectory(categoryDir);
    }
  }
  
  console.log('Metadata addition completed!');
}

// 스크립트 실행
main(); 