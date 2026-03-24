import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Eco Agronomist IA",
  description: "L'IA au service de l'agriculture marocaine",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={inter.className}
        suppressHydrationWarning={true} // Ajoutez ceci pour ignorer les extensions comme Grammarly
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
