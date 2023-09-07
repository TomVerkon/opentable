import { Item } from '@prisma/client';
import MenuCard from './MenuCard';

function Menu({ items }: { items: Item[] }) {
  return (
    <main className="bg-white mt-5">
      <div>
        <div className="mt-4 pb-1 mb-1">
          <h1 className="font-bold text-4xl">Menu</h1>
        </div>
        <div className="flex flex-wrap justify-between">
          {items.map(item => {
            return <MenuCard key={item.id} item={item} />;
          })}
        </div>
      </div>
    </main>
  );
}

export default Menu;
