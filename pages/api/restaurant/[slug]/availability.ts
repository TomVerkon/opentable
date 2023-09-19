import { findAvailableTables } from '@/services/restaurant/findAvailableTables';
import prisma from '@/utils/client';
import { dtToDate } from '@/utils/dateUtils';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug, day, time, partySize } = req.query as {
    slug: string;
    day: string;
    time: string;
    partySize: string;
  };

  if (!day || !time || !partySize) {
    return res.status(400).json({ errorMessage: 'Invalid data provided' });
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
    select: {
      tables: true,
      open_time: true,
      close_time: true,
    },
  });

  if (!restaurant) {
    return res.status(400).json({ errorMessage: 'Invalid data provided' });
  }

  const searchTimesWithTables = await findAvailableTables({ time, day, restaurant, res });

  if (!searchTimesWithTables) {
    return res.status(400).json({ errorMessage: 'Invalid data provided' });
  }

  const availabilities = searchTimesWithTables
    .map(t => {
      const sumSeats = t.tables.reduce((sum, table) => {
        return sum + table.seats;
      }, 0);

      return {
        time: t.time,
        available: sumSeats >= parseInt(partySize),
      };
    })
    .filter(availability => {
      const availDT = dtToDate(day, availability.time);
      const timeIsGTEOpeningHour = availDT >= dtToDate(day, restaurant.open_time);
      const timeIsLTEClosingHour = availDT <= dtToDate(day, restaurant.close_time);

      return timeIsGTEOpeningHour && timeIsLTEClosingHour;
    });

  return res.json(
    // searchTimes,
    // bookings,
    // bookingTablesObj,
    // tables,
    // searchTimesWithTables,
    availabilities,
  );
}
