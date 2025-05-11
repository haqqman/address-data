
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Building2, LayoutDashboard, KeyRound, LogOut, UserCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "contexts/auth-context"; // Adjusted import path

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="mr-2 h-4 w-4" /> },
  { href: "/dashboard/api-keys", label: "API Keys", icon: <KeyRound className="mr-2 h-4 w-4" /> },
];

export function AppHeader() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/'); // Redirect to homepage after sign out
    } catch (error) {
      console.error("Failed to sign out", error);
      // Handle error (e.g., show a toast message)
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center">
        <Link href="/dashboard" className="flex items-center space-x-2 mr-6">
          <Building2 className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">Address Data</span>
        </Link>
        <nav className="flex items-center space-x-1">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              asChild
              className={cn(
                pathname === item.href ? "bg-accent text-accent-foreground" : "",
                "justify-start"
              )}
            >
              <Link href={item.href}>
                {item.icon}
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <UserCircle className="h-7 w-7" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name || user.email}</p>
                    {user.name && <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
