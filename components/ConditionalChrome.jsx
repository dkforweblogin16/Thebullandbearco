// FILE PATH: components/ConditionalChrome.jsx
"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import BottomNav from "./BottomNav";
import SidebarMenu from "./SidebarMenu";
import CartDrawer from "./CartDrawer";
import SearchOverlay from "./SearchOverlay";
import AnnouncementBar from "./AnnouncementBar";
import Footer from "./Footer";
import MainWrapper from "./MainWrapper";

// The admin dashboard (app/admin/layout.jsx) is its own separate, fully
// self-contained shell with its own sidebar/topbar. None of the
// storefront's global chrome — announcement bar, header, hamburger menu,
// search, cart drawer, footer, bottom nav — should render underneath it.
// This is the only thing standing between "one root layout for the
// whole app" (required by Next.js) and "two completely separate UIs".
export default function ConditionalChrome({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
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
    </>
  );
}

