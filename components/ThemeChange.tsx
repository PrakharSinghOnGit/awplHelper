"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import {
  ThemeAnimationType,
  useModeAnimation,
} from "react-theme-switch-animation";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { ref, toggleSwitchTheme } = useModeAnimation({
    animationType: ThemeAnimationType.BLUR_CIRCLE,
    blurAmount: 3,
    duration: 500,
  });

  return (
    <div>
      <Button
        ref={ref}
        variant="secondary"
        size="icon"
        onClick={toggleSwitchTheme}
      >
        <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      </Button>
    </div>
  );
}
