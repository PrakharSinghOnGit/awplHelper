"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
// import { useTheme } from "next-themes";
import { useModeAnimation } from "react-theme-switch-animation";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { ref, toggleSwitchTheme } = useModeAnimation({
    duration: 400, // Optional: adjust animation duration
  });

  // const { setTheme } = useTheme();
  // function changeTheme() {
  //   if (document.documentElement.classList.contains("dark")) {
  //     setTheme("light");
  //   } else {
  //     setTheme("dark");
  //   }
  // }

  return (
    <div>
      <Button
        ref={ref}
        variant="secondary"
        size="icon"
        // onClick={() => changeTheme()}
        onClick={toggleSwitchTheme}
        aria-label="Toggle theme"
      >
        <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      </Button>
    </div>
  );
}
