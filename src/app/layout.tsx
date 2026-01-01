import ThemeProvider from "@/components/customComponents/theme-provider";
import RouteTrackingProvider from "@/components/providers/RouteTrackingProvider";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Poppins, Roboto } from "next/font/google";
import "./globals.css";

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
    <html lang="en" suppressHydrationWarning>
      <body className={`${roboto.className} ${poppins.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={true}
        >
          <RouteTrackingProvider>
            <Toaster richColors duration={5000} />
            {children}
          </RouteTrackingProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
