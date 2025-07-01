import * as React from "react";

import { cn } from "@/lib/utils";

function Input({
  className,
  icon,
  type,
  ...props
}: React.ComponentProps<"input"> & { icon?: React.ReactNode }) {
  return (
    <div className="w-full ">
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-2 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          data-slot="input"
          className={cn(
            "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full rounded-md border bg-transparent py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            icon ? "pl-7 pr-3" : "px-3",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            className
          )}
          {...props}
        />
      </div>
    </div>
  );
}

export { Input };
