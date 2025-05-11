
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Eye, EyeOff, RefreshCw, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Placeholder for API key generation logic
async function generateNewApiKeys() {
  return new Promise<{publicKey: string, privateKey: string}>(resolve => {
    setTimeout(() => {
      resolve({
        publicKey: `pk_live_${Math.random().toString(36).substr(2, 16)}`,
        privateKey: `sk_live_${Math.random().toString(36).substr(2, 32)}`,
      });
    }, 500);
  });
}


export function ApiKeyDisplay() {
  const [publicKey, setPublicKey] = useState("pk_live_xxxxxxxxxxxxxxxx"); // Placeholder
  const [privateKey, setPrivateKey] = useState("sk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"); // Placeholder
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleCopyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: `${keyName} Copied!`, description: `${keyName} has been copied to your clipboard.` });
  };

  const handleGenerateKeys = async () => {
    setIsGenerating(true);
    // In a real app, call server action to generate and store keys securely
    const keys = await generateNewApiKeys();
    setPublicKey(keys.publicKey);
    setPrivateKey(keys.privateKey);
    setShowPrivateKey(true); // Show new private key briefly
    setIsGenerating(false);
    toast({ title: "API Keys Generated", description: "Your new API keys have been generated. Store your private key securely." });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Developer API Keys</CardTitle>
        <CardDescription>
          Use these keys to authenticate your API requests. Keep your private key secure.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="publicKey">Public Key</Label>
          <div className="flex items-center space-x-2">
            <Input id="publicKey" value={publicKey} readOnly />
            <Button variant="outline" size="icon" onClick={() => handleCopyToClipboard(publicKey, "Public Key")}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="privateKey">Private Key</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="privateKey"
              type={showPrivateKey ? "text" : "password"}
              value={privateKey}
              readOnly
            />
            <Button variant="outline" size="icon" onClick={() => setShowPrivateKey(!showPrivateKey)}>
              {showPrivateKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="icon" onClick={() => handleCopyToClipboard(privateKey, "Private Key")}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Alert variant="destructive" className="bg-destructive/10 border-destructive/30 text-destructive">
          <AlertTriangle className="h-4 w-4 !text-destructive" />
          <AlertTitle className="!text-destructive">Important Security Notice</AlertTitle>
          <AlertDescription className="!text-destructive">
            Your Private Key is shown only once upon generation. Treat it like a password and store it securely. If lost, you will need to generate a new key pair.
          </AlertDescription>
        </Alert>

        <Button onClick={handleGenerateKeys} disabled={isGenerating} className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <RefreshCw className={`mr-2 h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
          {isGenerating ? "Generating..." : "Generate New Key Pair"}
        </Button>
        <p className="text-xs text-muted-foreground">
          Generating new keys will invalidate your current key pair immediately.
        </p>
      </CardContent>
    </Card>
  );
}
