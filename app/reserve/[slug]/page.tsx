import { Metadata } from 'next';
import ReserveForm from './components/ReserveForm';
import ReserveHeader from './components/ReserveHeader';

export const metadata: Metadata = {
  title: 'ReservePage | OpenTable | Clone',
  description: 'OpenTable reserve page',
};

function ReservationPage() {
  return (
    <div className="border-t h-screen">
      <div className="py-9 w-3/5 m-auto">
        <ReserveHeader />
        <ReserveForm />
      </div>
    </div>
  );
}

export default ReservationPage;
