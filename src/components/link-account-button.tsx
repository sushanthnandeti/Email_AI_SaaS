"use client";

import { getAurinkoAuthUrl } from "@/lib/aurinko";
import { Button } from "./ui/button";

export default function LinkAccountButton() {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <p className="text-md text-red-600 text-center max-w-md">
        <strong>Important:</strong> Please use a <strong>Google Admin account</strong> to link your account, as Google has recently updated its terms and conditions.
      </p>
      <Button
        className="px-6 py-3 text-lg"
        onClick={async () => {
          const authurl = await getAurinkoAuthUrl("Google");
          window.location.href = authurl;
          console.log(authurl);
        }}
      >
        Link Account
      </Button>
    </div>
  );
}