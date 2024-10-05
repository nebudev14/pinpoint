"use client";

import Image from "next/image";
import Hero from "@/components/hero";
import ConnectSupabaseSteps from "@/components/tutorial/connect-supabase-steps";
import SignUpUserSteps from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { SignOutButton, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SignInButton } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MapPin } from "lucide-react";
import React from "react";

export default function Home() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  // useEffect(() => {
  //   if (isSignedIn) {
  //     router.push("/dashboard");
  //   }
  // }, [isSignedIn, router]);

  return (
    <>
      {/* <Hero />
      <main className="flex-1 flex flex-col gap-6 px-4">
        <h2 className="font-medium text-xl mb-4">Vicinity</h2>
        {!isSignedIn && (
          <div className="flex">
            <SignInButton mode="modal">
              <button className="bg-gray-700 text-white px-6 py-3 rounded-full flex items-center space-x-2 absolute bottom-10 right-10 hover:bg-gray-600 transition-colors">
                <span>Sign Up</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </SignInButton>
          </div>
        )}
      </main> */}
      <div className="flex flex-col min-h-screen">
        <header className="px-4 lg:px-6 h-14 flex items-center">
          <Link className="flex items-center justify-center" href="#">
            <MapPin className="h-6 w-6 text-primary" />
            <span className="ml-2 text-2xl font-bold">Vicinity</span>
          </Link>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            {!isSignedIn ? (
              <SignInButton mode="modal">
                <Button asChild>
                  <Link href="#signin">Sign In</Link>
                </Button>
              </SignInButton>
            ) : (
              <SignOutButton />
            )}
          </nav>
        </header>
        <main className="flex-1">
          <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    Connect with Your Community
                  </h1>
                  <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                    Discover local events, meet your neighbors, and stay updated
                    with what's happening around you.
                  </p>
                </div>
                <div className="space-x-4">
                  <Button size="lg">Get Started</Button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
