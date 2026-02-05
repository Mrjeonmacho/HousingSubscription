// Front/src/components/layout/Layout.tsx
import { Outlet } from "react-router-dom";
import { useUIStore } from "../../store/uiStore";
import Header from "./Header";
import Footer from "./Footer";
import AlertModal from "../modals/AlertModal";

export default function Layout() {
  const alertOpen = useUIStore((s) => s.alertOpen);
  const alert = useUIStore((s) => s.alert);
  const closeAlert = useUIStore((s) => s.closeAlert);

  return (
    <div className="bg-background-light dark:bg-background-dark text-[#111814] dark:text-white min-h-screen">
      <div className="layout-container flex h-full grow flex-col">
        <Header />

        <main className="flex-1 max-w-6xl mx-auto w-full px-6 pt-4 pb-12">
          <Outlet />
        </main>

        <Footer />

        <AlertModal
          isOpen={alertOpen}
          title={alert?.title}
          message={alert?.message ?? ""}
          confirmText={alert?.confirmText ?? "확인"}
          onConfirm={() => {
            const cb = alert?.onConfirm;
            closeAlert();
            cb?.();
          }}
          onClose={closeAlert}
          closeOnEsc={true}
          closeOnOverlayClick={false}
          isLoading={false}
        />
      </div>
    </div>
  );
}
