import React, { useState } from 'react'
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword } from '../../features/userSlice';
import Loader from '../layout/Loader';

function ForgotPassword() {
  const dispatch = useDispatch();
  const { isLoading, user, error, success, message } = useSelector(state => state.user);

  const [alertMessage, setAlertMessage] = useState('');

  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email === "user@gmail.com") {
      return setAlertMessage("You can't reset the guest user password...");
    }

    await dispatch(forgotPassword(email));

    alert(`Check ${email} email for account recovery link.`)

    setEmail('');
  }
  return (
    <>
      {isLoading ? <Loader /> :
        <div className='grid lg:grid-cols-3 md:grid-cols-1'>
          <div>
            <div className='bg-blue-500 w-full h-full rounded-br-full'></div>
          </div>
          <div className='col-span-2 lg:mx-32 md:mx-16 my-48'>
            <div className='border-2 flex flex-col lg:p-16 p-8 mb-3 bg-white'>
              <p className='lg:text-3xl text-2xl font-semibold italic text-center mb-3'>Outstagram</p>
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
                {alertMessage.length > 0 && <p className='text-red-500 font-semibold'>&#9432; {alertMessage}</p>}
              </form>
            </div>
          </div>
        </div>}
    </>
  )
}

export default ForgotPassword
