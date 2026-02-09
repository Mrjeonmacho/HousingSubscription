// Front\src\components\layout\FullLayout.tsx
import { Outlet } from "react-router-dom";
import Header from "../layout/Header";

export default function FullLayout() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col">
      <Header />

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}