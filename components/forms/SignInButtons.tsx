
"use client";

import { Button } from "@/components/ui/button";
import { Chrome, Github } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";


export function SignInButtons() {
  const { toast } = useToast();
  const { signInWithGoogle, signInWithGitHub } = useAuth();
  const router = useRouter();
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [isLoadingGitHub, setIsLoadingGitHub] = useState(false);


  const handleSignIn = async (provider: "google" | "github") => {
    let signInFunction;
    let setIsLoadingFunction;

    if (provider === "google") {
      signInFunction = signInWithGoogle;
      setIsLoadingFunction = setIsLoadingGoogle;
    } else {
      signInFunction = signInWithGitHub;
      setIsLoadingFunction = setIsLoadingGitHub;
    }
    
    setIsLoadingFunction(true);
    toast({
      title: `Attempting to log in with ${provider}...`,
      description: "Please wait.",
    });

    try {
      await signInFunction();
      toast({
        title: "Log In Successful",
        description: "Redirecting to dashboard...",
      });
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        title: "Log In Failed",
        description: error.message || `Failed to log in with ${provider}.`,
        variant: "destructive",
      });
    } finally {
      setIsLoadingFunction(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        variant="outline"
        className="w-full"
        onClick={() => handleSignIn("google")}
        disabled={isLoadingGoogle || isLoadingGitHub}
      >
        {isLoadingGoogle ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Chrome className="mr-2 h-5 w-5" />}
        Log in with Google
      </Button>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => handleSignIn("github")}
        disabled={isLoadingGoogle || isLoadingGitHub}
      >
        {isLoadingGitHub ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Github className="mr-2 h-5 w-5" />}
        Log in with GitHub
      </Button>
    </div>
  );
}
