"use client";

import { useEffect } from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

interface ActionToastProps {
  message: string;
  type?: "success" | "error";
  onDismiss: () => void;
  duration?: number;
}

export function ActionToast({ message, type = "success", onDismiss, duration = 4200 }: ActionToastProps) {
  useEffect(() => {
    const timer = window.setTimeout(onDismiss, duration);
    return () => window.clearTimeout(timer);
  }, [duration, message, onDismiss]);

  const isError = type === "error";
  return <div className={`fixed right-3 top-3 z-[100] flex w-[calc(100%-1.5rem)] max-w-sm animate-[toast-in_.24s_ease-out] items-start gap-3 rounded-2xl border bg-white p-4 shadow-2xl sm:right-5 sm:top-5 ${isError ? "border-red-200" : "border-emerald-200"}`} role={isError ? "alert" : "status"} aria-live={isError ? "assertive" : "polite"}>
    <span className={`mt-0.5 rounded-full p-1 ${isError ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}>{isError ? <AlertCircle size={18}/> : <CheckCircle2 size={18}/>}</span>
    <p className={`min-w-0 flex-1 text-sm font-medium leading-5 ${isError ? "text-red-900" : "text-emerald-900"}`}>{message}</p>
    <button type="button" onClick={onDismiss} aria-label="Dismiss notification" className="rounded-md p-1 text-stone-500 hover:bg-stone-100 hover:text-stone-800"><X size={16}/></button>
  </div>;
}
