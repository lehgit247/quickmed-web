import { LanguageProvider } from './context/LanguageContext';
import FloatingCallButton from "./components/FloatingCallButton";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const metadata = {
  title: "QuickMed Care — Instant Healthcare. Anywhere. Anytime.",
  description:
    "Consult licensed doctors in minutes, get real e-prescriptions, and book vetted hospitals near you.",
  metadataBase: new URL("https://quickmed-care.com"),
  openGraph: {
    title: "QuickMed Care — Instant Healthcare. Anywhere. Anytime.",
    description:
      "Consult licensed doctors in minutes, get real e-prescriptions, and book vetted hospitals.",
    url: "https://quickmed-care.com",
    siteName: "QuickMed Care",
    images: ["/og-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QuickMed Care",
    description: "Instant Healthcare. Anywhere. Anytime.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <Navbar />
          <FloatingCallButton />
          <main className="page-content">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
