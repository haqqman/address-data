
"use client";

import { useState } from "react";
import { Button as NextUIButton, Input as NextUIInput, Card as NextUICard, CardHeader as NextUICardHeader, CardBody as NextUICardBody, Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import { Copy, Eye, EyeOff, RefreshCw, AlertTriangle } from "lucide-react";

// Placeholder for API key generation logic
async function generateNewApiKeys() {
  return new Promise<{publicKey: string, privateKey: string}>(resolve => {
    setTimeout(() => {
      resolve({
        publicKey: `pk_live_${Math.random().toString(36).substring(2, 18)}`, // Adjusted length
        privateKey: `sk_live_${Math.random().toString(36).substring(2, 34)}`, // Adjusted length
      });
    }, 500);
  });
}

export function ApiKeyDisplay() {
  const [publicKey, setPublicKey] = useState("pk_live_xxxxxxxxxxxxxxxx");
  const [privateKey, setPrivateKey] = useState("sk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCopyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    // toast removed, consider a small visual cue if needed or rely on browser's default
    console.log(`${keyName} Copied!`);
  };

  const handleGenerateKeys = async () => {
    setIsGenerating(true);
    const keys = await generateNewApiKeys();
    setPublicKey(keys.publicKey);
    setPrivateKey(keys.privateKey);
    setShowPrivateKey(true); 
    setIsGenerating(false);
    // toast removed
    console.log("API Keys Generated. Store your private key securely.");
  };

  return (
    <NextUICard className="shadow-lg rounded-xl">
      <NextUICardHeader className="px-6 pt-6 pb-2">
        <h2 className="text-xl font-semibold">Developer API Keys</h2>
        <p className="text-sm text-foreground-500">
          Use these keys to authenticate your API requests. Keep your private key secure.
        </p>
      </NextUICardHeader>
      <NextUICardBody className="space-y-6 p-6">
        <div className="space-y-2">
          <NextUIInput
            label="Public Key"
            id="publicKey"
            value={publicKey}
            isReadOnly
            variant="bordered"
            fullWidth
            endContent={
              <NextUIButton isIconOnly variant="light" onPress={() => handleCopyToClipboard(publicKey, "Public Key")} aria-label="Copy Public Key">
                <Copy className="h-4 w-4" />
              </NextUIButton>
            }
          />
        </div>

        <div className="space-y-2">
           <NextUIInput
            label="Private Key"
            id="privateKey"
            type={showPrivateKey ? "text" : "password"}
            value={privateKey}
            isReadOnly
            variant="bordered"
            fullWidth
            endContent={
              <div className="flex items-center">
                <NextUIButton isIconOnly variant="light" onPress={() => setShowPrivateKey(!showPrivateKey)} aria-label={showPrivateKey ? "Hide Private Key" : "Show Private Key"}>
                  {showPrivateKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </NextUIButton>
                <NextUIButton isIconOnly variant="light" onPress={() => handleCopyToClipboard(privateKey, "Private Key")} aria-label="Copy Private Key">
                  <Copy className="h-4 w-4" />
                </NextUIButton>
              </div>
            }
          />
        </div>
        
        <div className="flex items-start p-4 bg-danger-50 border border-danger-200 rounded-lg text-danger-700">
          <AlertTriangle className="h-5 w-5 mr-3 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold">Important Security Notice</h3>
            <p className="text-sm">
              Your Private Key is shown only once upon generation. Treat it like a password and store it securely. If lost, you will need to generate a new key pair.
            </p>
          </div>
        </div>
        
        <Popover placement="top">
          <PopoverTrigger>
            <NextUIButton 
              color="warning" // Accent color
              className="text-white"
              isLoading={isGenerating} 
              disabled={isGenerating}
              startContent={!isGenerating ? <RefreshCw className="h-4 w-4" /> : null}
            >
              {isGenerating ? "Generating..." : "Generate New Key Pair"}
            </NextUIButton>
          </PopoverTrigger>
          <PopoverContent>
            <div className="px-1 py-2">
              <div className="text-small font-bold">Confirm Generation</div>
              <div className="text-tiny">This will invalidate your current keys.</div>
              <NextUIButton size="sm" color="warning" className="mt-2 text-white" onPress={handleGenerateKeys}>
                Confirm &amp; Generate
              </NextUIButton>
            </div>
          </PopoverContent>
        </Popover>

        <p className="text-xs text-foreground-500">
          Generating new keys will invalidate your current key pair immediately.
        </p>
      </NextUICardBody>
    </NextUICard>
  );
}
