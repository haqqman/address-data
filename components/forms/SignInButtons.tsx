"use client";

import { Button as NextUIButton } from "@nextui-org/react";
import { Chrome, Github, Loader2 } from "lucide-react"; // Assuming Loader2 is a custom spinner or from lucide
import { useAuth } from "contexts/auth-context";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignInButtons() {
  const { signInWithGoogle, signInWithGitHub } = useAuth();
  const router = useRouter();
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [isLoadingGitHub, setIsLoadingGitHub] = useState(false);

  const handleSignIn = async (provider: "google" | "github") => {
    let signInFunction;
    let setIsLoadingFunction;
    let setLoadingState: React.Dispatch<React.SetStateAction<boolean>>;


    if (provider === "google") {
      signInFunction = signInWithGoogle;
      setLoadingState = setIsLoadingGoogle;
    } else {
      signInFunction = signInWithGitHub;
      setLoadingState = setIsLoadingGitHub;
    }
    
    setLoadingState(true);
    // toast({ // Removed toast
    //   title: `Attempting to log in with ${provider}...`,
    //   description: "Please wait.",
    // });

    try {
      await signInFunction();
      // toast({ // Removed toast
      //   title: "Log In Successful",
      //   description: "Redirecting to dashboard...",
      // });
      router.push('/dashboard');
    } catch (error: any) {
      console.error(`Log In Failed with ${provider}:`, error.message);
      // toast({ // Removed toast
      //   title: "Log In Failed",
      //   description: error.message || `Failed to log in with ${provider}.`,
      //   variant: "destructive",
      // });
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <div className="space-y-4">
      <NextUIButton
        variant="bordered" // Example NextUI variant
        fullWidth
        onClick={() => handleSignIn("google")}
        disabled={isLoadingGoogle || isLoadingGitHub}
        isLoading={isLoadingGoogle}
        startContent={!isLoadingGoogle ? <Chrome className="h-5 w-5" /> : null}
      >
        {isLoadingGoogle ? "Logging in..." : "Log in with Google"}
      </NextUIButton>
      <NextUIButton
        variant="bordered" // Example NextUI variant
        fullWidth
        onClick={() => handleSignIn("github")}
        disabled={isLoadingGoogle || isLoadingGitHub}
        isLoading={isLoadingGitHub}
        startContent={!isLoadingGitHub ? <Github className="h-5 w-5" /> : null}
      >
        {isLoadingGitHub ? "Logging in..." : "Log in with GitHub"}
      </NextUIButton>
    </div>
  );
}