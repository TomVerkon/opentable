'use client';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { ChangeEvent, useEffect, useState } from 'react';
import AuthModalInputs from './components/AuthModalInputs';

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

export default function AuthModal({ isSignin }: { isSignin: boolean }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [disabled, setDisabled] = useState(true);
  const [inputs, setInputs] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    password: '',
  });

  const renderContent = (signinContent: string, signupContent: string): string => {
    return isSignin ? signinContent : signupContent;
  };

  useEffect(() => {
    const { firstName, lastName, email, phone, city, password } = inputs;
    if (isSignin) {
      if (email && password) setDisabled(false);
      else setDisabled(true);
    } else {
      if (email && password && firstName && lastName && phone && city) setDisabled(false);
      else setDisabled(true);
    }
  }, [inputs]);

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>): void => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
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
          <div className="p2 h-[400px]">
            <div className="uppercase font-bold text-center pb-2 border-b mb-2">
              <p className="text-sm">{renderContent('Sign In', 'Create Account')}</p>
              {/* <div className="m-auto bg-blue-400">dssa</div> */}
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
              >
                {renderContent('Login', 'Create Account')}
              </button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
