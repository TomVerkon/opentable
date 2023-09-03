import { PRICE, PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

function buildWhere(city: string, cuisine: string, price: PRICE) {
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

const dynamicWhere = buildWhere('ottawa', 'italian', PRICE.REGULAR);

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

  res.send(results);
}
