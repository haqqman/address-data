
import Link from "next/link";
import { Card as NextUICard, CardHeader as NextUICardHeader, CardBody as NextUICardBody } from "@nextui-org/react";
import { SignInButtons } from "@/components/forms/SignInButtons";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary/30 p-4">
       <Link href="/" className="flex items-center space-x-2 mb-8">
          <Image 
            src="https://res.cloudinary.com/seapane-cloud/seapane-bucket/address-data/meta/address-data-logomark-light.svg" 
            alt="Address Data Logomark" 
            width={32} 
            height={32}
            className="text-primary"
          />
          <span className="font-bold text-2xl">Address Data</span>
        </Link>
      <NextUICard className="w-full max-w-md shadow-xl p-2 md:p-4 rounded-xl"> {/* Added padding and rounded-xl */}
        <NextUICardHeader className="flex flex-col items-center text-center pt-6 pb-2"> {/* Adjusted padding */}
          <h1 className="text-2xl font-bold">Welcome Back!</h1> {/* Replaced CardTitle */}
          <p className="text-muted-foreground mt-1">Log in to access your dashboard and manage your addresses.</p> {/* Replaced CardDescription */}
        </NextUICardHeader>
        <NextUICardBody className="pt-2"> {/* Adjusted padding */}
          <SignInButtons />
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Not ready to Log In?{" "}
            <Link href="/" className="font-medium text-primary hover:underline">
              Get Started
            </Link>
          </p>
        </NextUICardBody>
      </NextUICard>
    </div>
  );
}

    