"use client";

import Image from "next/image";
import Hero from "@/components/hero";
import ConnectSupabaseSteps from "@/components/tutorial/connect-supabase-steps";
import SignUpUserSteps from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SignInButton } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard");
    }
  }, [isSignedIn, router]);

  return (
    <>
      <Hero />
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
      </main>
    </>
  );
}

