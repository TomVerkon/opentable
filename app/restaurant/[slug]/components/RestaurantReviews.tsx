import { Review } from '@prisma/client';
import RestaurantReviewCard from './RestaurantReviewCard';

function RestaurantReviews({ reviews }: { reviews: Review[] }) {
  let headerText = 'Be the first to review this resaturant';

  if (reviews.length > 0) {
    let peopleText = 'person is';
    if (reviews.length > 1) peopleText = 'people are';
    headerText = `What ${reviews.length} ${peopleText} saying`;
  }
  return (
    <div>
      <h1 className="font-bold text-3xl mt-10 mb-7 borber-b pb-5">{headerText}</h1>
      <div>
        {reviews.map(review => (
          <RestaurantReviewCard review={review} key={review.id} />
        ))}
      </div>
    </div>
  );
}

export default RestaurantReviews;
