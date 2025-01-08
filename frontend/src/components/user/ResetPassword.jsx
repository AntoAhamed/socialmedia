import React, { useState } from 'react'
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword } from '../../features/userSlice';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../layout/Loader';

function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const { isLoading, user, error, success, message } = useSelector(state => state.user);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleReset = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return alert('Passwords do not match');
    }

    const passwords = {
      newPassword,
      confirmPassword
    }

    dispatch(resetPassword({token, passwords}));

    if (success) {
      setNewPassword('')
      setConfirmPassword('')
      navigate('/')
    } else {
      console.log(error)
    }
  }
  return (
    <>
      {isLoading ? <Loader /> :
        <div className='grid lg:grid-cols-3 md:grid-cols-1'>
          <div>
            <div className='bg-blue-500 w-full h-full rounded-br-full'></div>
          </div>
          <div className='col-span-2 lg:mx-32 md:mx-16 my-32'>
            <div className='border-2 flex flex-col lg:p-16 p-8 mb-3 bg-white'>
              <p className='lg:text-3xl text-2xl font-semibold italic text-center mb-3'>Outstagram</p>
              <p className='font-semibold text-gray-500 text-center mb-3'>
                Reset password to recover your account
              </p>
              <form onSubmit={handleReset}>
                <div className='grid mb-3'>
                  <TextField type='password' id="filled-basic" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} label="New Password" variant="filled" required />
                </div>
                <div className='grid mb-3'>
                  <TextField type='password' id="filled-basic" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} label="Confirm Password" variant="filled" required />
                </div>
                <div className='grid mb-3'>
                  <Button type='submit' variant='contained'>Reset</Button>
                </div>
              </form>
            </div>
          </div>
        </div>}
    </>
  )
}

export default ResetPassword
