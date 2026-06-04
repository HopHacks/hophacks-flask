import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./util/auth";

export const metadata: Metadata = {
  title: "HopHacks 2026",
  description: "Get notified when applications open for HopHacks 2026.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
