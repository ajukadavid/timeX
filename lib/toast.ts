type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
  timeout?: number;
}

type Listener = (toasts: Toast[]) => void;

let toasts: Toast[] = [];
const listeners: Listener[] = [];

function notify() {
  listeners.forEach((l) => l([...toasts]));
}

export function addToast(toast: Omit<Toast, "id">) {
  const t: Toast = { id: Math.random().toString(36).slice(2), timeout: 3000, ...toast };
  toasts = [...toasts, t];
  notify();
  if (t.timeout && t.timeout > 0) {
    setTimeout(() => removeToast(t.id), t.timeout);
  }
}

export function removeToast(id: string) {
  toasts = toasts.filter((t) => t.id !== id);
  notify();
}

export function subscribeToasts(listener: Listener) {
  listeners.push(listener);
  listener([...toasts]);
  return () => {
    const i = listeners.indexOf(listener);
    if (i > -1) listeners.splice(i, 1);
  };
}

export function toast(title: string, type: ToastType = "info", description?: string) {
  addToast({ title, type, description });
}
