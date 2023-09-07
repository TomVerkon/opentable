'use client';
import Image from 'next/image';

export default function Stars({ avgRating }: { avgRating: number }) {
  const fullStar = '/icons/full-star-icon.png';
  const halfStar = '/icons/half-star-icon.png';
  const emptyStar = '/icons/empty-star-icon.png';
  const renderStars = () => {
    const stars = [];

    for (let i = 0; i < 5; i++) {
      const difference = avgRating - i;
      if (difference >= 1) stars.push(fullStar);
      else if (difference < 1 && difference > 0) stars.push(halfStar);
      else stars.push(emptyStar);
    }

    return stars.map((star, index) => {
      return <Image key={index} src={star} alt="" width={4} height={4} className="w-4 h-4 mr-1" />;
    });
  };

  return <div className="flex items-center">{renderStars()}</div>;
}
