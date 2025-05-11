
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Building2, ShieldCheck, Users, KeyRound, LogOut, UserCircle, LayoutGrid } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { href: "/admin/dashboard", label: "Review Queue", icon: <LayoutGrid className="mr-2 h-4 w-4" /> },
  { href: "/admin/users", label: "User Submissions", icon: <Users className="mr-2 h-4 w-4" /> },
  { href: "/admin/api-keys", label: "Manage API Keys", icon: <KeyRound className="mr-2 h-4 w-4" /> },
];

export function AdminHeader() {
  const pathname = usePathname();

  // Mock admin user data
  const adminUser = {
    name: "Admin User",
    email: "admin@haqqman.com",
  };

  const handleSignOut = () => {
    // Placeholder for sign out logic
    console.log("Admin signing out...");
    // router.push('/admin/signin');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/admin/dashboard" className="flex items-center space-x-2 mr-6">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">Admin Console</span>
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <UserCircle className="h-7 w-7" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{adminUser.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {adminUser.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
