import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TopBar from "@/components/ui/topBar";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (!error || data.user) {
    redirect("/protected/dashboard");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <main className="flex-1">
        <section id="hero" className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Easy way to get all the Data you need.
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Awpl Helper is a open source project that will help you
                    organise your team and extract data
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    href="/auth/login"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
              <Image
                src="/mockup.jpeg"
                width="550"
                height="550"
                alt="Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
              />
            </div>
          </div>
        </section>

        <section id="stats" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="text-4xl font-bold">10k+</div>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </div>
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="text-4xl font-bold">500+</div>
                <p className="text-sm text-muted-foreground">Teams</p>
              </div>
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="text-4xl font-bold">99.9%</div>
                <p className="text-sm text-muted-foreground">Uptime</p>
              </div>
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="text-4xl font-bold">24/7</div>
                <p className="text-sm text-muted-foreground">Support</p>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  How It Works
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  A simple, three-step process to get you up and running.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="grid gap-1">
                <h3 className="text-xl font-bold">1. Sign Up</h3>
                <p className="text-muted-foreground">
                  Create an account to get started.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-xl font-bold">2. Add Your Team</h3>
                <p className="text-muted-foreground">
                  Invite your team members to collaborate.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-xl font-bold">3. Analyze Data</h3>
                <p className="text-muted-foreground">
                  Extract and visualize your team&apos;s data.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="pricing"
          className="w-full py-12 md:py-24 lg:py-32 border-t"
        >
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Pricing
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Choose the plan that&apos;s right for you.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col p-6 bg-muted rounded-lg justify-between">
                <div>
                  <h3 className="text-2xl font-bold">Free</h3>
                  <p className="text-sm text-muted-foreground">
                    For individuals and small teams.
                  </p>
                  <div className="text-4xl font-bold mt-4">$0</div>
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <li>Up to 5 team members</li>
                    <li>Basic analytics</li>
                    <li>Community support</li>
                  </ul>
                </div>
                <Link
                  href="/auth/sign-up"
                  className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  prefetch={false}
                >
                  Sign Up
                </Link>
              </div>
              <div className="flex flex-col p-6 bg-muted rounded-lg justify-between">
                <div>
                  <h3 className="text-2xl font-bold">Pro</h3>
                  <p className="text-sm text-muted-foreground">
                    For growing teams.
                  </p>
                  <div className="text-4xl font-bold mt-4">$10</div>
                  <p className="text-sm text-muted-foreground">per month</p>
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <li>Up to 20 team members</li>
                    <li>Advanced analytics</li>
                    <li>Priority email support</li>
                  </ul>
                </div>
                <Link
                  href="/auth/sign-up"
                  className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  prefetch={false}
                >
                  Sign Up
                </Link>
              </div>
              <div className="flex flex-col p-6 bg-muted rounded-lg justify-between">
                <div>
                  <h3 className="text-2xl font-bold">Enterprise</h3>
                  <p className="text-sm text-muted-foreground">
                    For large organizations.
                  </p>
                  <div className="text-4xl font-bold mt-4">Contact Us</div>
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <li>Unlimited team members</li>
                    <li>Custom analytics</li>
                    <li>Dedicated support</li>
                  </ul>
                </div>
                <Link
                  href="#contact"
                  className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  prefetch={false}
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="w-full py-12 md:py-24 lg:py-32 border-t"
        >
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Contact Us
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Have questions? Get in touch with our team.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <p className="text-sm text-muted-foreground">
                Email us at{" "}
                <a
                  href="mailto:prakharsingh2004@gmail.com"
                  className="underline"
                >
                  prakharsingh2004@gmail.com
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} AWPL Helper. All rights reserved.
        </p>
        <div className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            href="https://github.com/PrakharSinghOnGit/awplHelper"
            className="text-xs hover:underline underline-offset-4"
            prefetch={false}
          >
            GitHub
          </Link>
          <Link
            href="/help"
            className="text-xs hover:underline underline-offset-4"
            prefetch={false}
          >
            Help
          </Link>
        </div>
      </footer>
    </div>
  );
}
