import { Review } from '@prisma/client';

export function getReviewRatingsAverage(reviews: Review[]): number {
  var sum: number = 0.0;
  if (reviews.length < 1) return 0;
  for (var i = 0; i < reviews.length; i++) {
    sum += reviews[i].rating;
  }
  return parseFloat((sum / i).toFixed(1));
}
