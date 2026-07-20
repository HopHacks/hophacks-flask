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
        {/* Kept small and tucked to the edge on narrow viewports so the
            ribbon never overlaps page headers. */}
        <a
          id="mlh-trust-badge"
          className="fixed right-3 top-0 z-[10000] block w-[10%] min-w-[48px] max-w-[60px] sm:right-[50px] sm:min-w-[60px] sm:max-w-[100px]"
          href="https://mlh.io/na?utm_source=na-hackathon&utm_medium=TrustBadge&utm_campaign=2026-season&utm_content=white"
          target="_blank"
          rel="noopener noreferrer"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://logged-assets.s3.amazonaws.com/trust-badge/2027/mlh-trust-badge-2027-white.svg"
            alt="Major League Hacking 2026 Hackathon Season"
            className="w-full"
          />
        </a>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
