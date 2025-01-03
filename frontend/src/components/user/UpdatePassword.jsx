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

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

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
        <div className='grid lg:grid-cols-3 md:grid-cols-1'>
          <div>
            <div className='bg-blue-500 w-full min-h-full rounded-tl-full rounded-br-full'></div>
          </div>
          <div className='col-span-2 lg:mx-24 md:mx-16 my-16'>
            <div className='border-2 flex flex-col p-16 mb-3 bg-white'>
              <p className='text-3xl font-semibold italic text-center mb-3'>Outstagram</p>
              <p className='font-semibold text-gray-500 text-center mb-3'>
                Change your password very carefully
              </p>
              <form onSubmit={handleSubmit}>
                <div className='grid mb-3'>
                  <TextField type='password' id="filled-basic" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} label="Old Password" variant="filled" required />
                </div>
                <div className='grid mb-3'>
                  <TextField type='password' id="filled-basic" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} label="New Password" variant="filled" required />
                </div>
                <div className='grid mb-3'>
                  <TextField type='password' id="filled-basic" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} label="Confirm Password" variant="filled" required />
                </div>
                <div className='grid mb-3'>
                  <Button type='submit' variant='contained'>Update Password Changes</Button>
                </div>
              </form>
            </div>
          </div>
        </div>}
    </>
  )
}

export default UpdatePassword
