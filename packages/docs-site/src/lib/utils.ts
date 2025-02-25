import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * CSS class 이름을 병합하는 유틸리티 함수
 * 
 * @param inputs - 병합할 class 이름들
 * @returns 병합된 class 이름
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
} 