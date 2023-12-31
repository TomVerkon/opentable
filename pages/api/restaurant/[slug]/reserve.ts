import { findAvailableTables } from '@/services/restaurant/findAvailableTables';
import prisma from '@/utils/client';
import { dtToDate, dtToISOStr } from '@/utils/dateUtils';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(req);
  if (req.method === 'POST') {
    const { slug, day, time, partySize } = req.query as {
      slug: string;
      day: string;
      time: string;
      partySize: string;
    };
    const {
      bookerFirstName,
      bookerLastName,
      bookerPhone,
      bookerEmail,
      bookerOccasion,
      bookerRequest,
    } = req.body;
    console.log('Body:', req.body);
    console.log(
      bookerEmail,
      bookerFirstName,
      bookerLastName,
      bookerPhone,
      bookerOccasion,
      bookerRequest,
    );
    // let errors: string[] = [];
    // const validationSchema = getReserveValidatorSchema(req.body);
    // validationSchema.forEach(check => {
    //   if (!check.valid) {
    //     errors.push(check.errorMessage + ', ');
    //   }
    // });

    // if (errors.length > 0) {
    //   return res.status(400).json({ errorMessage: errors });
    // }

    const restaurant = await prisma.restaurant.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
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

    const booking = await prisma.booking.create({
      data: {
        number_of_people: parseInt(partySize),
        booker_email: bookerEmail,
        booker_first_name: bookerFirstName,
        booker_last_name: bookerLastName,
        booker_phone: bookerPhone,
        booking_time: dtToDate(day, time),
        booker_occasion: bookerOccasion,
        booker_request: bookerRequest,
        restaurant_id: restaurant.id,
      },
    });

    const bookinsOnTableData = tablesToBook.map(table_id => {
      return {
        table_id,
        booking_id: booking.id,
      };
    });

    await prisma.booking_table.createMany({
      data: bookinsOnTableData,
    });

    return res.json({ tablesToBook });
  }
}
