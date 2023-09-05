import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import 'react-datepicker/dist/react-datepicker.css';
import MainNavBar from './components/MainNavBar';
import AuthContext from './context/AuthContext';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MyOpentable',
  description: 'MyOpentable Application',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="bg-gray-100 min-h-screen w-screen">
          <AuthContext>
            <main className="max-w-screen-2xl m-auto bg-white">
              <MainNavBar />
              {children}
            </main>
          </AuthContext>
        </main>
      </body>
    </html>
  );
}
