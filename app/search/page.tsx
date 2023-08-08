import { Metadata } from 'next';
import RestaurantCard from './components/RestaurantCard';
import SearchHeader from './components/SearchHeader';
import SearchSideBar from './components/SearchSideBar';

export const metadata: Metadata = {
  title: 'SearchPage | OpenTable | Clone',
  description: 'OpenTable search page',
};

function SearchPage() {
  return (
    <>
      <SearchHeader />
      <div className="flex py-4 m-auto w-2/3 justify-between items-start">
        <SearchSideBar />
        <div className="w-5/6">
          <RestaurantCard />
        </div>
      </div>
    </>
  );
}

export default SearchPage;
