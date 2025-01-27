import React, { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { updatePassword } from '../../features/userSlice';
import Loader from '../layout/Loader';

function UpdatePassword() {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { isLoading, user, error, success, message } = useSelector(state => state.user);

  const [alertMessage, setAlertMessage] = useState('');

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (user?.email === "user@gmail.com") {
      return setAlertMessage("You can't change the guest user password...");
    }

    const passwords = {
      oldPassword,
      newPassword,
      confirmPassword
    }

    dispatch(updatePassword(passwords));

    if (success) {
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      alert("Password updated successfully");
      navigate('/profile');
    } else {
      console.log(error);
    }
  }
  return (
    <>
      {isLoading ? <Loader /> :
        <div className='grid lg:grid-cols-3 md:grid-cols-1 h-screen'>
          <div>
            <div className='bg-blue-500 w-full lg:h-full'></div>
          </div>
          <div className='col-span-2 lg:mx-24 md:mx-16 lg:my-16 md:my-8 my-4'>
            <div className='border-2 flex flex-col lg:p-16 p-4 bg-white'>
              <p className='lg:text-3xl text-2xl font-semibold italic text-center mb-3'>Outstagram</p>
              <p className='font-semibold text-gray-500 text-center mb-3'>
                Change your password very carefully
              </p>
              <form onSubmit={handleSubmit}>
                <div className='grid mb-3'>
                  <TextField type='password' value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} label="Old Password" variant="filled" required />
                </div>
                <div className='grid mb-3'>
                  <TextField type='password' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} label="New Password" variant="filled" required />
                  <p className={`text-sm text-gray-500`}>&#9432; Password should be at least 6 charecter long.</p>
                </div>
                <div className='grid mb-3'>
                  <TextField type='password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} label="Confirm Password" variant="filled" required />
                </div>
                <div className='grid mb-3'>
                  <Button type='submit' variant='contained' disabled={oldPassword === '' || newPassword === '' || confirmPassword === ''}>Update Password Changes</Button>
                </div>
                {alertMessage.length > 0 && <p className='text-red-500 font-semibold'>&#9432; {alertMessage}</p>}
              </form>
            </div>
          </div>
        </div>}
    </>
  )
}

export default UpdatePassword
