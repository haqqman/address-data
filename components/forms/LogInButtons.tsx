
"use client";

import { Button as NextUIButton } from "@nextui-org/react";
import { Chrome, Github } from "lucide-react"; 
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogInButtons() {
  const { signInWithGoogle, signInWithGitHub, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [isLoadingGitHub, setIsLoadingGitHub] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


  const handleLogIn = async (provider: "google" | "github") => {
    let logInFunction;
    let setLoadingState: React.Dispatch<React.SetStateAction<boolean>>;

    setErrorMessage(null);

    if (provider === "google") {
      logInFunction = signInWithGoogle;
      setLoadingState = setIsLoadingGoogle;
    } else {
      logInFunction = signInWithGitHub;
      setLoadingState = setIsLoadingGitHub;
    }
    
    setLoadingState(true);

    try {
      const user = await logInFunction();
      if (user) {
        // The redirect is handled within the auth context, but we keep the button disabled
        // using the global authLoading state until the redirect is complete.
      }
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
        onClick={() => handleLogIn("google")}
        disabled={isLoadingGoogle || isLoadingGitHub || authLoading}
        isLoading={isLoadingGoogle || authLoading}
        startContent={!isLoadingGoogle && !authLoading ? <Chrome className="h-5 w-5" /> : null}
        className="shadow-sm hover:shadow-md hover:-translate-y-px active:translate-y-0.5 transition-transform duration-150 ease-in-out"
      >
        {isLoadingGoogle || authLoading ? "Authenticating..." : "Log in with Google"}
      </NextUIButton>
      <NextUIButton
        variant="bordered" 
        fullWidth
        onClick={() => handleLogIn("github")}
        disabled={isLoadingGoogle || isLoadingGitHub || authLoading}
        isLoading={isLoadingGitHub || authLoading}
        startContent={!isLoadingGitHub && !authLoading ? <Github className="h-5 w-5" /> : null}
        className="shadow-sm hover:shadow-md hover:-translate-y-px active:translate-y-0.5 transition-transform duration-150 ease-in-out"
      >
        {isLoadingGitHub || authLoading ? "Authenticating..." : "Log in with GitHub"}
      </NextUIButton>
    </div>
  );
}
