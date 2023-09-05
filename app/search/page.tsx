import prisma from '@/utils/client';
import { PRICE, Review } from '@prisma/client';
import { Metadata } from 'next';
import RestaurantCard from './components/RestaurantCard';
import SearchHeader from './components/SearchHeader';
import SearchSideBar from './components/SearchSideBar';

export const metadata: Metadata = {
  title: 'SearchPage | OpenTable | Clone',
  description: 'OpenTable search page',
};

export interface SearchParams {
  city?: string | undefined;
  cuisine?: string | undefined;
  price?: PRICE | undefined;
}

export interface Props {
  params: {};
  searchParams: SearchParams;
}

export interface Restaurant {
  id: number;
  name: string;
  main_image: string;
  slug: string;
  price: PRICE;
  location: {
    name: string;
  };
  cuisine: {
    name: string;
  };
  reviews: Review[];
}

function buildWhere(
  city: string | undefined,
  cuisine: string | undefined,
  price: PRICE | undefined,
) {
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

const fetchRestaurants = async (
  city: string | undefined,
  cuisine: string | undefined,
  price: PRICE | undefined,
): Promise<Restaurant[]> => {
  const dynamicWhere = buildWhere(city, cuisine, price);
  return (await prisma.restaurant.findMany({
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
      reviews: true,
    },
    where: dynamicWhere,
  })) as Restaurant[];
};

const fetchLocations = async () => {
  return await prisma.location.findMany({
    select: { id: true, name: true },
  });
};

const fetchCuisines = async () => {
  return await prisma.cuisine.findMany({
    select: { id: true, name: true },
  });
};

async function SearchPage(props: Props) {
  const { city, cuisine, price } = props.searchParams;
  const restaurants = await fetchRestaurants(city, cuisine, price);
  const locations = await fetchLocations();
  const cuisines = await fetchCuisines();
  return (
    <>
      <SearchHeader />
      <div className="flex py-4 m-auto w-2/3 justify-between items-start">
        <SearchSideBar
          searchParams={props.searchParams}
          cuisines={cuisines}
          locations={locations}
        />
        <div className="w-5/6 ml-4">
          {restaurants.length > 0 ? (
            restaurants.map(restaurant => {
              return <RestaurantCard key={restaurant.id} restaurant={restaurant} />;
            })
          ) : (
            <p>No restaurants found for {props.searchParams.city}</p>
          )}
        </div>
      </div>
    </>
  );
}

export default SearchPage;
