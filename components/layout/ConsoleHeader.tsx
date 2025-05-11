"use client";

import Link from "next/link";
import { Button as NextUIButton, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, DropdownSection, User as NextUIUser } from "@nextui-org/react";
import { ShieldCheck, Users, KeyRound, LogOut, UserCircle, LayoutGrid } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";

const navItems = [
  { href: "/console/dashboard", label: "Review Queue", icon: <LayoutGrid className="mr-2 h-4 w-4" /> },
  { href: "/console/users", label: "User Submissions", icon: <Users className="mr-2 h-4 w-4" /> },
  { href: "/console/api-keys", label: "Manage API Keys", icon: <KeyRound className="mr-2 h-4 w-4" /> },
];

export function ConsoleHeader() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/console'); 
    } catch (error) {
      console.error("Failed to sign out", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center">
        <Link href="/console/dashboard" className="flex items-center space-x-2 mr-6">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">Console</span>
        </Link>
        <nav className="flex items-center space-x-1">
          {navItems.map((item) => (
            <NextUIButton
              key={item.href}
              variant="ghost"
              as={Link}
              href={item.href}
              className={cn(
                pathname === item.href ? "bg-warning/20 text-warning-foreground" : "text-foreground", // Using warning for accent
                "justify-start"
              )}
              startContent={item.icon}
            >
              {item.label}
            </NextUIButton>
          ))}
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          {user && (
             <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <NextUIButton isIconOnly variant="ghost" className="relative h-8 w-8 rounded-full">
                   <UserCircle className="h-7 w-7" />
                </NextUIButton>
              </DropdownTrigger>
              <DropdownMenu aria-label="User Actions" variant="flat">
                 <DropdownSection showDivider>
                    <DropdownItem isReadOnly key="profile" className="h-14 gap-2 opacity-100 cursor-default">
                        <NextUIUser
                            name={user.name || "Admin User"}
                            description={user.email}
                             avatarProps={{
                                icon: <UserCircle />,
                                classNames: {icon: "text-2xl"}
                            }}
                        />
                    </DropdownItem>
                </DropdownSection>
                <DropdownItem key="logout" color="danger" onPress={handleSignOut} startContent={<LogOut className="h-4 w-4" />}>
                  Log out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
        </div>
      </div>
    </header>
  );
}
