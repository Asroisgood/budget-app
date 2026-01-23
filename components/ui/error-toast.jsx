"use client";

import { toast } from "sonner";

export function showErrorToast(message, options = {}) {
  return toast.error(message, {
    duration: 4000,
    position: "top-right",
    ...options,
  });
}

export function showSuccessToast(message, options = {}) {
  return toast.success(message, {
    duration: 3000,
    position: "top-right",
    ...options,
  });
}

export function showLoadingToast(message, options = {}) {
  return toast.loading(message, {
    duration: 0,
    position: "top-right",
    ...options,
  });
}

export function dismissToast(toastId) {
  if (toastId) {
    toast.dismiss(toastId);
  }
}
