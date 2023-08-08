import { PrismaClient } from '@prisma/client';
import { Metadata, ResolvingMetadata } from 'next';
import RestaurantDescription from './components/RestaurantDescription';
import RestaurantImages from './components/RestaurantImages';
import RestaurantNavBar from './components/RestaurantNavBar';
import RestaurantRating from './components/RestaurantRating';
import RestaurantReservationCard from './components/RestaurantReservationCard';
import RestaurantReviews from './components/RestaurantReviews';
import RestaurantTitle from './components/RestaurantTitle';

const prisma = new PrismaClient();

export interface RestaurantDetailType {
  id: number;
  name: string;
  images: string[];
  description: string;
  slug: string;
}

interface Props {
  params: {
    slug: string;
  };
}

//let restaurant: RestaurantDetailType;

const fetchRestaurant = async (
  slug: string,
): Promise<RestaurantDetailType | null> => {
  console.log('fetchRestaurant slug:', slug);
  const restaurant = (await prisma.restaurant.findUnique({
    where: { slug: slug },
  })) as RestaurantDetailType;
  console.log(restaurant);
  return restaurant;
  //return null;
};

export async function generateMetadata(
  restaurant: RestaurantDetailType,
  parent?: ResolvingMetadata,
): Promise<Metadata> {
  const name = restaurant.name;
  console.log('name:', name);

  //const restaurant: RestaurantDetailType = await fetchRestaurant(slug);

  return {
    title: `${name} - Page | OpenTableClone`,
    description: `${name} restaurant page`,
  };
}

// export const metadata: Metadata = {
//   title: 'RestaurantPage | OpenTable | Clone',
//   description: 'OpenTable restaurant page',
// };

async function RestaurantDetailsPage({ params }: Props) {
  const { slug } = params;
  console.log('slug:', slug);
  const restaurant: RestaurantDetailType | null = await fetchRestaurant(slug);
  if (!restaurant) return <div>Not FOund</div>;
  generateMetadata(restaurant);
  return (
    <div className="flex m-auto w-2/3 justify-between items-start 0 -mt-11">
      <div className="bg-white w-[70%] rounded p-3 shadow">
        <RestaurantNavBar slug="slug" />
        <RestaurantTitle />
        <RestaurantRating />
        <RestaurantDescription />
        <RestaurantImages />
        <RestaurantReviews />
      </div>
      <div className="w-[27%] relative text-reg">
        <RestaurantReservationCard />
      </div>
    </div>
  );
}

export default RestaurantDetailsPage;
