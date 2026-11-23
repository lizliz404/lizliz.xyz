import type { Metadata } from "next";
import PrivacyContent from "./PrivacyContent";

const TITLE = "Privacy Policy";
const DESCRIPTION =
  "Privacy policy for the personal tools on lizliz.xyz — personal local utilities, no third-party data collection.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "https://lizliz.xyz/privacy/",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
