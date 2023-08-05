import MainNavBar from '@/app/components/MainNavBar';
import RestaurantDescription from './components/RestaurantDescription';
import RestaurantHeader from './components/RestaurantHeader';
import RestaurantImages from './components/RestaurantImages';
import RestaurantNavBar from './components/RestaurantNavBar';
import RestaurantRating from './components/RestaurantRating';
import RestaurantReservationCard from './components/RestaurantReservationCard';
import RestaurantReviews from './components/RestaurantReviews';
import RestaurantTitle from './components/RestaurantTitle';

function RestaurantDetailsPage() {
  return (
    <main className="bg-gray-100 min-h-screen w-screen">
      <main className="max-w-screen-2xl m-auto bg-white">
        <MainNavBar />
        <RestaurantHeader />
        <div className="flex m-auto w-2/3 justify-between items-start 0 -mt-11">
          <div className="bg-white w-[70%] rounded p-3 shadow">
            <RestaurantNavBar />
            <RestaurantTitle />
            <RestaurantRating />
            <RestaurantDescription />
            <RestaurantImages />
            <RestaurantReviews />
          </div>
          <RestaurantReservationCard />
        </div>
      </main>
    </main>
  );
}

export default RestaurantDetailsPage;
