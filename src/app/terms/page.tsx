import type { Metadata } from "next";
import TermsContent from "./TermsContent";

const TITLE = "Terms of Service";
const DESCRIPTION =
  "Terms of service for the personal tools on lizliz.xyz — personal utilities provided as-is.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "https://lizliz.xyz/terms/",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function TermsPage() {
  return <TermsContent />;
}
