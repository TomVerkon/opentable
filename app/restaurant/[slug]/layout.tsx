import RestaurantHeader from './components/RestaurantHeader';

export default async function RestaurantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  return (
    <>
      <RestaurantHeader slug={params.slug} />
      <div className="flex m-auto w-2/3 justify-between items-start 0 -mt-11">{children}</div>
    </>
  );
}
