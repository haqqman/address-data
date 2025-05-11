
"use client";

import { Button } from "@/components/ui/button";
import { Chrome, Github } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Placeholder for actual sign-in logic
async function signInWithProvider(provider: "google" | "github") {
  // Here you would typically redirect to Firebase/NextAuth endpoint
  // For now, just simulate a success/failure
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: `Successfully signed in with ${provider}` });
    }, 1000);
  });
}


export function SignInButtons() {
  const { toast } = useToast();

  const handleSignIn = async (provider: "google" | "github") => {
    // In a real app, this would trigger NextAuth or Firebase auth flow
    toast({
      title: `Attempting to sign in with ${provider}...`,
      description: "Please wait.",
    });
    try {
      const result: any = await signInWithProvider(provider);
      if (result.success) {
        toast({
          title: "Sign In Successful",
          description: result.message,
        });
        // router.push('/dashboard'); // Redirect to dashboard
      } else {
        toast({
          title: "Sign In Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
       toast({
          title: "Sign In Error",
          description: "An unexpected error occurred.",
          variant: "destructive",
        });
    }
  };

  return (
    <div className="space-y-4">
      <Button
        variant="outline"
        className="w-full"
        onClick={() => handleSignIn("google")}
      >
        <Chrome className="mr-2 h-5 w-5" />
        Sign in with Google
      </Button>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => handleSignIn("github")}
      >
        <Github className="mr-2 h-5 w-5" />
        Sign in with GitHub
      </Button>
    </div>
  );
}
