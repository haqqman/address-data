
"use client";

import { ApiKeyDisplay } from "@/components/dashboard/ApiKeyDisplay";

export default function ApiKeysPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
        <p className="text-foreground-500">Manage your API keys for accessing Address Data services.</p>
      </div>
      <ApiKeyDisplay />
    </div>
  );
}
