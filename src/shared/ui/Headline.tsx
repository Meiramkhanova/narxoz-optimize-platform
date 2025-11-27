"use client";

import { forwardRef, ReactNode } from "react";
import { cn } from "../utils/cn";

type HeadlineTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type HeadlineSizes = "sm" | "md" | "lg" | "xl";

const HeadlineSizeClasses: Record<HeadlineSizes, string> = {
  sm: "text-base uppercase tracking-wider",
  md: "text-2xl 2xl:text-3xl",
  lg: "text-4xl",
  xl: "text-5xl",
};

export interface HeadlineProps {
  as?: HeadlineTag;
  children?: ReactNode;
  size?: HeadlineSizes;
  className?: string;
}

/**
 * @param size - размер заголовка (по умолчанию "md")
 * @param as - HTML-тег (по умолчанию "h2")
 */

const Headline = forwardRef<HTMLHeadingElement, HeadlineProps>(
  ({ as: Tag = "h2", size = "md", className, children, ...props }, ref) => {
    return (
      <Tag
        ref={ref}
        className={cn(HeadlineSizeClasses[size], className)}
        {...props}>
        {children}
      </Tag>
    );
  }
);

Headline.displayName = "Headline";

export { Headline };
