import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-[#111814] dark:text-white min-h-screen">
      <div className="layout-container flex h-full grow flex-col">
        <Header />
        <main className="flex-1 max-w-6xl mx-auto w-full px-6 pt-4 pb-12">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
