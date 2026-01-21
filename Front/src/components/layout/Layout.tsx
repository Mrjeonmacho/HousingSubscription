import type { PropsWithChildren } from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="bg-background-light dark:bg-background-dark text-[#111814] dark:text-white min-h-screen">
      <div className="layout-container flex h-full grow flex-col">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto w-full px-6 pt-12 pb-24">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
