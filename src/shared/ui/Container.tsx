import type { ReactNode } from "react";
import { cn } from "../utils/cn";

interface ContainerProps {
  children?: ReactNode;
  className?: string;
}

function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={cn(
        "container mx-auto px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-20",
        className
      )}>
      {children}
    </div>
  );
}

export default Container;
