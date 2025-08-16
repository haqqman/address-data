
"use client";

import Link from "next/link";
import { 
  Button as NextUIButton, 
  Dropdown, 
  DropdownTrigger, 
  DropdownMenu, 
  DropdownItem, 
  DropdownSection, 
  User as NextUIUser,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem
} from "@nextui-org/react";
import { LayoutDashboard, KeyRound, LogOut, UserCircle, PlusCircle, Building } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context"; 
import Image from "next/image";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="mr-2 h-4 w-4" /> },
  { href: "/submit-address", label: "Submit Address", icon: <PlusCircle className="mr-2 h-4 w-4" /> },
  { href: "/estates", label: "Estates", icon: <Building className="mr-2 h-4 w-4" /> },
  { href: "/api-keys", label: "API Keys", icon: <KeyRound className="mr-2 h-4 w-4" /> },
];

export function AppHeader() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(false); // Explicitly pass false for portal sign out
    } catch (error) {
      console.error("Failed to sign out", error);
    }
  };

  return (
    <Navbar 
      onMenuOpenChange={setIsMenuOpen} 
      isMenuOpen={isMenuOpen}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      maxWidth="xl"
    >
      <NavbarContent justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden text-primary"
        />
        <NavbarBrand as={Link} href="/dashboard" className="flex items-center space-x-2">
           <Image 
            src="https://res.cloudinary.com/seapane-cloud/seapane-bucket/address-data/meta/address-data-logomark.svg" 
            alt="Address Data Logomark" 
            width={24} 
            height={24}
            className="text-primary"
          />
          <span className="font-bold text-lg text-primary">Address Data</span>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-1" justify="center">
        {navItems.map((item) => (
          <NavbarItem key={item.href} isActive={pathname === item.href}>
             <NextUIButton
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
          </NavbarItem>
        ))}
      </NavbarContent>
      
      <NavbarContent justify="end">
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
      </NavbarContent>

      <NavbarMenu className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pt-4">
        {navItems.map((item, index) => (
          <NavbarMenuItem key={`${item.href}-${index}`} isActive={pathname === item.href}>
            <Link
              href={item.href}
              className={cn(
                "w-full block py-2 text-lg",
                pathname === item.href ? "text-secondary font-semibold" : "text-foreground"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="flex items-center">{item.icon} {item.label}</span>
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
