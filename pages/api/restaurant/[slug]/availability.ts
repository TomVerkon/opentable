import { times } from '@/data';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../utils/client';

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

  const searchTimes = times.find(t => {
    return t.time === time;
  })?.searchTimes;

  /* searchTimes should look something like this
   "searchTimes": [
        "19:00:00.000Z",
        "19:30:00.000Z",
        "20:00:00.000Z",
        "20:30:00.000Z",
        "21:00:00.000Z"
    ],
  */

  if (!searchTimes) {
    return res.status(400).json({ errorMessage: 'Invalid data provided' });
  }

  const bookings = await prisma.booking.findMany({
    where: {
      booking_time: {
        gte: new Date(`${day}T${searchTimes[0]}`),
        lt: new Date(`${day}T${searchTimes[searchTimes.length - 1]}`),
      },
    },
    select: {
      number_of_people: true,
      booking_time: true,
      tables: true,
    },
  });

  /* bookings should looke somethimg like this
  "bookings": [
        {
            "number_of_people": 2,
            "booking_time": "2023-01-01T20:00:00.000Z",
            "tables": [
                {
                    "booking_id": 10,
                    "table_id": 28,
                    "created_at": "2023-09-09T00:01:06.604Z",
                    "updated_at": "2023-09-09T00:01:06.604Z"
                }
            ]
        },
        {
            "number_of_people": 8,
            "booking_time": "2023-01-01T20:00:00.000Z",
            "tables": [
                {
                    "booking_id": 11,
                    "table_id": 29,
                    "created_at": "2023-09-09T00:01:06.604Z",
                    "updated_at": "2023-09-09T00:01:06.604Z"
                },
                {
                    "booking_id": 11,
                    "table_id": 30,
                    "created_at": "2023-09-09T00:01:06.604Z",
                    "updated_at": "2023-09-09T00:01:06.604Z"
                }
            ]
        },
        {
            "number_of_people": 4,
            "booking_time": "2023-01-01T19:30:00.000Z",
            "tables": [
                {
                    "booking_id": 12,
                    "table_id": 30,
                    "created_at": "2023-09-09T00:01:06.604Z",
                    "updated_at": "2023-09-09T00:01:06.604Z"
                }
            ]
        }
    ],
  */

  let bookingTablesObj: { [key: string]: { [key: number]: true } } = {};

  bookings.forEach(booking => {
    bookingTablesObj[booking.booking_time.toISOString()] = booking.tables.reduce(
      (object, table) => {
        let curGroup = bookingTablesObj[booking.booking_time.toISOString()] ?? {};
        const val = { ...object, [table.table_id]: true };
        return { ...curGroup, ...val };
      },
      {},
    );
  });

  /* bookingTablesObj should look somthing like this
  "bookingTablesObj": {
          "2023-01-01T20:00:00.000Z": {
              "28": true,
              "29": true,
              "30": true
          },
          "2023-01-01T19:30:00.000Z": {
              "30": true
          }
  */

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

  const tables = restaurant.tables;

  /* tables should look something like this
  "tables": [
        {
            "id": 28,
            "seats": 2,
            "restaurant_id": 337,
            "created_at": "2023-09-09T00:01:06.601Z",
            "updated_at": "2023-09-09T00:01:06.601Z"
        },
        {
            "id": 29,
            "seats": 4,
            "restaurant_id": 337,
            "created_at": "2023-09-09T00:01:06.602Z",
            "updated_at": "2023-09-09T00:01:06.602Z"
        },
        {
            "id": 30,
            "seats": 4,
            "restaurant_id": 337,
            "created_at": "2023-09-09T00:01:06.602Z",
            "updated_at": "2023-09-09T00:01:06.602Z"
        }
    ],
    */

  const searchTimesWithTables = searchTimes.map(searchTime => {
    return {
      date: new Date(`${day}T${searchTime}`),
      time: searchTime,
      tables,
    };
  });

  searchTimesWithTables.forEach(t => {
    t.tables = t.tables.filter(table => {
      if (bookingTablesObj[t.date.toISOString()]) {
        if (bookingTablesObj[t.date.toISOString()][table.id]) return false;
      }
      return true;
    });
  });

  /* searchTimesWithTables should look something like this
     "searchTimesWithTables": [
        {
            "date": "2023-01-01T19:00:00.000Z",
            "time": "19:00:00.000Z",
            "tables": [
                {
                    "id": 28,
                    "seats": 2,
                    "restaurant_id": 337,
                    "created_at": "2023-09-09T00:01:06.601Z",
                    "updated_at": "2023-09-09T00:01:06.601Z"
                },
                {
                    "id": 29,
                    "seats": 4,
                    "restaurant_id": 337,
                    "created_at": "2023-09-09T00:01:06.602Z",
                    "updated_at": "2023-09-09T00:01:06.602Z"
                },
                {
                    "id": 30,
                    "seats": 4,
                    "restaurant_id": 337,
                    "created_at": "2023-09-09T00:01:06.602Z",
                    "updated_at": "2023-09-09T00:01:06.602Z"
                }
            ]
        },
        {
            "date": "2023-01-01T19:30:00.000Z",
            "time": "19:30:00.000Z",
            "tables": [
                {
                    "id": 28,
                    "seats": 2,
                    "restaurant_id": 337,
                    "created_at": "2023-09-09T00:01:06.601Z",
                    "updated_at": "2023-09-09T00:01:06.601Z"
                },
                {
                    "id": 29,
                    "seats": 4,
                    "restaurant_id": 337,
                    "created_at": "2023-09-09T00:01:06.602Z",
                    "updated_at": "2023-09-09T00:01:06.602Z"
                }
            ]
        },
        {
            "date": "2023-01-01T20:00:00.000Z",
            "time": "20:00:00.000Z",
            "tables": []
        },
        {
            "date": "2023-01-01T20:30:00.000Z",
            "time": "20:30:00.000Z",
            "tables": [
                {
                    "id": 28,
                    "seats": 2,
                    "restaurant_id": 337,
                    "created_at": "2023-09-09T00:01:06.601Z",
                    "updated_at": "2023-09-09T00:01:06.601Z"
                },
                {
                    "id": 29,
                    "seats": 4,
                    "restaurant_id": 337,
                    "created_at": "2023-09-09T00:01:06.602Z",
                    "updated_at": "2023-09-09T00:01:06.602Z"
                },
                {
                    "id": 30,
                    "seats": 4,
                    "restaurant_id": 337,
                    "created_at": "2023-09-09T00:01:06.602Z",
                    "updated_at": "2023-09-09T00:01:06.602Z"
                }
            ]
        },
        {
            "date": "2023-01-01T21:00:00.000Z",
            "time": "21:00:00.000Z",
            "tables": [
                {
                    "id": 28,
                    "seats": 2,
                    "restaurant_id": 337,
                    "created_at": "2023-09-09T00:01:06.601Z",
                    "updated_at": "2023-09-09T00:01:06.601Z"
                },
                {
                    "id": 29,
                    "seats": 4,
                    "restaurant_id": 337,
                    "created_at": "2023-09-09T00:01:06.602Z",
                    "updated_at": "2023-09-09T00:01:06.602Z"
                },
                {
                    "id": 30,
                    "seats": 4,
                    "restaurant_id": 337,
                    "created_at": "2023-09-09T00:01:06.602Z",
                    "updated_at": "2023-09-09T00:01:06.602Z"
                }
            ]
        }
    ]
  */

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
      const timeIsGTEOpeningHour =
        new Date(`${day}T${availability.time}`) >= new Date(`${day}T${restaurant.open_time}`);
      const timeIsLTEClosingHour =
        new Date(`${day}T${availability.time}`) <= new Date(`${day}T${restaurant.close_time}`);

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
