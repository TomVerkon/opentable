import { PRICE, PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

// interface iRestaurant {
//   id: number;
//   name: string;
//   main_image: string;
//   images: string[];
//   description: string;
//   open_time: string;
//   close_time: string;
//   slug: string;
//   price: PRICE;
//   location_id: number;
//   cuisine_id: number;
//   created_at: Date;
//   updated_at: Date;
//   location: {
//     name: string;
//   };
//   Cuisine: {
//     name: string;
//   };
// }

// const fetchRestaurant = async (slug: string): Promise<iRestaurant | null> => {
//   return (await prisma.restaurant.findUnique({
//     include: {
//       location: {
//         select: { name: true },
//       },
//       Cuisine: {
//         select: { name: true },
//       },
//     },
//     where: { slug: slug },
//   })) as iRestaurant;
// };

// type Data = {
//   results: iRestaurant;
// };

// interface Restaurant {
//   id: number;
//   name: string;
//   main_image: string;
//   description: string;
//   slug: string;
//   price: PRICE;
//   location: {
//     name: string;
//   };
//   Cuisine: {
//     name: string;
//   };
// }

// const fetchRestaurants = async (city: string): Promise<Restaurant[]> => {
//   const restaurants = (await prisma.restaurant.findMany({
//     select: {
//       id: true,
//       name: true,
//       main_image: true,
//       description: true,
//       slug: true,
//       price: true,
//       location: {
//         select: { name: true },
//       },
//       Cuisine: {
//         select: { name: true },
//       },
//     },
//     where: { location: { name: city } },
//   })) as Restaurant[];
//   if (!restaurants) return [];
//   return restaurants;
// };

function buildeWhere(city: string, cuisine: string, price: PRICE) {
  const filters: Object[] = [];

  if (city) {
    filters.push({ location: { name: { equals: city.toLowerCase() } } });
  }
  if (cuisine) {
    filters.push({ Cuisine: { name: { equals: cuisine.toLowerCase() } } });
  }
  if (price) {
    filters.push({ price: { equals: price } });
  }
  return { AND: filters };
}

const dynamicWhere = buildeWhere('ottawa', 'italian', PRICE.REGULAR);
console.log(JSON.stringify(dynamicWhere));

export interface RestaurantWhere {
  id: number;
  name: string;
  main_image: string;
  slug: string;
  price: PRICE;
  location: {
    name: string;
  };
  Cuisine: {
    name: string;
  };
}

const fetchRestaurantsWhere = async (
  city?: string,
  cuisine?: string,
  price?: PRICE,
): Promise<RestaurantWhere[]> => {
  return (await prisma.restaurant.findMany({
    // where: dynamicWhere,
    select: {
      id: true,
      name: true,
      main_image: true,
      slug: true,
      price: true,
      location: {
        select: { name: true },
      },
      Cuisine: {
        select: { name: true },
      },
    },
    where: dynamicWhere,
  })) as RestaurantWhere[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RestaurantWhere[]>,
) {
  // const results = (await fetchRestaurant('vivaan-fine-indian-cuisine-ottawa')) as iRestaurant;
  const results = (await fetchRestaurantsWhere(
    'ottawa',
    'indian',
    PRICE.REGULAR,
  )) as RestaurantWhere[];
  //console.log(results);

  res.send(results);
}
