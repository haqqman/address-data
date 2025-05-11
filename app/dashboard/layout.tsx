
import { AppHeader } from "@/components/layout/AppHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
       <footer className="py-6 border-t bg-background text-center text-muted-foreground text-sm">
        Address Data Sandbox &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
