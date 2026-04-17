import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
         "flex h-10 w-full rounded-lg border border-white/10 bg-white/5 backdrop-blur-md px-3 py-2 text-sm text-white placeholder:text-white/30",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7F77DD]/50 focus-visible:border-[#7F77DD]/40",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
