import "./globals.css";
import ClientLayout from "@/client-layout";
import { ViewTransitions } from "next-view-transitions";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@next/third-parties/google";

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const metadata = {
  metadataBase: new URL("https://www.sigillabs.agency"),
  title: "SIGIL LABS | Creative Engineering & Autonomous Systems",
  description:
    "Creative engineering, agentic AI systems, and high-scale EdTech ecosystems.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "SIGIL LABS | Creative Engineering & Autonomous Systems",
    description:
      "Creative engineering, agentic AI systems, and high-scale EdTech ecosystems.",
    url: "https://www.sigillabs.agency",
    siteName: "SIGIL LABS",
    type: "website",
    images: [{ url: "/showcase/opt/sigil_labs_updated_hero.webp", width: 1200, height: 630, alt: "SIGIL LABS" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SIGIL LABS | Creative Engineering & Autonomous Systems",
    description:
      "Creative engineering, agentic AI systems, and high-scale EdTech ecosystems.",
    images: ["/showcase/opt/sigil_labs_updated_hero.webp"],
  },
  icons: {
    icon: "/site-logo.png",
    shortcut: "/site-logo.png",
    apple: "/site-logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ViewTransitions>
          <ClientLayout>{children}</ClientLayout>
        </ViewTransitions>
        <Analytics />
        {gaMeasurementId ? <GoogleAnalytics gaId={gaMeasurementId} /> : null}
      </body>
    </html>
  );
}
