import { PRICE } from '@prisma/client';
import Link from 'next/link';
import { SearchParams } from '../page';

function SearchSideBar({
  searchParams,
  cuisines,
  locations,
}: {
  searchParams: SearchParams;
  cuisines: { id: number; name: string }[];
  locations: { id: number; name: string }[];
}) {
  console.log('SearchSideBar searchParams:', searchParams);
  const { city, cuisine, price } = searchParams;
  const priceClassName = 'border w-1/4 text-reg text-center p-2 rounded ';
  const prices = [
    { itorPrice: undefined, label: 'All', className: priceClassName },
    { itorPrice: PRICE.CHEAP, label: '$$', className: priceClassName },
    { itorPrice: PRICE.REGULAR, label: '$$$', className: priceClassName },
    { itorPrice: PRICE.EXPENSIVE, label: '$$$$', className: priceClassName },
  ];

  const setTextClass = (itorValue: string | undefined, searchValue: string | undefined) => {
    if (itorValue === searchValue) {
      return 'font-bold';
    } else {
      return 'font-light';
    }
  };

  return (
    <div className="w-1/3">
      <div className="border-b pb-4 flex flex-col">
        <h1 className="mb-2">Region</h1>
        <Link
          href={{ pathname: '/search', query: { cuisine, price, city: undefined } }}
          key="0"
          className={`text-reg capitalize ${setTextClass(undefined, city)}`}
        >
          All Regions
        </Link>
        {locations.map(itorLocation => {
          const queryCity = itorLocation.name;
          return (
            <Link
              href={{ pathname: '/search', query: { cuisine, price, city: queryCity } }}
              key={itorLocation.id}
              id={itorLocation.name}
              className={`text-reg capitalize ${setTextClass(itorLocation.name, city)}`}
            >
              {itorLocation.name}
            </Link>
          );
        })}
      </div>
      <div className="border-b pb-4 mt-3 flex flex-col">
        <h1 className="mb-2">Cuisine</h1>
        <Link
          href={{ pathname: '/search', query: { cuisine: undefined, price, city } }}
          className={`text-reg capitalize ${setTextClass(undefined, cuisine)}`}
        >
          All Cuisines
        </Link>
        {cuisines.map(itorCuisine => {
          const queryCuisine = itorCuisine.name;
          return (
            <Link
              href={{ pathname: '/search', query: { cuisine: queryCuisine, price, city } }}
              key={itorCuisine.id}
              className={`text-reg capitalize ${setTextClass(itorCuisine.name, cuisine)}`}
            >
              {itorCuisine.name}
            </Link>
          );
        })}
      </div>
      <div className="mt-3 pb-4">
        <h1 className="mb-2">Price</h1>
        <div className="flex">
          {prices.map(({ itorPrice, label, className }) => {
            const fontType = setTextClass(itorPrice, price);
            className += className + fontType;
            return (
              <Link
                href={{ pathname: '/search', query: { cuisine, price: itorPrice, city } }}
                className={className}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SearchSideBar;
