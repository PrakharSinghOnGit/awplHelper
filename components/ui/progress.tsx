"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  childClassName?: string;
  animDuration?: number;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, childClassName, animDuration, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
      className
    )}
    {...props}
  >
    <motion.div
      className={cn("h-full w-full flex-1", childClassName)}
      initial={{ transform: `translateX(-100%)` }}
      animate={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      transition={{ duration: (animDuration || 500) / 1000, ease: "easeInOut" }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
