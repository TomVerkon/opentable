import RestaurantNavBar from '../../components/RestaurantNavBar';
import Menu from './Menu';

function DescriptionCard() {
  return (
    <div className="flex m-auto w-2/3 justify-between items-start 0 -mt-11">
      <div className="bg-white w-[100%] rounded p-3 shadow">
        <RestaurantNavBar />
        <Menu />
      </div>
    </div>
  );
}

export default DescriptionCard;
