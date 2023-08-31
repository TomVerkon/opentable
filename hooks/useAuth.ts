import { AuthenticationContext } from '@/app/context/AuthContext';
import axios from 'axios';
import { useContext } from 'react';

const useAuth = () => {
  const { setAuthState } = useContext(AuthenticationContext);

  const signin = async (
    {
      email,
      password,
    }: {
      email: string;
      password: string;
    },
    handleClose: () => void,
  ) => {
    // console.log('useAuth0:', authState);
    setAuthState({ data: null, error: null, loading: true });
    try {
      const response = await axios.post('http://localhost:3000/api/auth/signin', {
        email,
        password,
      });
      setAuthState({ error: null, loading: false, data: response.data });

      handleClose();
    } catch (error: any) {
      // console.log('useAuth signin failed');
      setAuthState({
        data: null,
        loading: false,
        error: error.response.data.errorMessage,
      });
    }
  };
  const signup = async (
    {
      email,
      password,
      firstName,
      lastName,
      city,
      phone,
    }: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      city: string;
      phone: string;
    },
    handleClose: () => void,
  ) => {
    setAuthState({ data: null, error: null, loading: true });
  };

  return {
    signin,
    signup,
  };
};

export default useAuth;
