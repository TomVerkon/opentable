import { Restaurant } from '@/app/search/page';
import prisma from '@/utils/client';
import { PRICE } from '@prisma/client';

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
      reviews: true,
    },
    where: { location: { name: city } },
  })) as Restaurant[];
  if (!restaurants) return [];
  return restaurants;
};
