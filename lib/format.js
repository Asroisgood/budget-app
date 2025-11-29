// lib/format.js

// Format currency ke Rupiah
export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return "-";

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0, // tanpa koma
  }).format(amount);
}

// Format tanggal ke format Indonesia
export function formatDate(dateString) {
  if (!dateString) return "-";

  const date = new Date(dateString);

  return new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

// Format tanggal singkat (opsional)
export function formatShortDate(dateString) {
  if (!dateString) return "-";

  const date = new Date(dateString);

  return new Intl.DateTimeFormat("id-ID", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}
