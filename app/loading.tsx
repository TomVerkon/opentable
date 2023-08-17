import MainHeader from './components/MainHeader';

export default function Loading() {
  return (
    <main>
      <MainHeader />
      <div className="py-3 px-36 mt-10 flex flex-wrap justify-center bg-slate-100">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => {
          return (
            <div
              key={num}
              className="animate-pulse bg-slate-400 w-64 h-72 rounded overflow-hidden border cursor-pointer"
            ></div>
          );
        })}
      </div>
    </main>
  );
}
