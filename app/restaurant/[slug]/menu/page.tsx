import MainNavBar from '@/app/components/MainNavBar';
import DescriptionCard from './components/DescriptionCard';
import MenuHeader from './components/MenuHeader';

function RestaurantMenuPage() {
  return (
    <main className="bg-gray-100 min-h-screen w-screen">
      <main className="max-w-screen-2xl m-auto bg-white">
        <MainNavBar />
        <MenuHeader />
        <DescriptionCard />
      </main>
    </main>
  );
}

export default RestaurantMenuPage;
