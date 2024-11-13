import { Inter } from "next/font/google";
import "./globals.css";
import MainLayout from "./Components/Layouts/MainLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  // Primary metadata
  title: "Project Kanban – Task Management Application",
  description:
    "Efficiently organize and track tasks with a Kanban-style project management tool.",
  icons: ["/images/mainlogo2.svg"],

  // Canonical URL for SEO
  alternates: {
    canonical: "https://projectkanban.vercel.app",
  },

  metadataBase: new URL("https://projectkanban.vercel.app"),

  // Open Graph (OG) tags for social media sharing
  openGraph: {
    title: "Project Kanban – Task Management Application",
    description:
      "Organize tasks visually with Project Kanban, a dynamic task management tool.",
    images: [
      {
        url: "/images/kanban-board.webp",
        width: 1200,
        height: 630,
        alt: "Project Kanban Task Management Board",
      },
    ],
    type: "website",
    url: "https://projectkanban.vercel.app",
    siteName: "Project Kanban",
    locale: "en_US",
  },

  // Twitter Card data for sharing on Twitter
  twitter: {
    card: "summary_large_image",
    title: "Project Kanban – Task Management",
    description:
      "Visual task management with Project Kanban for efficient tracking and organization.",
    site: "@projectkanban",
    creator: "@projectkanban",
    images: ["/images/kanban-board.webp"],
  },

  // Robots meta tag (instructs search engine crawlers)
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = "width=device-width, initial-scale=1";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
