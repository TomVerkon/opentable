import { PRICE } from '@prisma/client';
import { Fragment } from 'react';

export default function Price({ price }: { price?: PRICE }) {
  const renderPrice = () => {
    if (price === undefined) {
      return <span className="text-center">All</span>;
    }
    if (price === PRICE.CHEAP) {
      return (
        <Fragment>
          <span>$$</span> <span className="text-gray-300">$$</span>
        </Fragment>
      );
    } else if (price === PRICE.REGULAR) {
      return (
        <Fragment>
          <span>$$$</span> <span className="text-gray-300">$</span>
        </Fragment>
      );
    } else {
      return <span>$$$$</span>;
    }
  };

  return <p className="flex mr-3">{renderPrice()}</p>;
}
