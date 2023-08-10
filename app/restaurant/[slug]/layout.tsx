import RestaurantHeader from './components/RestaurantHeader';

// const prisma = new PrismaClient();

// interface iRestaurant {
//   id: number;
//   name: string;
//   main_image: string;
//   images: string[];
//   description: string;
//   open_time: string;
//   close_time: string;
//   slug: string;
//   price: PRICE;
//   location_id: number;
//   cuisine_id: number;
//   created_at: Date;
//   updated_at: Date;
//   location: {
//     name: string;
//   };
//   Cuisine: {
//     name: string;
//   };
// }

// const fetchRestaurant = async (slug: string): Promise<iRestaurant | null> => {
//   return (await prisma.restaurant.findUnique({
//     include: {
//       location: {
//         select: { name: true },
//       },
//       Cuisine: {
//         select: { name: true },
//       },
//     },
//     where: { slug: slug },
//   })) as iRestaurant;
// };

export default async function RestaurantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  console.log('child layout params:', params);
  return (
    <>
      <RestaurantHeader slug={params.slug} />
      <div className="flex m-auto w-2/3 justify-between items-start 0 -mt-11">
        {children}
      </div>
    </>
  );
}
