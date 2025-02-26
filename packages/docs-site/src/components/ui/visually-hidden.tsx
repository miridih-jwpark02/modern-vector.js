"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * VisuallyHidden 컴포넌트 props
 */
interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLSpanElement> {}

/**
 * VisuallyHidden 컴포넌트
 * 시각적으로는 숨겨지지만 스크린 리더에서는 읽히는 컴포넌트입니다.
 * 
 * @param props - 컴포넌트 props
 * @returns VisuallyHidden 컴포넌트
 */
const VisuallyHidden = React.forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  ({ className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "absolute w-[1px] h-[1px] p-0 -m-[1px] overflow-hidden clip-rect-0 whitespace-nowrap border-0",
          className
        )}
        {...props}
      />
    );
  }
);

VisuallyHidden.displayName = "VisuallyHidden";

export { VisuallyHidden }; 