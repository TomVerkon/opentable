import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import MainNavBar from './components/MainNavBar';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Opentable | Clone',
  description: 'Opentable Clone Application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="bg-gray-100 min-h-screen w-screen">
          <main className="max-w-screen-2xl m-auto bg-white">
            <MainNavBar />
            {children}
          </main>
        </main>
      </body>
    </html>
  );
}
