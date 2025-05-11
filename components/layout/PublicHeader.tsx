
"use client";

import Link from "next/link";
import { Button as NextUIButton } from "@nextui-org/react"; // Changed import
import Image from "next/image";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-14 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Image 
            src="https://res.cloudinary.com/seapane-cloud/seapane-bucket/address-data/meta/address-data-logomark.svg" 
            alt="Address Data Logomark" 
            width={24} 
            height={24}
          />
          <span className="font-bold text-lg">Address Data</span>
        </Link>
        <nav className="ml-auto flex items-center space-x-1 md:space-x-2">
          <NextUIButton variant="light" as={Link} href="/about" className="text-foreground">
            About
          </NextUIButton>
          <NextUIButton variant="light" as={Link} href="/docs" className="text-foreground">
            Documentation
          </NextUIButton>
          <NextUIButton variant="light" as={Link} href="/support" className="text-foreground">
            Get Help
          </NextUIButton>
          <NextUIButton color="warning" as={Link} href="/login" radius="md">
            Portal
          </NextUIButton>
        </nav>
      </div>
    </header>
  );
}

    