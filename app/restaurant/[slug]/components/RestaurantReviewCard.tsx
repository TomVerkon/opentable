import Stars from '@/app/components/Stars';
import { Review } from '@prisma/client';

interface Props {
  review: Review;
}

function RestaurantReviewCard({ review }: Props) {
  const initials = review.first_name.charAt(0) + ' ' + review.last_name.charAt(0);
  const fullName = review.first_name + ' ' + review.last_name;
  return (
    <div className="border-b pb-7 mb-7">
      <div className="flex">
        <div className="w-1/6 flex flex-col items-center">
          <div className="rounded-full bg-blue-400 w-16 h-16 flex items-center justify-center">
            <h2 className="text-white text-2xl">{initials}</h2>
          </div>
          <p className="text-center">{fullName}</p>
        </div>
        <div className="ml-10 w-5/6">
          <div className="flex items-center">
            <div className="flex mr-5">
              <Stars avgRating={review.rating} />
            </div>
          </div>
          <div className="mt-5">
            <p className="text-lg font-light">{review.text}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RestaurantReviewCard;
