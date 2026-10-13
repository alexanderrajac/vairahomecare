/**
 * Deterministic date formatting utilities to prevent SSR / Client hydration mismatch errors in Next.js
 */

const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

/**
 * Format ISO or Date string into predictable "DD Mon YYYY" (e.g. "10 Sep 2026")
 * This avoids differences between server locale (e.g. en-US mm/dd/yyyy) and client locale (en-IN dd/mm/yyyy).
 */
export function formatDate(dateInput: string | Date | undefined | null): string {
  if (!dateInput) return '';
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return String(dateInput);

  const day = String(d.getDate()).padStart(2, '0');
  const month = MONTHS_SHORT[d.getMonth()];
  const year = d.getFullYear();

  return `${day} ${month} ${year}`;
}

/**
 * Format ISO string to readable time (e.g. "02:30 PM")
 */
export function formatTime(dateInput: string | Date | undefined | null): string {
  if (!dateInput) return '';
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return '';

  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const hoursStr = String(hours).padStart(2, '0');

  return `${hoursStr}:${minutes} ${ampm}`;
}

/**
 * Format ISO date to "DD Mon YYYY, HH:MM AM/PM"
 */
export function formatDateTime(dateInput: string | Date | undefined | null): string {
  if (!dateInput) return '';
  return `${formatDate(dateInput)}, ${formatTime(dateInput)}`;
}
