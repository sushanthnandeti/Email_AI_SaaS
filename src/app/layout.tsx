import "@/styles/globals.css";
import KBar from "@/components/KBar";
import { ClerkProvider } from "@clerk/nextjs";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { TRPCReactProvider } from "@/trpc/react";
import { ThemeProvider } from "@/components/theme-provider";


export const metadata: Metadata = {
  title: "Normal Human",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${GeistSans.variable}`}>
        <body>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
            <TRPCReactProvider>
               <KBar>
                {children}
              </KBar> 
            </TRPCReactProvider>
          </ThemeProvider>
            
        </body>
      </html>
    </ClerkProvider>
  );
}