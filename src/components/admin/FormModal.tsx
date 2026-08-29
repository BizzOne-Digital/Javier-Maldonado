"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  submitLabel?: string;
  loading?: boolean;
  size?: "md" | "lg" | "xl";
}

const sizeClasses = {
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export function FormModal({
  open,
  onClose,
  title,
  children,
  onSubmit,
  submitLabel = "Save",
  loading = false,
  size = "lg",
}: FormModalProps) {
  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-midnight/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        className={cn(
          "relative w-full bg-ivory rounded-xl shadow-2xl border border-champagne/40 flex flex-col max-h-[90vh]",
          sizeClasses[size]
        )}
        role="dialog"
        aria-modal
        aria-labelledby="modal-title"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-champagne/30 bg-midnight rounded-t-xl">
          <h2 id="modal-title" className="font-display text-xl text-ivory">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-champagne hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
          {onSubmit && (
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-champagne/30 bg-white/50 rounded-b-xl">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-midnight/70 hover:text-midnight transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 text-sm font-semibold rounded-lg bg-copper text-ivory hover:bg-copper/90 disabled:opacity-50 transition-colors"
              >
                {loading ? "Saving…" : submitLabel}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
