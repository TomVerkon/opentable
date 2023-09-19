import { findAvailableTables } from '@/services/restaurant/findAvailableTables';
import prisma from '@/utils/client';
import { dtToDate, dtToISOStr } from '@/utils/dateUtils';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug, day, time, partySize } = req.query as {
    slug: string;
    day: string;
    time: string;
    partySize: string;
  };

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
    return res.status(400).json({ errorMessage: 'Restaurant not found' });
  }

  if (
    dtToDate(day, time) < dtToDate(day, restaurant.open_time) ||
    dtToDate(day, time) > dtToDate(day, restaurant.close_time)
  ) {
    return res.status(400).json({ errorMessage: 'Restaurant is closed at requested time' });
  }

  const searchTimesWithTables = await findAvailableTables({ time, day, restaurant, res });

  if (!searchTimesWithTables) {
    return res.status(400).json({ errorMessage: 'No tables available at requested time' });
  }

  const searchTimeWithTables = searchTimesWithTables.find(t => {
    return t.date.toISOString() === dtToISOStr(day, time);
  });

  if (!searchTimeWithTables) {
    return res.status(400).json({ errorMessage: 'No tables available at requested time' });
  }

  const tablesCount: {
    2: number[];
    4: number[];
  } = {
    2: [],
    4: [],
  };

  searchTimeWithTables?.tables.forEach(table => {
    if (table.seats === 4) {
      tablesCount[4].push(table.id);
    } else {
      tablesCount[2].push(table.id);
    }
  });

  const tablesToBook: number[] = [];
  let seatsRemaining = parseInt(partySize);

  while (seatsRemaining > 0) {
    if (seatsRemaining >= 3) {
      if (tablesCount[4][0]) {
        tablesToBook.push(tablesCount[4][0]);
        tablesCount[4].shift();
        seatsRemaining -= 4;
      } else {
        tablesToBook.push(tablesCount[2][0]);
        tablesCount[2].shift();
        seatsRemaining -= 2;
      }
    } else {
      if (tablesCount[2][0]) {
        tablesToBook.push(tablesCount[2][0]);
        tablesCount[2].shift();
        seatsRemaining -= 2;
      } else {
        tablesToBook.push(tablesCount[4][0]);
        tablesCount[4].shift();
        seatsRemaining -= 4;
      }
    }
  }

  return res.json({ tablesToBook });
}
