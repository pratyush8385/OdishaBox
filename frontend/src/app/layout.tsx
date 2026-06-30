import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import ClientLayout from "@/components/ClientLayout";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OdishaBox - Authentic Odisha. Delivered.",
  description: "Order authentic Odia sweets (Chhena Poda, Khaja), hand-made badis, spices, and pickles delivered to your home in Bengaluru.",
  keywords: "OdishaBox, Odia food, Bengaluru, HSR Layout, Chhena Poda, Puri Khaja, Keonjhar Badi, Rasabali, Odia groceries",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full">
        <AuthProvider>
          <CartProvider>
            <ClientLayout>{children}</ClientLayout>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
