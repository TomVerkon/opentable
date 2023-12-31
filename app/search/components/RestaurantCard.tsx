//'use client';
import Price from '@/app/components/Price';
import Stars from '@/app/components/Stars';
import { getReviewRatingsAverage } from '@/utils/getReviewRatingsAverage';
import Link from 'next/link';
import { Restaurant } from '../page';

export default function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const { main_image, name, price, cuisine, location, slug, reviews } = restaurant;
  const average = getReviewRatingsAverage(reviews);
  const ratingAverage =
    average > 4.5 ? 'Awesome' : average > 3.5 ? 'Great' : average > 2.5 ? 'Average' : 'Okay';

  return (
    <div className="border-b flex pb-5">
      <img src={main_image} alt="" className="w-44 h-36 rounded" />
      <div className="pl-5">
        <h2 className="text-3xl capitalize">{name}</h2>
        <div className="flex items-start">
          <div className="flex mb-2">
            <Stars avgRating={average} />
          </div>
          <p className="ml-2 text-reg">{ratingAverage}</p>
        </div>
        <div className="mb-9">
          <div className="font-light flex text-reg">
            <Price price={price} />
            <p className="mr-4 capitalize">{cuisine.name}</p>
            <p className="mr-4 capitalize">{location.name}</p>
          </div>
        </div>
        <div className="text-red-600">
          <Link href={`/restaurant/${slug}`}>View more information</Link>
        </div>
      </div>
    </div>
  );
}
