
"use client";

import Link from "next/link";
import { Button as NextUIButton, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, DropdownSection, User as NextUIUser } from "@nextui-org/react";
import { LayoutDashboard, KeyRound, LogOut, UserCircle, PlusCircle, Building } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context"; 
import Image from "next/image";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="mr-2 h-4 w-4" /> },
  { href: "/submit-address", label: "Submit Address", icon: <PlusCircle className="mr-2 h-4 w-4" /> },
  { href: "/estates", label: "Estates", icon: <Building className="mr-2 h-4 w-4" /> },
  { href: "/api-keys", label: "API Keys", icon: <KeyRound className="mr-2 h-4 w-4" /> },
];

export function AppHeader() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(false); // Explicitly pass false for portal sign out
    } catch (error) {
      console.error("Failed to sign out", error);
      // Optionally show a toast or error message to the user
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center">
        <Link href="/dashboard" className="flex items-center space-x-2 mr-6">
          <Image 
            src="https://res.cloudinary.com/seapane-cloud/seapane-bucket/address-data/meta/address-data-logomark.svg" 
            alt="Address Data Logomark" 
            width={24} 
            height={24}
            className="text-primary"
          />
          <span className="font-bold text-lg text-primary">Address Data</span>
        </Link>
        <nav className="flex items-center space-x-1">
          {navItems.map((item) => (
            <NextUIButton
              key={item.href}
              variant="ghost"
              as={Link}
              href={item.href}
              className={cn(
                "justify-start shadow-sm hover:shadow-md border border-transparent hover:border-warning/50",
                "hover:-translate-y-px active:translate-y-0.5 transition-all duration-150 ease-in-out",
                pathname === item.href 
                  ? "bg-warning/20 text-primary font-semibold border-warning" 
                  : "text-foreground hover:bg-warning/10"
              )}
              startContent={item.icon}
            >
              {item.label}
            </NextUIButton>
          ))}
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          {user && (
            <Dropdown placement="bottom-end" backdrop="blur">
              <DropdownTrigger>
                <NextUIButton isIconOnly variant="ghost" className="relative h-8 w-8 rounded-full">
                   <UserCircle className="h-7 w-7 text-primary" />
                </NextUIButton>
              </DropdownTrigger>
              <DropdownMenu aria-label="User Actions" variant="flat">
                <DropdownSection showDivider>
                    <DropdownItem isReadOnly key="profile" className="h-14 gap-2 opacity-100 cursor-default">
                        <NextUIUser
                            name={user.name || user.email?.split('@')[0]}
                            description={user.email}
                            avatarProps={{
                                icon: <UserCircle className="text-primary" />,
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
