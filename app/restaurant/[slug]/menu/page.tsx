import { PrismaClient, Restaurant } from '@prisma/client';
import { Metadata } from 'next';
import RestaurantNavBar from '../components/RestaurantNavBar';
import Menu from './components/Menu';

const prisma = new PrismaClient();

interface Props {
  params: {
    slug: string;
  };
}

const fetchRestaurant = async (slug: string): Promise<Restaurant | null> => {
  console.log('fetchRestaurant slug:', slug);
  const restaurant = (await prisma.restaurant.findUnique({
    where: { slug: slug },
  })) as Restaurant;
  console.log(restaurant);
  return restaurant;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = props.params;
  console.log(props);

  //const restaurant: RestaurantDetailType = await fetchRestaurant(slug);

  return {
    title: `${slug} - Menu | OpenTableClone`,
    description: `${slug} restaurant menu page`,
  };
}

async function RestaurantMenuPage({ params }: Props) {
  const { slug } = params;
  const restaurant = await fetchRestaurant(slug);
  if (!restaurant) return <div>Not Found</div>;
  return (
    <div className="flex m-auto w-2/3 justify-between items-start 0 -mt-11">
      <div className="bg-white w-[100%] rounded p-3 shadow">
        <RestaurantNavBar slug={slug} />
        <Menu />
      </div>
    </div>
  );
}

export default RestaurantMenuPage;
