'use client';
import useAuth from '@/hooks/useAuth';
import { Alert, CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useContext, useEffect, useState } from 'react';
import { AuthenticationContext } from '../context/AuthContext';
import AuthModalInputs from './AuthModalInputs';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

// const initialInputsState = {
//   firstName: '',
//   lastName: '',
//   email: '',
//   phone: '',
//   city: '',
//   password: '',
// };

export default function AuthModal({ isSignin }: { isSignin: boolean }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { signin, signup } = useAuth();
  const { data, error, loading, setAuthState } = useContext(AuthenticationContext);
  console.log('AuthModal:', loading);

  const renderContent = (signinContent: string, signupContent: string): string => {
    return isSignin ? signinContent : signupContent;
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const [inputs, setInputs] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    password: '',
  });

  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (isSignin) {
      if (inputs.email && inputs.password) {
        setDisabled(false);
      }
    } else {
      if (
        inputs.email &&
        inputs.password &&
        inputs.firstName &&
        inputs.lastName &&
        inputs.phone &&
        inputs.city
      ) {
        return setDisabled(false);
      }
      return setDisabled(true);
    }
  }, [inputs]);

  const handleClick = async () => {
    if (isSignin) {
      await signin({ email: inputs.email, password: inputs.password }, handleClose);
    } else {
      await signup(inputs, handleClose);
    }
  };

  return (
    <div>
      <button
        className={`${renderContent('bg-blue-400 text-white ', '')}border p-1 px-4 rounded mr-3`}
        onClick={handleOpen}
      >
        {renderContent('Sign in', 'Sign up')}
      </button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {loading ? (
            <div className="py-24 px-2 h-[400px] flex justify-center">
              <CircularProgress />
            </div>
          ) : (
            <div className="p2 h-[400px]">
              {error && (
                <Alert severity="error" className="mb-4">
                  {error}
                </Alert>
              )}
              <div className="uppercase font-bold text-center pb-2 border-b mb-2">
                <p className="text-sm">{renderContent('Sign In', 'Create Account')}</p>
              </div>
              <div className="m-auto">
                <h2 className="gtex-2xl font-light text-center">
                  {renderContent('Log into your Account', 'Create your OpenTable Account')}
                </h2>
                <AuthModalInputs
                  inputs={inputs}
                  handleChangeInput={handleChangeInput}
                  isSignin={isSignin}
                />
                <button
                  className="uppercase bg-red-600 w-full text-white p-3 rounded text-sm disabled:bg-gray-400"
                  disabled={disabled}
                  onClick={handleClick}
                >
                  {renderContent('Login', 'Create Account')}
                </button>
              </div>
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
}
