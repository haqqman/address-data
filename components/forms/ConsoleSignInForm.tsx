
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { Button as NextUIButton, Input as NextUIInput } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const consoleSignInSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }).refine(
    (email) => email.endsWith("@haqqman.com"),
    { message: "Access restricted to @haqqman.com emails." }
  ),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type ConsoleSignInFormValues = z.infer<typeof consoleSignInSchema>;

export function ConsoleSignInForm() {
  const router = useRouter();
  const { signInWithEmail } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


  const { control, handleSubmit, formState: { errors } } = useForm<ConsoleSignInFormValues>({
    resolver: zodResolver(consoleSignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: ConsoleSignInFormValues) {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const user = await signInWithEmail(values.email, values.password, true); // true for isAdmin check in auth context
      if (user) { // Check if user object is returned
        router.push('/console/dashboard');
      } else {
        // This case should ideally be handled by an error thrown from signInWithEmail if login fails
        setErrorMessage("Login failed. Please check your credentials.");
      }
    } catch (error: any) {
      const friendlyErrorMessage = error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password'
        ? "Invalid email or password. Please try again."
        : error.message || "An unexpected error occurred. Please try again.";
      console.error("Console Log In Failed:", error);
      setErrorMessage(friendlyErrorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {errorMessage && (
        <div className="p-3 bg-danger-50 border border-danger-200 rounded-md text-danger-700 text-sm">
          {errorMessage}
        </div>
      )}
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <NextUIInput
            {...field}
            label="Email Address"
            placeholder="example@haqqman.com"
            variant="bordered"
            isInvalid={!!errors.email || !!errorMessage}
            errorMessage={errors.email?.message}
            fullWidth
          />
        )}
      />
      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <NextUIInput
            {...field}
            label="Password"
            type="password"
            placeholder="••••••••"
            variant="bordered"
            isInvalid={!!errors.password || !!errorMessage}
            errorMessage={errors.password?.message}
            fullWidth
          />
        )}
      />
      <NextUIButton 
        type="submit" 
        color="warning" 
        fullWidth 
        isLoading={isLoading}
        disabled={isLoading}
        className="text-white"
      >
        {isLoading ? "Logging In..." : "Log In"}
      </NextUIButton>
    </form>
  );
}
