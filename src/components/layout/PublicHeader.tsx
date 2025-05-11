
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Building2 className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">Address Data Sandbox</span>
        </Link>
        <nav className="ml-auto flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/#features">Features</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/#api">API</Link>
          </Button>
          <Button asChild>
            <Link href="/signin">Sign In</Link>
          </Button>
           <Button variant="outline" asChild>
            <Link href="/admin/signin">Admin Sign In</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
