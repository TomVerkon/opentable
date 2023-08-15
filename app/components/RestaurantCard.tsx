import { getReviewRatingsAverage } from '@/utils/getReviewRatingsAverage';
import Link from 'next/link';
import { RestaurantCardType } from '../page';
import Price from './Price';
import Stars from './Stars';

interface Props {
  restaurant: RestaurantCardType;
}

function RestaurantCard(props: Props) {
  const { restaurant } = props;
  const reviewCount = restaurant.reviews.length;
  const avgRating = getReviewRatingsAverage(restaurant.reviews);
  return (
    <div className="w-64 h-72 m-3 rounded overflow-hidden border cursor-pointer">
      <Link href={`/restaurant/${restaurant.slug}`}>
        <img src={restaurant.main_image} alt={restaurant.name} className="w-full h-36" />
        <div className="p-1">
          <h3 className="font-bold text-2xl mb-2">{restaurant.name}</h3>
          <div className="flex items-start">
            <div className="flex mb-1.5">
              <Stars avgRating={avgRating} />
              <p className="ml-2">
                {reviewCount === 0 ? 'No' : reviewCount} review{reviewCount === 1 ? '' : 's'}
              </p>
            </div>
          </div>
          <div className="flex text-reg font-light capitalize">
            <p className=" mr-3">{restaurant.Cuisine.name}</p>
            <Price price={restaurant.price} />
            <p>{restaurant.location.name}</p>
          </div>
          <p className="text-sm mt-1 font-bold">Booked 3 times today</p>
        </div>
      </Link>
    </div>
  );
}

export default RestaurantCard;
