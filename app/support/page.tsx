
import { PublicHeader } from "@/components/layout/PublicHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { LifeBuoy, Mail, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function SupportPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-xl rounded-xl">
            <CardHeader className="text-center">
              <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-3 mb-4 self-center">
                <LifeBuoy className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-bold">Get Help & Support</CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                We&apos;re here to assist you with any questions or issues.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-10">
              <section className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h2 className="text-2xl font-semibold flex items-center">
                    <Mail className="mr-2 h-6 w-6 text-primary" /> Email Support
                  </h2>
                  <p>
                    For general inquiries, technical support, or API integration help, please email us. We aim to respond within 24-48 business hours.
                  </p>
                  <Button asChild className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
                    <Link href="mailto:support@addressdata.ng">support@addressdata.ng</Link>
                  </Button>
                </div>
                <div className="space-y-3">
                  <h2 className="text-2xl font-semibold flex items-center">
                    <MessageSquare className="mr-2 h-6 w-6 text-primary" /> Community Forum
                  </h2>
                  <p>
                    Join our community forum to ask questions, share solutions, and connect with other developers and users of Address Data.
                  </p>
                  <Button variant="outline" asChild className="w-full md:w-auto" disabled>
                    <Link href="#">Visit Forum (Coming Soon)</Link>
                  </Button>
                </div>
              </section>

              <hr className="my-8" />

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-center">Contact Us Directly</h2>
                <form className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-base">Full Name</Label>
                    <Input id="name" placeholder="Your Name" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-base">Email Address</Label>
                    <Input id="email" type="email" placeholder="your.email@example.com" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="subject" className="text-base">Subject</Label>
                    <Input id="subject" placeholder="e.g., API Key Issue" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="message" className="text-base">Message</Label>
                    <Textarea id="message" placeholder="Describe your issue or question in detail..." rows={5} className="mt-1" />
                  </div>
                  <div className="text-center">
                    <Button type="submit" size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled>
                      Send Message (Form Inactive)
                    </Button>
                  </div>
                </form>
              </section>

            </CardContent>
          </Card>
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
