
import { ApiKeyDisplay } from "@/components/dashboard/ApiKeyDisplay";

export default function ApiKeysPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
        <p className="text-muted-foreground">Manage your API keys for accessing Address Data Sandbox services.</p>
      </div>
      <ApiKeyDisplay />
      {/* Potentially add a list of existing API keys with their status, creation date, etc. */}
    </div>
  );
}
