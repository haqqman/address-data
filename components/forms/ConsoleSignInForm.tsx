
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
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
  const { toast } = useToast();
  const router = useRouter();
  const { signInWithEmail } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ConsoleSignInFormValues>({
    resolver: zodResolver(consoleSignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: ConsoleSignInFormValues) {
    setIsLoading(true);
    toast({
      title: "Attempting console log-in...",
      description: "Please wait.",
    });
    try {
      await signInWithEmail(values.email, values.password, true); // true for isAdmin
      toast({
        title: "Console Log In Successful",
        description: "Redirecting to console dashboard...",
      });
      router.push('/console/dashboard');
    } catch (error: any) {
      const errorMessage = error.message || "Invalid console credentials or unauthorized email domain.";
       toast({
          title: "Console Log In Failed",
          description: errorMessage,
          variant: "destructive",
        });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input placeholder="example@haqqman.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Log In
        </Button>
      </form>
    </Form>
  );
}
