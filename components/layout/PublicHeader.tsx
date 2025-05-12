
"use client";

import Link from "next/link";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Button as NextUIButton } from "@nextui-org/react"; 
import Image from "next/image";
import { useState } from "react";

const menuItems = [
  { name: "About", href: "/about" },
  { name: "Documentation", href: "/docs" },
  { name: "Get Help", href: "/support" },
];

export function PublicHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Navbar 
      onMenuOpenChange={setIsMenuOpen} 
      isMenuOpen={isMenuOpen}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      maxWidth="xl" // Changed from 7xl to xl for NextUI's convention, equivalent to max-w-7xl usually
    >
      <NavbarContent justify="start">
        <NavbarBrand as={Link} href="/" className="flex items-center space-x-2">
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

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {menuItems.map((item, index) => (
          <NavbarItem key={`${item.name}-${index}`}>
            <NextUIButton
              as={Link}
              color="default"
              href={item.href}
              variant="light"
              className="text-foreground"
            >
              {item.name}
            </NextUIButton>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem className="hidden sm:flex">
          <NextUIButton 
            as={Link}
            href="/login" 
            color="warning"
            radius="md"
            className="text-primary shadow-md hover:shadow-lg hover:-translate-y-px active:translate-y-0.5 transition-transform duration-150 ease-in-out font-semibold"
          >
            Portal
          </NextUIButton>
        </NavbarItem>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden text-primary" // Ensure toggle is visible and primary colored
        />
      </NavbarContent>

      <NavbarMenu className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pt-4">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.name}-${index}`}>
            <Link
              href={item.href}
              className="w-full block py-2 text-foreground hover:text-primary"
              onClick={() => setIsMenuOpen(false)} // Close menu on item click
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
        <NavbarMenuItem>
          <NextUIButton 
            as={Link}
            href="/login" 
            color="warning"
            radius="md"
            className="w-full text-primary shadow-md hover:shadow-lg hover:-translate-y-px active:translate-y-0.5 transition-transform duration-150 ease-in-out font-semibold mt-4"
            onClick={() => setIsMenuOpen(false)} // Close menu on item click
          >
            Portal
          </NextUIButton>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
