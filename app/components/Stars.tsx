//'use client';
import Image from 'next/image';
import emptyStar from '../../public/icons/empty-star.png';
import fullStar from '../../public/icons/full-star.png';
import halfStar from '../../public/icons/half-star.png';

export default function Stars({ avgRating }: { avgRating: number }) {
  const renderStars = () => {
    const stars = [];

    for (let i = 0; i < 5; i++) {
      const difference = avgRating - i;
      if (difference >= 1) stars.push(fullStar);
      else if (difference < 1 && difference > 0) stars.push(halfStar);
      else stars.push(emptyStar);
    }

    return stars.map((star, index) => {
      return <Image key={index} src={star} alt="" className="w-4 h-4 mr-1" />;
    });
  };

  return <div className="flex items-center">{renderStars()}</div>;
}
