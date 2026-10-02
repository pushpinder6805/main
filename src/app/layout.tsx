import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LiveChat from "./components/LiveChat";
import { AuthProvider } from "./contexts/AuthContext";

export const metadata: Metadata = {
  metadataBase: new URL("https://workspherepulse.com"),
  title: {
    default: "Workspherepulse | Workplace Guidance & Advisor Sessions",
    template: "%s | Workspherepulse",
  },
  description: "Book private sessions with approved workplace advisors, access AI guidance and join the Workspherepulse professional community.",
  openGraph: {
    title: "Workspherepulse",
    description: "Professional guidance for navigating workplace challenges.",
    url: "https://workspherepulse.com",
    siteName: "Workspherepulse",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <LiveChat />
        </AuthProvider>
      </body>
    </html>
  );
}
