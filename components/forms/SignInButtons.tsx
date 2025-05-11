
"use client";

import { Button as NextUIButton } from "@nextui-org/react";
import { Chrome, Github } from "lucide-react"; 
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignInButtons() {
  const { signInWithGoogle, signInWithGitHub } = useAuth();
  const router = useRouter();
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [isLoadingGitHub, setIsLoadingGitHub] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


  const handleSignIn = async (provider: "google" | "github") => {
    let signInFunction;
    let setLoadingState: React.Dispatch<React.SetStateAction<boolean>>;

    setErrorMessage(null);

    if (provider === "google") {
      signInFunction = signInWithGoogle;
      setLoadingState = setIsLoadingGoogle;
    } else {
      signInFunction = signInWithGitHub;
      setLoadingState = setIsLoadingGitHub;
    }
    
    setLoadingState(true);

    try {
      await signInFunction();
      // Successful sign-in will trigger onAuthStateChanged,
      // which updates user state and AuthProvider redirects based on role.
      // The auth context already handles redirecting to /dashboard for non-admin users.
      // The auth context already handles redirecting to /dashboard for non-admin users.
    } catch (error: any) {
      console.error(`Log In Failed with ${provider}:`, error.message);
      setErrorMessage(error.message || `Failed to log in with ${provider}. Please try again.`);
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <div className="space-y-4">
       {errorMessage && (
        <div className="p-3 bg-danger-50 border border-danger-200 rounded-md text-danger-700 text-sm">
          {errorMessage}
        </div>
      )}
      <NextUIButton
        variant="bordered" 
        fullWidth
        onClick={() => handleSignIn("google")}
        disabled={isLoadingGoogle || isLoadingGitHub}
        isLoading={isLoadingGoogle}
        startContent={!isLoadingGoogle ? <Chrome className="h-5 w-5" /> : null}
      >
        {isLoadingGoogle ? "Logging in..." : "Log in with Google"}
      </NextUIButton>
      <NextUIButton
        variant="bordered" 
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
