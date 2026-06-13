"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg" | "xl" | "2xl";

const sizeClasses: Record<Size, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
};

interface XModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  size?: Size;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function XModal({ open, onClose, title, size = "md", children, footer }: XModalProps) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" onClick={onClose}>
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={cn("w-full bg-white rounded-lg shadow-xl", sizeClasses[size])}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors ml-auto" aria-label="Close">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="px-6 py-4">{children}</div>
          {footer && <div className="px-6 py-4 border-t border-gray-200">{footer}</div>}
        </div>
      </div>
      <div className="fixed inset-0 bg-black/50 -z-10" onClick={onClose} />
    </div>
  );
}
