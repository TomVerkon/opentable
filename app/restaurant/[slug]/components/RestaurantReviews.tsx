import RestaurantReviewCard from './RestaurantReviewCard';

function RestaurantReviews() {
  return (
    <div>
      <h1 className="font-bold text-3xl mt-10 mb-7 borber-b pb-5">
        What 100 people are saying
      </h1>
      <div>
        <RestaurantReviewCard />
      </div>
    </div>
  );
}

export default RestaurantReviews;
