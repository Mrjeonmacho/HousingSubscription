import { create } from "zustand";

export type AlertPayload = {
  title?: string;
  message: string;
  icon?: string;
  variant?: "default" | "danger";
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onClose?: () => void;
};

type UIState = {
  alertOpen: boolean;
  alert: AlertPayload | null;
  openAlert: (payload: AlertPayload) => void;
  closeAlert: () => void;
};

export const useUIStore = create<UIState>((set) => ({
  alertOpen: false,
  alert: null,

  openAlert: (payload) =>
    set({
      alertOpen: true,
      alert: {
        confirmText: "확인",
        ...payload,
      },
    }),

  closeAlert: () => set({ alertOpen: false, alert: null }),
}));
