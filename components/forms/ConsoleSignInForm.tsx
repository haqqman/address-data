"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { Button as NextUIButton, Input as NextUIInput } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useAuth } from "contexts/auth-context";
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

  const { control, handleSubmit, formState: { errors } } = useForm<ConsoleSignInFormValues>({
    resolver: zodResolver(consoleSignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: ConsoleSignInFormValues) {
    setIsLoading(true);
    // toast removed
    try {
      await signInWithEmail(values.email, values.password, true); // true for isAdmin
      // toast removed
      router.push('/console/dashboard');
    } catch (error: any) {
      const errorMessage = error.message || "Invalid console credentials or unauthorized email domain.";
      console.error("Console Log In Failed:", errorMessage);
      // toast removed
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <NextUIInput
            {...field}
            label="Email Address"
            placeholder="example@haqqman.com"
            variant="bordered"
            isInvalid={!!errors.email}
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
            isInvalid={!!errors.password}
            errorMessage={errors.password?.message}
            fullWidth
          />
        )}
      />
      <NextUIButton 
        type="submit" 
        color="warning" // Mapped from accent
        fullWidth 
        isLoading={isLoading}
        disabled={isLoading}
      >
        {isLoading ? "Logging In..." : "Log In"}
      </NextUIButton>
    </form>
  );
}