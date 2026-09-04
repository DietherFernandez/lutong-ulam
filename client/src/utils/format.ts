// Centralised display formatters used across the app.
//
// Keeping these in one place means changing the currency or time format
// later only requires editing this file.

/**
 * Format a numeric price as Philippine Peso (₱).
 *
 * The database stores prices as plain numbers; we apply a fixed 2-decimal
 * format and prefix with the peso symbol. Handles strings, null, and
 * undefined gracefully so a missing value never throws.
 *
 * Examples:
 *   formatPrice(150)      => "₱150.00"
 *   formatPrice(150.5)    => "₱150.50"
 *   formatPrice("12.34")  => "₱12.34"
 *   formatPrice(null)     => "₱0.00"
 */
export function formatPrice(value: number | string | null | undefined): string {
  const n = Number(value);
  const safe = Number.isFinite(n) ? n : 0;
  return `₱${safe.toFixed(2)}`;
}

/**
 * Convert a 24-hour "HH:MM" time string to a 12-hour format with AM/PM.
 *
 * The database and <input type="time"> always use 24-hour, but Filipino
 * diners expect to see times like "2:00 PM" on the public site.
 *
 * Examples:
 *   formatTime("09:00")  => "9:00 AM"
 *   formatTime("13:30")  => "1:30 PM"
 *   formatTime("00:00")  => "12:00 AM"
 *   formatTime("12:00")  => "12:00 PM"
 *   formatTime("")       => ""
 *   formatTime(null)     => ""
 */
export function formatTime(value: string | null | undefined): string {
  if (!value) return '';
  const match = /^(\d{1,2}):(\d{2})/.exec(value);
  if (!match) return value;
  let hours = Number(match[1]);
  const minutes = match[2];
  if (hours < 0 || hours > 23) return value;
  const period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  if (hours === 0) hours = 12;
  return `${hours}:${minutes} ${period}`;
}
