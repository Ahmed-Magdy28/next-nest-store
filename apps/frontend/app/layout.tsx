import type { Metadata } from "next";
import { websiteTitle, websiteDescription } from "@repo/shared/constants";

export const metadata: Metadata = {
  title: websiteTitle,
  description: websiteDescription,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
