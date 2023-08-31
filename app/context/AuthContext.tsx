'use client';

import { Dispatch, ReactNode, SetStateAction, createContext, useState } from 'react';

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

// const initialState: State = {
//   loading: false,
//   data: null,
//   error: null,
// };

// const initialAuthState = {
//   ...initialState,
//   setAuthState: () => {},
// };

// console.log('AuthContext initialAuthState:', initialAuthState);

// export const AuthenticationContext = createContext<AuthState>(initialAuthState);

export const AuthenticationContext = createContext<AuthState>({
  loading: false,
  error: null,
  data: null,
  setAuthState: () => {},
});

export default function AuthContext({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<State>({ data: null, error: null, loading: false });
  return (
    <AuthenticationContext.Provider value={{ ...authState, setAuthState }}>
      {children}
    </AuthenticationContext.Provider>
  );
}
