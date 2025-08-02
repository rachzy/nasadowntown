// Most of this functions were taken from https://github.com/ajhollid/kepler-utils
// I decided pasting them here instead of just importing them from the lib to adapt them to typescript

/**
 * Converts a Gregorian date to a Julian date.
 * See: https://en.wikipedia.org/wiki/Julian_day#Converting_Gregorian_calendar_date_to_Julian_Day_Number
 *
 * @param gregorianDate - The Gregorian date in the "YYYY/MM/DD" format.
 * @returns The Julian date as a number.
 * @throws Error if the date format is invalid.
 *
 * @example
 * // returns 2451545
 * getJulianDate("2000/01/01");
 */
export function getJulianDate(gregorianDate: string): number {
  if (!/^\d{4}\/\d{1,2}\/\d{1,2}$/.test(gregorianDate)) {
    throw new Error('Invalid date format. Expected "YYYY/MM/DD".');
  }
  const [yearStr, monthStr, dayStr] = gregorianDate.split('/');
  const year: number = parseInt(yearStr, 10);
  const month: number = parseInt(monthStr, 10);
  const day: number = parseInt(dayStr, 10);

  const a: number = Math.floor((14 - month) / 12);
  const y: number = year + 4800 - a;
  const m: number = month + 12 * a - 3;

  const julianDay: number =
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;

  return julianDay;
}

/**
 * Converts a Date object to a Gregorian date string in the standard "YYYY-MM-DD" format.
 *
 * @param date - The Date object to convert.
 * @returns The date as a string in "YYYY/MM/DD" format.
 *
 * @example
 * // returns "2023/06/15"
 * getGregorianDateInStandardFormat(new Date("2023-06-15T12:00:00Z"));
 */
export function getGregorianDateInStandardFormat(date: Date): string {
  return date.toISOString().split('T')[0].replace(/-/g, '/');
}
