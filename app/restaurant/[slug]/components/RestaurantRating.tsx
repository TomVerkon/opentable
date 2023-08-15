import Stars from '@/app/components/Stars';

function RestaurantRating({ avgRating, reviewCount }: { avgRating: number; reviewCount: number }) {
  //let avgRatingTxt = Number.isNaN(avgRating) ? 'None' : avgRating.toString();
  return (
    <div className="flex items-end">
      <div className="ratings mt-2 flex items-center">
        <p>
          <Stars avgRating={avgRating} />
        </p>
        <p className="text-reg ml-3">{avgRating === 0 ? 'No ratings' : avgRating}</p>
      </div>
      <div>
        <p className="text-reg ml-4">{reviewCount === 0 ? 'No' : reviewCount} Reviews</p>
      </div>
    </div>
  );
}

export default RestaurantRating;
