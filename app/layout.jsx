// FILE PATH: app/layout.jsx
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import SidebarMenu from "@/components/SidebarMenu";
import CartDrawer from "@/components/CartDrawer";
import SearchOverlay from "@/components/SearchOverlay";
import AnnouncementBar from "@/components/AnnouncementBar";
import Footer from "@/components/Footer";
import MainWrapper from "@/components/MainWrapper";
import { AuthProvider } from "@/components/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata = {
  title: "The Bull & Bear Co. | For Traders. By Traders.",
  description:
    "T-Shirts for Market Minds. Premium minimal streetwear for the trader community.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-body">
        <AuthProvider>
          <AnnouncementBar />
          <Header />
          <SidebarMenu />
          <SearchOverlay />
          <CartDrawer />
          <MainWrapper>
            {children}
            <Footer />
          </MainWrapper>
          <BottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}
