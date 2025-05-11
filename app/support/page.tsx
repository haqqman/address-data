
"use client";

import { PublicHeader } from "@/components/layout/PublicHeader";
import { Card as NextUICard, CardHeader as NextUICardHeader, CardBody as NextUICardBody, Button as NextUIButton, Input as NextUIInput, Textarea as NextUITextarea } from "@nextui-org/react";
import { LifeBuoy, Mail, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function SupportPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <NextUICard className="shadow-xl rounded-xl p-2">
            <NextUICardHeader className="flex flex-col items-center text-center pt-6 pb-2">
              <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-3 mb-4">
                <LifeBuoy className="h-10 w-10 text-primary" />
              </div>
              <h1 className="text-3xl font-bold">Get Help &amp; Support</h1>
              <p className="text-lg text-muted-foreground mt-1">
                We&apos;re here to assist you with any questions or issues.
              </p>
            </NextUICardHeader>
            <NextUICardBody className="space-y-10 pt-0">
              <section className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h2 className="text-2xl font-semibold flex items-center">
                    <Mail className="mr-2 h-6 w-6 text-primary" /> Email Support
                  </h2>
                  <p>
                    For general inquiries, technical support, or API integration help, please email us. We aim to respond within 24-48 business hours.
                  </p>
                  <NextUIButton
                    as={Link}
                    href="mailto:support@addressdata.ng"
                    color="primary"
                    className="w-full md:w-auto"
                    radius="md"
                  >
                    support@addressdata.ng
                  </NextUIButton>
                </div>
                <div className="space-y-3">
                  <h2 className="text-2xl font-semibold flex items-center">
                    <MessageSquare className="mr-2 h-6 w-6 text-primary" /> Community Forum
                  </h2>
                  <p>
                    Join our community forum to ask questions, share solutions, and connect with other developers and users of Address Data.
                  </p>
                  <NextUIButton
                    as={Link}
                    href="#"
                    variant="bordered"
                    className="w-full md:w-auto"
                    isDisabled
                    radius="md"
                  >
                    Visit Forum (Coming Soon)
                  </NextUIButton>
                </div>
              </section>

              <hr className="my-4 border-border" />

              <section>
                <h2 className="text-2xl font-semibold mb-6 text-center">Contact Us Directly</h2>
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <NextUIInput
                      id="firstName"
                      label="First Name"
                      placeholder="Your First Name"
                      variant="bordered"
                      classNames={{ label: "text-base" }}
                    />
                    <NextUIInput
                      id="lastName"
                      label="Last Name"
                      placeholder="Your Last Name"
                      variant="bordered"
                      classNames={{ label: "text-base" }}
                    />
                  </div>
                  <div>
                    <NextUIInput
                      id="email"
                      type="email"
                      label="Email Address"
                      placeholder="your.email@example.com"
                      variant="bordered"
                      classNames={{ label: "text-base" }}
                    />
                  </div>
                  <div>
                    <NextUIInput
                      id="subject"
                      label="Subject"
                      placeholder="e.g., API Key Issue"
                      variant="bordered"
                      classNames={{ label: "text-base" }}
                    />
                  </div>
                  <div>
                    <NextUITextarea
                      id="message"
                      label="Message"
                      placeholder="Describe your issue or question in detail..."
                      variant="bordered"
                      minRows={5}
                      classNames={{ label: "text-base" }}
                    />
                  </div>
                  <div className="text-center pt-2">
                    <NextUIButton
                      type="submit"
                      color="primary"
                      size="lg"
                      isDisabled
                      radius="md"
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
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="mb-2">
            Built for Nigeria, for developers. Powered by{' '}
            <a
              href="https://searpane.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 no-underline"
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

