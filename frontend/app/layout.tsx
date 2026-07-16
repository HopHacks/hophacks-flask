import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./util/auth";

export const metadata: Metadata = {
  title: "HopHacks 2026",
  description: "Apply now for HopHacks 2026 — Johns Hopkins' hackathon.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <a
          id="mlh-trust-badge"
          style={{
            display: "block",
            maxWidth: "100px",
            minWidth: "60px",
            position: "fixed",
            right: "50px",
            top: 0,
            width: "10%",
            zIndex: 10000,
          }}
          href="https://mlh.io/na?utm_source=na-hackathon&utm_medium=TrustBadge&utm_campaign=2026-season&utm_content=white"
          target="_blank"
          rel="noopener noreferrer"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://logged-assets.s3.amazonaws.com/trust-badge/2027/mlh-trust-badge-2027-white.svg"
            alt="Major League Hacking 2026 Hackathon Season"
            style={{ width: "100%" }}
          />
        </a>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
