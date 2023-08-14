import { Restaurant } from '@/app/search/page';
import { PRICE, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const fetchRestaurants = async (
  city: string,
  location: string,
  price: PRICE,
): Promise<Restaurant[]> => {
  const restaurants = (await prisma.restaurant.findMany({
    select: {
      id: true,
      name: true,
      main_image: true,
      description: true,
      slug: true,
      price: true,
      location: {
        select: { name: true },
      },
      Cuisine: {
        select: { name: true },
      },
    },
    where: { location: { name: city } },
  })) as Restaurant[];
  if (!restaurants) return [];
  return restaurants;
};
