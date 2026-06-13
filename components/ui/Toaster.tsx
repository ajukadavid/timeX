"use client";

import { useEffect, useState } from "react";
import { subscribeToasts, removeToast, type Toast } from "@/lib/toast";

const typeStyles = {
  success: { bg: "bg-green-50", border: "border-green-200", text: "text-green-800", iconBg: "bg-green-100", icon: "text-green-400" },
  error:   { bg: "bg-red-50",   border: "border-red-200",   text: "text-red-800",   iconBg: "bg-red-100",   icon: "text-red-400" },
  info:    { bg: "bg-blue-50",  border: "border-blue-200",  text: "text-blue-800",  iconBg: "bg-blue-100",  icon: "text-blue-400" },
  warning: { bg: "bg-yellow-50",border: "border-yellow-200",text: "text-yellow-800",iconBg: "bg-yellow-100",icon: "text-yellow-400" },
};

function ToastItem({ toast }: { toast: Toast }) {
  const s = typeStyles[toast.type];
  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg max-w-md animate-in slide-in-from-right-2 ${s.bg} ${s.border}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${s.iconBg}`}>
        {toast.type === "success" && (
          <svg className={`w-5 h-5 ${s.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
        {toast.type === "error" && (
          <svg className={`w-5 h-5 ${s.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
        {toast.type === "warning" && (
          <svg className={`w-5 h-5 ${s.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        )}
        {toast.type === "info" && (
          <svg className={`w-5 h-5 ${s.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${s.text}`}>{toast.title}</p>
        {toast.description && <p className={`text-sm mt-1 opacity-80 ${s.text}`}>{toast.description}</p>}
      </div>
      <button onClick={() => removeToast(toast.id)} className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors" aria-label="Close">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => subscribeToasts(setToasts), []);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} />
        </div>
      ))}
    </div>
  );
}
