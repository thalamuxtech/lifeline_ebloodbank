import type { Metadata, Viewport } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Dock } from "@/components/layout/dock";
import { VoiceAgent } from "@/components/voice/agent";
import { AuthProvider } from "@/components/providers/auth-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-display", display: "swap" });

export const metadata: Metadata = {
  title: "LifeLine — Nigeria's E-Blood Bank",
  description:
    "Find blood. Save lives. Multilingual, voice and SMS enabled E-Blood Bank built for Nigeria. By Hale Youth Foundation.",
  keywords: ["blood bank", "Nigeria", "donor", "transfusion", "Hale Youth Foundation", "NBSA"],
  metadataBase: new URL("https://lifeline.ng"),
};

export const dynamic = "force-dynamic";

export const viewport: Viewport = {
  themeColor: "#B91C1C",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body>
        <AuthProvider>
          <Header />
          <main className="pb-28">{children}</main>
          <Footer />
          <Dock />
          <VoiceAgent />
        </AuthProvider>
      </body>
    </html>
  );
}
