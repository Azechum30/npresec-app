import ThemeProvider from "@/components/customComponents/theme-provider";
import { ToggleOverflow } from "@/components/customComponents/toggle-overflow";
import RouteTrackingProvider from "@/components/providers/RouteTrackingProvider";
import { Toaster } from "@/components/ui/sonner";
import "@/lib/orpc.server";
import { Loader } from "lucide-react";
import type { Metadata } from "next";
import { Poppins, Roboto, Geist } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
export const metadata: Metadata = {
  title: {
    default: "Presby SHTS Nakpanduri - School Management System",
    template: "%s | Presby SHTS Nakpanduri",
  },
  description:
    "A modern and intuitive school management information system built with top-notch technologies to offer an intuitive user experience",
  keywords: "school, management, system, education, Presby SHTS Nakpanduri",
  authors: [
    { name: "Presby SHTS Nakpanduri", url: "https://npresec-mis.vercel.app" },
  ],
  creator: "Presby SHTS Nakpanduri",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body className={`${roboto.className} ${poppins.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={true}>
          <Suspense
            fallback={
              <div className="w-full h-screen flex justify-center items-center ">
                <Loader className="size-16 text-primary animate-spin" />
              </div>
            }>
            <RouteTrackingProvider>
              <Toaster richColors duration={5000} />
              {children}
              <ToggleOverflow />
            </RouteTrackingProvider>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
