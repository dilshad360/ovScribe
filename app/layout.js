
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthUserProvider, useAuth } from "./firebase/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ovScribe",
  description: "A Content Publishing Platform",
};

export default function RootLayout({ children }) {


  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthUserProvider>
        {children}
        </AuthUserProvider>
        </body>
    </html>
  );
}
