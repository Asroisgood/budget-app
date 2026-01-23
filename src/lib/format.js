/**
 * Format currency dengan format Indonesia yang konsisten
 * @param {number} amount - Jumlah uang
 * @returns {string} Format uang Indonesia
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format number dengan format Indonesia
 * @param {number} number - Angka
 * @returns {string} Format angka Indonesia
 */
export function formatNumber(number) {
  return new Intl.NumberFormat("id-ID").format(number);
}
