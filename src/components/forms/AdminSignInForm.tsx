
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
// import { useRouter } from "next/navigation"; // Uncomment when navigation is needed

const adminSignInSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }).refine(
    (email) => email.endsWith("@haqqman.com"),
    { message: "Access restricted to @haqqman.com emails." }
  ),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type AdminSignInFormValues = z.infer<typeof adminSignInSchema>;

// Placeholder for actual admin sign-in logic
async function adminSignIn(values: AdminSignInFormValues) {
  // In a real app, this would call an auth API
  return new Promise((resolve) => {
    setTimeout(() => {
      if (values.email.endsWith("@haqqman.com") && values.password === "password") { // Example password
        resolve({ success: true, message: "Admin sign-in successful!" });
      } else {
        resolve({ success: false, message: "Invalid admin credentials or unauthorized email domain." });
      }
    }, 1000);
  });
}


export function AdminSignInForm() {
  const { toast } = useToast();
  // const router = useRouter(); // Uncomment when navigation is needed

  const form = useForm<AdminSignInFormValues>({
    resolver: zodResolver(adminSignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: AdminSignInFormValues) {
    toast({
      title: "Attempting admin sign-in...",
      description: "Please wait.",
    });
    try {
      const result: any = await adminSignIn(values);
      if (result.success) {
        toast({
          title: "Admin Sign In Successful",
          description: result.message,
        });
        // router.push('/admin/dashboard'); // Redirect to admin dashboard
      } else {
        toast({
          title: "Admin Sign In Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
       toast({
          title: "Admin Sign In Error",
          description: "An unexpected error occurred.",
          variant: "destructive",
        });
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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="admin@haqqman.com" {...field} />
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
        <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          Sign In
        </Button>
      </form>
    </Form>
  );
}
