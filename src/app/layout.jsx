import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ensureUploadDirectories } from "../lib/upload-helper";

// Ensure uploads directory exists
try {
  ensureUploadDirectories();
} catch (error) {
  console.error("Failed to create upload directories:", error);
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Exam Portal ",
  description: "exams for fun",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900" >
        {children}
      </body>
    </html>
  );
}