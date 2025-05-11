
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SignInButtons } from "@/components/forms/SignInButtons";
import { Building2 } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary/30 p-4">
       <Link href="/" className="flex items-center space-x-2 mb-8">
          <Building2 className="h-8 w-8 text-primary" />
          <span className="font-bold text-2xl">Address Data</span>
        </Link>
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome Back!</CardTitle>
          <CardDescription>Log in to access your dashboard and manage your addresses.</CardDescription>
        </CardHeader>
        <CardContent>
          <SignInButtons />
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Not ready to Log In?{" "}
            <Link href="/" className="font-medium text-primary hover:underline">
              Get Started
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

