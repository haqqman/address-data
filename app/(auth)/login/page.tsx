
"use client"; 

import Link from "next/link";
import { Card as NextUICard, CardHeader as NextUICardHeader, CardBody as NextUICardBody } from "@nextui-org/react";
import { LogInButtons } from "@/components/forms/LogInButtons";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary/5 p-4"> {/* Subtle primary bg */}
       <Link href="/" className="flex items-center space-x-2 mb-8">
          <Image 
            src="https://res.cloudinary.com/seapane-cloud/seapane-bucket/address-data/meta/address-data-logomark.svg" 
            alt="Address Data Logomark" 
            width={32} 
            height={32}
            className="text-primary"
          />
          <span className="font-bold text-2xl text-primary">Address Data</span>
        </Link>
      <NextUICard className="w-full max-w-md shadow-xl p-2 md:p-4 rounded-xl bg-background"> 
        <NextUICardHeader className="flex flex-col items-center text-center pt-6 pb-2"> 
          <h1 className="text-2xl font-bold text-primary">Welcome Back!</h1> 
          <p className="text-muted-foreground mt-1">Log in to access your dashboard and manage your addresses.</p> 
        </NextUICardHeader>
        <NextUICardBody className="pt-2"> 
          <LogInButtons /> 
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Not ready to Log In?{" "}
            <Link href="/" className="font-medium text-secondary hover:underline"> {/* Secondary for this link */}
              Get Started
            </Link>
          </p>
        </NextUICardBody>
      </NextUICard>
    </div>
  );
}
