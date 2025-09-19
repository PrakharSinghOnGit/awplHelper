"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pickaxe, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { cn } from "@/lib/utils";

interface AuthButtonsProps {
  className?: string;
  variant?: "hero" | "header";
  isScrolled?: boolean;
}

export function AuthButtons({
  className,
  variant = "header",
  isScrolled,
}: AuthButtonsProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className={cn("animate-pulse", className)}>
        {variant === "hero" ? (
          <div className="bg-muted rounded-xl h-12 w-32" />
        ) : (
          <>
            <div className="bg-muted rounded-lg h-9 w-16" />
            <div className="bg-muted rounded-lg h-9 w-20" />
          </>
        )}
      </div>
    );
  }

  if (user) {
    if (variant === "hero") {
      return (
        <div
          className={cn(
            "bg-foreground/10 rounded-[14px] border p-0.5",
            className
          )}
        >
          <Button
            asChild
            size="lg"
            className="w-full rounded-xl px-5 text-base"
          >
            <Link href="/protected">
              <span className="flex gap-2 items-center text-nowrap">
                Dashboard
                <LayoutDashboard className="size-4" />
              </span>
            </Link>
          </Button>
        </div>
      );
    } else {
      return (
        <Button asChild size="sm" className={className}>
          <Link href="/protected">
            <span className="flex gap-2 items-center">
              <LayoutDashboard className="size-4" />
              Dashboard
            </span>
          </Link>
        </Button>
      );
    }
  }

  if (variant === "hero") {
    return (
      <div
        className={cn(
          "bg-foreground/10 rounded-[14px] border p-0.5",
          className
        )}
      >
        <Button asChild size="lg" className="rounded-xl px-5 text-base">
          <Link href="/protected">
            <span className="flex gap-2 items-center text-nowrap">
              Get Started
              <Pickaxe className="size-4" />
            </span>
          </Link>
        </Button>
      </div>
    );
  } else {
    return (
      <>
        <Button
          asChild
          variant="outline"
          size="sm"
          className={cn(isScrolled && "lg:hidden")}
        >
          <Link href="/auth/login">
            <span>Login</span>
          </Link>
        </Button>
        <Button asChild size="sm" className={cn(isScrolled && "lg:hidden")}>
          <Link href="/auth/sign-up">
            <span>Sign Up</span>
          </Link>
        </Button>
        <Button
          asChild
          size="sm"
          className={cn(isScrolled ? "lg:inline-flex" : "hidden")}
        >
          <Link href="/protected">
            <span>Get Started</span>
          </Link>
        </Button>
      </>
    );
  }
}
