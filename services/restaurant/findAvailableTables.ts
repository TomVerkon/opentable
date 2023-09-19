import { times } from '@/data';
import { dtToDate } from '@/utils/dateUtils';
import { NextApiResponse } from 'next';
import prisma from '../../utils/client';

export const findAvailableTables = async ({
  time,
  day,
  restaurant,
  res,
}: {
  time: string;
  day: string;
  restaurant: {
    tables: {
      id: number;
      seats: number;
      restaurant_id: number;
      created_at: Date;
      updated_at: Date;
    }[];
    open_time: string;
    close_time: string;
  };
  res: NextApiResponse;
}) => {
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
        gte: dtToDate(day, searchTimes[0]),
        lt: dtToDate(day, searchTimes[searchTimes.length - 1]),
      },
    },
    select: {
      number_of_people: true,
      booking_time: true,
      tables: true,
    },
  });

  /* bookings should look somethimg like this
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
      date: dtToDate(day, searchTime),
      time: searchTime,
      tables,
    };
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
  searchTimesWithTables.forEach(t => {
    t.tables = t.tables.filter(table => {
      if (bookingTablesObj[t.date.toISOString()]) {
        if (bookingTablesObj[t.date.toISOString()][table.id]) return false;
      }
      return true;
    });
  });

  return searchTimesWithTables;
};
