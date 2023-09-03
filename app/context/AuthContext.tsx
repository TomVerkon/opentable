'use client';

import axios from 'axios';
import { getCookie } from 'cookies-next';
import { Dispatch, ReactNode, SetStateAction, createContext, useEffect, useState } from 'react';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
  phone: string;
  email: string;
}

interface State {
  loading: boolean;
  data: User | null;
  error: string | null;
}

interface AuthState extends State {
  setAuthState: Dispatch<SetStateAction<State>>;
}

export const AuthenticationContext = createContext<AuthState>({
  loading: false,
  error: null,
  data: null,
  setAuthState: () => {},
});

export default function AuthContext({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<State>({ data: null, error: null, loading: true });

  const fetchUser = async () => {
    setAuthState({ data: null, error: null, loading: true });

    try {
      const jwt = getCookie('jwt');

      if (!jwt) {
        return setAuthState({ data: null, error: null, loading: false });
      }

      const response = await axios.get('http://localhost:3000/api/auth/me', {
        headers: { Authorization: `Bearer ${jwt}` },
      });

      axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;

      setAuthState({ data: response.data, error: null, loading: false });
    } catch (error: any) {
      setAuthState({
        data: null,
        loading: false,
        error: error.response.data.errorMessage,
      });
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthenticationContext.Provider value={{ ...authState, setAuthState }}>
      {children}
    </AuthenticationContext.Provider>
  );
}
