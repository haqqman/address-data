
import Link from "next/link";
import { Card as NextUICard, CardHeader as NextUICardHeader, CardBody as NextUICardBody } from "@nextui-org/react";
import { ConsoleSignInForm } from "@/components/forms/ConsoleSignInForm";
import { ShieldAlert } from "lucide-react";
import Image from "next/image";

export default function ConsoleLoginPage() {
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
      <NextUICard className="w-full max-w-md shadow-xl p-2 md:p-4 rounded-xl">
        <NextUICardHeader className="flex flex-col items-center text-center pt-6 pb-2">
          <div className="flex justify-center mb-2">
            <ShieldAlert className="h-10 w-10 text-danger" /> {/* Mapped destructive to danger for NextUI */}
          </div>
          <h1 className="text-2xl font-bold">Console Access</h1>
          <p className="text-muted-foreground mt-1">Access restricted to authorized personnel. Please use your Haqqman Workmail.</p>
        </NextUICardHeader>
        <NextUICardBody className="pt-2">
          <ConsoleSignInForm />
           <p className="mt-6 text-center text-sm text-muted-foreground">
            Not a Console User?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Go to Portal
            </Link>
          </p>
        </NextUICardBody>
      </NextUICard>
    </div>
  );
}

    