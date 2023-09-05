import prisma from '@/utils/client';
import { getReviewRatingsAverage } from '@/utils/getReviewRatingsAverage';
import { Cuisine, Location, PRICE, Review } from '@prisma/client';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import RestaurantDescription from './components/RestaurantDescription';
import RestaurantImages from './components/RestaurantImages';
import RestaurantNavBar from './components/RestaurantNavBar';
import RestaurantRating from './components/RestaurantRating';
import RestaurantReservationCard from './components/RestaurantReservationCard';
import RestaurantReviews from './components/RestaurantReviews';
import RestaurantTitle from './components/RestaurantTitle';

interface Props {
  params: {
    slug: string;
  };
}

export interface RestaurantDetailCardType {
  id: number;
  name: string;
  main_image: string;
  price: PRICE;
  location: Location;
  description: string;
  cuisine: Cuisine;
  slug: string;
  reviews: Review[];
  images: string[];
  open_time: string;
  close_time: string;
}

const fetchRestaurant = async (slug: string): Promise<RestaurantDetailCardType | null> => {
  return (await prisma.restaurant.findUnique({
    select: {
      id: true,
      name: true,
      main_image: true,
      price: true,
      location: true,
      description: true,
      cuisine: true,
      slug: true,
      reviews: true,
      images: true,
      open_time: true,
      close_time: true,
    },
    where: { slug: slug },
  })) as RestaurantDetailCardType;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  return {
    title: `${props.params.slug} - Restaurant`,
    description: `${props.params.slug} restaurant page`,
  };
}

async function RestaurantDetailsPage({ params }: Props) {
  const { slug } = params;
  const restaurant = await fetchRestaurant(slug);
  if (!restaurant) notFound();
  let avgRating = getReviewRatingsAverage(restaurant.reviews);

  return (
    <div className="flex m-auto w-2/3 justify-between items-start 0 -mt-11">
      <div className="bg-white w-[73%] rounded p-3 shadow">
        <RestaurantNavBar slug={restaurant.slug} />
        <RestaurantTitle title={restaurant.name} />
        <RestaurantRating avgRating={avgRating} reviewCount={restaurant.reviews.length} />
        <RestaurantDescription description={restaurant.description} />
        <RestaurantImages images={restaurant.images} />
        <RestaurantReviews reviews={restaurant.reviews} />
      </div>
      <div className="w-[22%] relative text-reg">
        <RestaurantReservationCard
          openTime={restaurant.open_time}
          closeTime={restaurant.close_time}
        />
      </div>
    </div>
  );
}

export default RestaurantDetailsPage;
