import "./globals.css";
import ClientLayout from "@/client-layout";
import { ViewTransitions } from "next-view-transitions";

export const metadata = {
  title: "SIGIL LABS | Creative Engineering & Autonomous Systems",
  description:
    "Creative engineering, agentic AI systems, and high-scale EdTech ecosystems.",
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
      </body>
    </html>
  );
}
