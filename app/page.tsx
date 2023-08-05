'use client';

import { Inter } from '@next/font/google';
import MainHeader from './components/MainHeader';
import MainNavBar from './components/MainNavBar';
import RestaurantCard from './components/RestaurantCard';

const inter = Inter({ subsets: ['latin'] });

export default function HomePage() {
  return (
    <main className="bg-gray-100 min-h-screen w-screen">
      <main className="max-w-screen-2xl m-auto bg-white">
        <MainNavBar />
        <main>
          <MainHeader />
          <div className="py-3 px-36 mt-10 flex flex-wrap justify-center">
            <RestaurantCard />
          </div>
        </main>
      </main>
    </main>
  );
}
