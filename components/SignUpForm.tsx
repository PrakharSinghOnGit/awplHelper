"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import Link from "next/link";

import { Separator } from "@/components/ui/separator";
import { GoogleLogo } from "./ui/Google";

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [awplId, setAwplId] = useState("");
  const [awplPass, setAwplPass] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("SignUp Not Implemented");
    setMessage("");

    console.log("TODO: ", email, password, awplId, awplPass);
  };

  const handleGoogleSignUp = async () => {
    console.log("TODO: Google Sign-up");
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create an Account</CardTitle>
          <CardDescription>
            Enter your details to sign up for Awpl Helper
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="me@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password..."
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="awplId">AWPL ID</Label>
                <Input
                  id="awplId"
                  type="text"
                  placeholder="Your AWPL ID"
                  required
                  value={awplId}
                  onChange={(e) => setAwplId(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="awplPass">AWPL Password</Label>
                <Input
                  id="awplPass"
                  type="password"
                  placeholder="Your AWPL Password"
                  required
                  value={awplPass}
                  onChange={(e) => setAwplPass(e.target.value)}
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {message && <p className="text-green-500 text-sm">{message}</p>}
              <Button type="submit" className="w-full">
                Sign Up with Email
              </Button>
            </div>
          </form>
          <Separator className="my-4" />
          <div className="grid gap-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignUp}
            >
              <GoogleLogo />
              Sign Up with Google
            </Button>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline">
                Log in
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        Look at the source code at{" "}
        <a href="https://github.com/PrakharSinghOnGit/awplHelper">GitHub</a> and
        give it a star {":)"}{" "}
        <Link href={"/help"} className="underline">
          help
        </Link>
      </div>
    </div>
  );
}
