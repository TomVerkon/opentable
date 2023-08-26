import Link from 'next/link';
import AuthModal from '../AuthModal';

function MainNavBar() {
  return (
    <nav className="bg-white p-2 flex justify-between">
      <Link href="/" className="font-bold text-gray-700 text-2xl">
        OpenTable
      </Link>
      <div>
        <div className="flex">
          {/* <button className="bg-blue-400 text-white border p-1 px-4 rounded mr-3">Sign in</button> */}
          <AuthModal isSignin={true} />
          {/* <button className="border p-1 px-4 rounded">Sign up</button> */}
          <AuthModal isSignin={false} />
        </div>
      </div>
    </nav>
  );
}

export default MainNavBar;
