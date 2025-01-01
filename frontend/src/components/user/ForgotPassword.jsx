import React, { useState } from 'react'
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword } from '../../features/userSlice';
import Loader from '../layout/Loader';

function ForgotPassword() {
  const dispatch = useDispatch();
  const { isLoading, user, error, success, message } = useSelector(state => state.user);

  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(forgotPassword(email));

    if (success) {
      setEmail('');
      alert(message);
    } else {
      console.log(error);
    }
  }
  return (
    <>
      {isLoading ? <Loader /> :
        <div className='grid lg:grid-cols-3 md:grid-cols-1'>
          <div>
            <div className='bg-blue-500 w-full min-h-screen rounded-tl-full rounded-br-full'></div>
          </div>
          <div className='col-span-2 lg:mx-32 md:mx-16 my-32'>
            <div className='border-2 flex flex-col p-16 mb-3 bg-white'>
              <p className='text-3xl font-semibold italic text-center mb-3'>Instagram</p>
              <p className='font-semibold text-gray-500 text-center mb-3'>
                Recover your account
              </p>
              <form onSubmit={handleSubmit}>
                <div className='grid mb-3'>
                  <TextField type='email' id="filled-basic" value={email} onChange={(e) => setEmail(e.target.value)} label="Email" variant="filled" required />
                </div>
                <div className='grid mb-3'>
                  <Button type='submit' variant='contained'>Continue</Button>
                </div>
              </form>
            </div>
          </div>
        </div>}
    </>
  )
}

export default ForgotPassword
