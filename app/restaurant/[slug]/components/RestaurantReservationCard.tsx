'use client';
import { partySizes, times } from '@/data';
import useAvailabilities from '@/hooks/useAvailabilities';
import { convertTimeToDisplayTime } from '@/utils/convertTimeToDisplayTime';
import { CircularProgress } from '@mui/material';
import { format } from 'fecha';
import Link from 'next/link';
import { useState } from 'react';
import DatePicker from 'react-datepicker';

interface Times {
  displayTime: string;
  time: string;
  searchTimes: string[];
}
[];

function RestaurantReservationCard({
  openTime,
  closeTime,
  slug,
}: {
  openTime: string;
  closeTime: string;
  slug: string;
}) {
  const { data, error, loading, fetchAvailabilities } = useAvailabilities();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [partySize, setPartySize] = useState(2);
  const [time, setTime] = useState(openTime);
  const [day, setDay] = useState(new Date().toISOString().split('T')[0]);

  const handleChangeDate = (date: Date | null) => {
    if (date) {
      const theDay = date.toISOString().split('T')[0];
      console.log('theDay: ', theDay);
      setDay(theDay);
      console.log('handleChangeDate-day: ', theDay);
      return setSelectedDate(date);
    }
    return setSelectedDate(null);
  };

  const handleClick = async () => {
    const party = partySize.toString();
    console.log('reservationCard: ', slug, party, day, time);
    const availabilities = await fetchAvailabilities({ slug, partySize: party, day, time });
    console.log(data);
  };

  function filterTimesByOpenWindow(): Times[] {
    const timesInWindow: Times[] = [];

    let isWithinWindow = false;

    times.forEach(time => {
      if (time.time === openTime) {
        isWithinWindow = true;
      } else if (time.time === closeTime) {
        isWithinWindow = false;
      }
      if (isWithinWindow) {
        timesInWindow.push(time);
      }
    });
    return timesInWindow;
  }

  return (
    <div className="fixed w-[15%] bg-white rounded p-3 shadow">
      <div className="text-center border-b pb-2 font-bold">
        <h4 className="mr-7 text-lg">Make a Reservation</h4>
      </div>
      <div className="my-3 flex flex-col">
        <label htmlFor="">Party size</label>
        <select
          name="partySize"
          value={partySize}
          className="py-3 border-b font-light"
          id=""
          onChange={e => setPartySize(parseInt(e.target.value))}
        >
          {partySizes.map(size => {
            return (
              <option value={size.value} key={size.value}>
                {size.label}
              </option>
            );
          })}
        </select>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col w-[48%]">
          <label htmlFor="">Date</label>
          <DatePicker
            selected={selectedDate}
            onChange={handleChangeDate}
            minDate={new Date()}
            className="py-3 border-b font-light text-reg w-24"
            dateFormat="MMM d yyyy"
            wrapperClassName="w-[48%]"
          />
        </div>
        <div className="flex flex-col w-[48%]">
          <label htmlFor="">Time</label>
          <select
            name="time"
            id="time"
            onChange={e => setTime(e.target.value)}
            className="py-3 border-b font-light"
            value={time}
          >
            {filterTimesByOpenWindow().map(time => {
              return (
                <option value={time.time} key={time.time}>
                  {time.displayTime}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <div className="mt-5">
        <button
          className="bg-red-600 rounded w-full px-4 text-white font-bold h-16"
          onClick={handleClick}
          disabled={loading}
        >
          {loading ? <CircularProgress color="inherit" /> : 'Find a Time'}
        </button>
      </div>
      {data && data.length > 0 ? (
        <div className="mt-4">
          <p className="text-reg">Select a Time</p>
          <div className="flex flex-wrap mt-2">
            {data.map(time => {
              return time.available ? (
                <Link
                  key={time.time}
                  href={`/reserve/${slug}?date=${format(selectedDate!, 'YYYY-MM-dd')}T${
                    time.time
                  }&partySize=${partySize}`}
                  className="bg-red-600 cursor-pointer p-2 w-24 text-center text-white mb-3 rounded mr-3"
                >
                  {convertTimeToDisplayTime(time.time)}
                </Link>
              ) : (
                <p
                  className="bg-gray-300 p-2 w-24 mb-3 rounded mr-3 text-center text-white font-sm"
                  key={time.time}
                >
                  {convertTimeToDisplayTime(time.time)}
                </p>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default RestaurantReservationCard;
