
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Spinner, Card, CardHeader, CardBody } from "@nextui-org/react";
import { Users2, ShieldAlert } from "lucide-react";

export default function TeamManagementPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'cto')) {
      router.push('/console/dashboard'); // Redirect if not CTO or not logged in
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Spinner label="Loading Team Management..." color="warning" labelColor="warning" />
      </div>
    );
  }

  if (!user || user.role !== 'cto') {
    // This state should ideally not be reached due to useEffect redirect,
    // but as a fallback or during brief rerender:
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Card className="max-w-md p-4 bg-danger-50 border-danger-200">
          <CardHeader className="flex items-center">
            <ShieldAlert className="h-8 w-8 text-danger mr-3" />
            <h1 className="text-xl font-semibold text-danger-700">Access Denied</h1>
          </CardHeader>
          <CardBody>
            <p className="text-danger-600">You do not have permission to view this page.</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center">
          <Users2 className="mr-3 h-8 w-8 text-primary" />
          Team Management
        </h1>
        <p className="text-foreground-500">
          Manage console user accounts, roles, and permissions. (Visible only to CTO)
        </p>
      </div>

      <Card className="shadow-xl rounded-xl bg-background">
        <CardHeader className="px-6 pt-6 pb-2">
          <h2 className="text-xl font-semibold text-primary">Console Users</h2>
          <p className="text-sm text-foreground-500 mt-1">
            View, add, or modify console user accounts.
          </p>
        </CardHeader>
        <CardBody className="p-6">
          <p className="text-foreground-600">
            Team management features are under development. This section will allow CTOs to manage roles and access for console administrators and managers.
          </p>
          {/* Placeholder for future user management table/components */}
          <div className="mt-6 p-8 border-2 border-dashed border-default-300 rounded-xl text-center text-foreground-500">
            User management interface will appear here.
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
