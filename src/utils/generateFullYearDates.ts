// utils/generateWorkingDates.ts

import { isMonday, isTuesday, isWednesday, isThursday } from 'date-fns';

export function generateFullYearDates(
  startDate: Date,
  excludedDates: string[] // Format: 'YYYY-MM-DD'
): string[] {
  const workingDates: string[] = [];
  const endDate = new Date(startDate.getFullYear(), 11, 31); // Dec 31 of current year

  const current = new Date(startDate);

  while (current <= endDate) {
    const isoDate = current.toISOString().split('T')[0]!; // 'YYYY-MM-DD'

    if (
      (isMonday(current) || isTuesday(current) || isWednesday(current) || isThursday(current)) &&
      !excludedDates.includes(isoDate)
    ) {
      workingDates.push(isoDate);
    }

    current.setDate(current.getDate() + 1);
  }

  return workingDates;
}
