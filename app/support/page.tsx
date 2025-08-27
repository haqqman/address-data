// app/support/page.tsx
"use client";

import { PublicHeader } from "@/components/layout/PublicHeader";
import { Card as NextUICard, CardHeader as NextUICardHeader, CardBody as NextUICardBody, Button as NextUIButton, Input as NextUIInput, Textarea as NextUITextarea } from "@nextui-org/react";
import { LifeBuoy, Mail, MessageSquare } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react"; // Added for form state if needed

export default function SupportPage() {
  const [formEmail, setFormEmail] = useState(""); // State for controlled email input

  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <main className="flex-grow max-w-7xl mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <NextUICard className="shadow-xl rounded-xl p-2 bg-background">
            <NextUICardHeader className="flex flex-col items-center text-center pt-6 pb-2">
              <div className="inline-flex items-center justify-center rounded-full bg-secondary/10 p-3 mb-4">
                <LifeBuoy className="h-10 w-10 text-secondary" />
              </div>
              <h1 className="text-3xl font-bold text-primary">Get Help &amp; Support</h1>
              <p className="text-lg text-muted-foreground mt-1">
                We&apos;re here to assist you with any questions or issues.
              </p>
            </NextUICardHeader>
            <NextUICardBody className="space-y-10 pt-0 text-foreground/90">
              <div className="flex justify-center my-6">
                <Image
                  src="https://res.cloudinary.com/seapane-cloud/seapane-bucket/address-data/meta/address-illustration-pana.svg" 
                  alt="Support Illustration"
                  width={300}
                  height={250}
                  data-ai-hint="customer support"
                />
              </div>
              <section className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h2 className="text-2xl font-semibold flex items-center text-primary">
                    <Mail className="mr-2 h-6 w-6 text-secondary" /> Email Support
                  </h2>
                  <p>
                    For general inquiries, technical support, or API integration help, please email us. We aim to respond within 24-48 business hours.
                  </p>
                  <NextUIButton
                    as={Link}
                    href="mailto:support@addressdata.ng"
                    color="warning" 
                    className="w-full md:w-auto shadow-md hover:shadow-lg hover:-translate-y-px active:translate-y-0.5 transition-transform duration-150 ease-in-out text-primary" 
                    radius="md"
                  >
                    support@addressdata.ng
                  </NextUIButton>
                </div>
                <div className="space-y-3">
                  <h2 className="text-2xl font-semibold flex items-center text-primary">
                    <MessageSquare className="mr-2 h-6 w-6 text-secondary" /> Community Forum
                  </h2>
                  <p>
                    Join our community forum to ask questions, share solutions, and connect with other developers and users of Address Data.
                  </p>
                  <NextUIButton
                    as={Link}
                    href="#"
                    variant="bordered"
                    color="secondary" 
                    className="w-full md:w-auto shadow-sm hover:shadow-md hover:-translate-y-px active:translate-y-0.5 transition-transform duration-150 ease-in-out"
                    isDisabled
                    radius="md"
                  >
                    Visit Forum (Coming Soon)
                  </NextUIButton>
                </div>
              </section>

              <hr className="my-4 border-border" />

              <section>
                <h2 className="text-2xl font-semibold mb-6 text-center text-primary">Contact Us Directly</h2>
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <NextUIInput
                      id="firstName"
                      label="First Name"
                      placeholder="Your First Name"
                      variant="bordered"
                      classNames={{ label: "text-base text-primary" }} 
                    />
                    <NextUIInput
                      id="lastName"
                      label="Last Name"
                      placeholder="Your Last Name"
                      variant="bordered"
                      classNames={{ label: "text-base text-primary" }}
                    />
                  </div>
                  <div>
                    <NextUIInput
                      id="email"
                      type="email"
                      label="Email Address"
                      placeholder="your.email@example.com"
                      variant="bordered"
                      classNames={{ label: "text-base text-primary" }}
                      value={formEmail}
                      onValueChange={(value) => {
                        const transformedValue = value.toLowerCase().replace(/\s+/g, '');
                        setFormEmail(transformedValue);
                      }}
                    />
                  </div>
                  <div>
                    <NextUIInput
                      id="subject"
                      label="Subject"
                      placeholder="API Key Issue"
                      variant="bordered"
                      classNames={{ label: "text-base text-primary" }}
                    />
                  </div>
                  <div>
                    <NextUITextarea
                      id="message"
                      label="Message"
                      placeholder="Describe your issue or question in detail..."
                      variant="bordered"
                      minRows={5}
                      classNames={{ label: "text-base text-primary" }}
                    />
                  </div>
                  <div className="text-center pt-2">
                    <NextUIButton
                      type="submit"
                      color="warning" 
                      size="lg"
                      isDisabled
                      radius="md"
                      className="shadow-md hover:shadow-lg hover:-translate-y-px active:translate-y-0.5 transition-transform duration-150 ease-in-out text-primary" 
                    >
                      Send Message (Form Inactive)
                    </NextUIButton>
                  </div>
                </form>
              </section>

            </NextUICardBody>
          </NextUICard>
        </div>
      </main>
      <footer className="py-8 border-t bg-background">
        <div className="max-w-7xl mx-auto px-4 text-center text-muted-foreground">
          <p className="mb-2">
            Built for Nigeria, for developers. Powered by{' '}
            <a
              href="https://seapane.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-secondary no-underline"
            >
              Seapane
            </a>
          </p>
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Address Data. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
