function RestaurantImages({ images }: { images: string[] }) {
  return (
    <div>
      <h1 className="font-bold text-3xl mt-10 mb-7 border-b pb-4 text-center">
        {images.length} photos
      </h1>
      <div className="flex flex-wrap">
        {images.map((image, index) => {
          return <img className="w-56 h-44 m-1" src={image} alt="" key={index} />;
        })}
      </div>
    </div>
  );
}

export default RestaurantImages;
