
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConsoleSignInForm } from "@/components/forms/ConsoleSignInForm";
import { Building2, ShieldAlert } from "lucide-react";

export default function ConsoleLoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary/30 p-4">
      <Link href="/" className="flex items-center space-x-2 mb-8">
          <Building2 className="h-8 w-8 text-primary" />
          <span className="font-bold text-2xl">Address Data</span>
        </Link>
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <ShieldAlert className="h-10 w-10 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Console Access</CardTitle>
          <CardDescription>Access restricted to authorized personnel. Please use your Haqqman Workmail.</CardDescription>
        </CardHeader>
        <CardContent>
          <ConsoleSignInForm />
           <p className="mt-6 text-center text-sm text-muted-foreground">
            Not an admin?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              User Log In
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
