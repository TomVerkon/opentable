import { Cuisine, Location, PRICE, PrismaClient, Review } from '@prisma/client';
import { Metadata } from 'next';
import MainHeader from './components/MainHeader';
import RestaurantCard from './components/RestaurantCard';

const prisma = new PrismaClient();

export interface RestaurantCardType {
  id: number;
  name: string;
  main_image: string;
  price: PRICE;
  location: Location;
  Cuisine: Cuisine;
  slug: string;
  reviews: Review[];
}

export const metadata: Metadata = {
  title: 'HomePage | OpenTableClone',
  description: 'OpenTable home page',
};

const fetchRestaurants = async (): Promise<RestaurantCardType[]> => {
  const restaurants: RestaurantCardType[] = (await prisma.restaurant.findMany({
    select: {
      id: true,
      name: true,
      main_image: true,
      price: true,
      location: true,
      Cuisine: true,
      slug: true,
      reviews: true,
    },
  })) as RestaurantCardType[];
  return restaurants ? restaurants : [];
};

export default async function HomePage() {
  const restaurants: RestaurantCardType[] = await fetchRestaurants();
  console.log(' home page first retaurant:', restaurants[0]);
  return (
    <main>
      <MainHeader />
      <div className="py-3 px-36 mt-10 flex flex-wrap justify-center">
        {restaurants.map(restaurant => {
          return <RestaurantCard restaurant={restaurant} key={restaurant.id} />;
        })}
      </div>
    </main>
  );
}
