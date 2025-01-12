"use client"

import { getAurinkoAuthUrl } from "@/lib/aurinko";
import { Button } from "./ui/button";

export default function LinkAccountButton() {
  return (
    <div className="flex items-center justify-center h-screen">
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