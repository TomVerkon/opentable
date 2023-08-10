import { PrismaClient, Restaurant } from '@prisma/client';
import { Metadata } from 'next';
import RestaurantDescription from './components/RestaurantDescription';
import RestaurantImages from './components/RestaurantImages';
import RestaurantNavBar from './components/RestaurantNavBar';
import RestaurantRating from './components/RestaurantRating';
import RestaurantReservationCard from './components/RestaurantReservationCard';
import RestaurantReviews from './components/RestaurantReviews';
import RestaurantTitle from './components/RestaurantTitle';

const prisma = new PrismaClient();

interface Props {
  params: {
    slug: string;
  };
}

const fetchRestaurant = async (slug: string): Promise<Restaurant | null> => {
  return (await prisma.restaurant.findUnique({
    where: { slug: slug },
  })) as Restaurant;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  return {
    title: `${props.params.slug} - Restaurant | OpenTableClone`,
    description: `${props.params.slug} restaurant page`,
  };
}

async function RestaurantDetailsPage({ params }: Props) {
  const { slug } = params;
  const restaurant = await fetchRestaurant(slug);
  if (!restaurant) return <div>Not Found</div>;
  return (
    <div className="flex m-auto w-2/3 justify-between items-start 0 -mt-11">
      <div className="bg-white w-[73%] rounded p-3 shadow">
        <RestaurantNavBar slug={restaurant.slug} />
        <RestaurantTitle title={restaurant.name} />
        <RestaurantRating />
        <RestaurantDescription description={restaurant.description} />
        <RestaurantImages images={restaurant.images} />
        <RestaurantReviews />
      </div>
      <div className="w-[22%] relative text-reg">
        <RestaurantReservationCard />
      </div>
    </div>
  );
}

export default RestaurantDetailsPage;
