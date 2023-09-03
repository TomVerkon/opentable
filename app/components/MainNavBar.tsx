'use client';
import useAuth from '@/hooks/useAuth';
import Link from 'next/link';
import { useContext } from 'react';
import { AuthenticationContext } from '../context/AuthContext';
import AuthModal from './AuthModal';

function MainNavBar() {
  const { data, loading } = useContext(AuthenticationContext);
  const { signout } = useAuth();

  return (
    <nav className="bg-white p-2 flex justify-between">
      <Link href="/" className="font-bold text-gray-700 text-2xl">
        OpenTable
      </Link>

      {loading ? null : (
        <div>
          <div className="flex">
            {data ? (
              <button
                className="bg-blue-400 text-white border p-1 px-4 rounded mr-3"
                onClick={signout}
              >
                Signout
              </button>
            ) : (
              <>
                <AuthModal isSignin={true} />
                <AuthModal isSignin={false} />
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default MainNavBar;
