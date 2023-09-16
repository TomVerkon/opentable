'use client';
import axios from 'axios';
import { useState } from 'react';

export default function useAvailabilities() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState<{ time: string; available: boolean }[] | null>(null);

  const fetchAvailabilities = async ({
    slug,
    partySize,
    day,
    time,
  }: {
    slug: string;
    partySize: string;
    day: string;
    time: string;
  }) => {
    // console.log('useAvailability: ', slug, partySize, day, time);
    setLoading(true);
    const URL = `http://localhost:3000/api/restaurant/${slug}/availability`;
    // console.log(URL);
    const params = { params: { day, time, partySize } };
    // console.log(params);
    try {
      const response = await axios.get(URL, params);
      setLoading(false);
      setData(response.data);
    } catch (error: any) {
      setLoading(false);
      setError(error.response.data.errorMessage);
    }
  };
  return { loading, data, error, fetchAvailabilities };
}
