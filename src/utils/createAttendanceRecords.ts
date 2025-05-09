import type { User } from '@/prisma-client';
import { db } from '@/server/db';
import { generateFullYearDates } from '@/utils/generateFullYearDates';

async function createAttendanceRecordsForUser(user: User) {
  const today = new Date();
  const excluded = ['2025-12-25', '2025-11-27'];
  const validDates = generateFullYearDates(today, excluded);

  const preferredTimeBlockId = user.timeBlockId ?? null;
  if (!preferredTimeBlockId) throw new Error("No time block available");

  const attendanceRecords = validDates.map((dateStr) => {
    const attendanceDate = new Date(dateStr);
    return {
      userId: user.id,
      date: attendanceDate,
      willCome: user.isRegular,
      hasCome: false,
      timeBlockId: preferredTimeBlockId,
    };
  });

  await db.attendance.createMany({
    data: attendanceRecords,
    skipDuplicates: true,
  });
}