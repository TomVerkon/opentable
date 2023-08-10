import { PRICE, PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

interface iRestaurant {
  id: number;
  name: string;
  main_image: string;
  images: string[];
  description: string;
  open_time: string;
  close_time: string;
  slug: string;
  price: PRICE;
  location_id: number;
  cuisine_id: number;
  created_at: Date;
  updated_at: Date;
  location: {
    name: string;
  };
  Cuisine: {
    name: string;
  };
}

const fetchRestaurant = async (slug: string): Promise<iRestaurant | null> => {
  return (await prisma.restaurant.findUnique({
    include: {
      location: {
        select: { name: true },
      },
      Cuisine: {
        select: { name: true },
      },
    },
    where: { slug: slug },
  })) as iRestaurant;
};

type Data = {
  results: iRestaurant;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<iRestaurant>,
) {
  const results = (await fetchRestaurant(
    'vivaan-fine-indian-cuisine-ottawa',
  )) as iRestaurant;
  res.send(results);
}
