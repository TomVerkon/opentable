import { Item, PrismaClient } from '@prisma/client';
import { Metadata } from 'next';
import RestaurantNavBar from '../components/RestaurantNavBar';
import Menu from './components/Menu';

const prisma = new PrismaClient();

const fetchItems = async (slug: string): Promise<Item[] | null> => {
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug: slug },
    select: { items: true },
  });

  if (!restaurant) throw new Error('Restaurant not found');
  return restaurant.items;
};

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  return {
    title: `${params.slug} - Menu`,
    description: `${params.slug} Menu page`,
  };
}

async function RestaurantMenuPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const items = await fetchItems(slug);
  if (!items) return <div>Not Found</div>;
  return (
    <div className="flex m-auto w-2/3 justify-between items-start 0 -mt-11">
      <div className="bg-white w-[100%] rounded p-3 shadow">
        <RestaurantNavBar slug={slug} />
        <Menu items={items} />
      </div>
    </div>
  );
}

export default RestaurantMenuPage;
