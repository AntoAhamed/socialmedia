import React, { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { deleteMyAccount, loadUser, tempLogout, updateProfile } from '../../features/userSlice';
import Loader from '../layout/Loader';

function UpdateProfile() {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { isLoading, user, error, success, message } = useSelector(state => state.user);

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      name,
      bio,
      email,
      avatar
    }

    await dispatch(updateProfile(userData));

    await dispatch(loadUser());

    if (success) {
      setName('');
      setBio('');
      setEmail('');
      setAvatar('');
      alert("Profile updated successfully");
      navigate('/profile');
    } else {
      console.log(error);
    }
  }

  const handleImageChange = (e) => {
    try {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatar(reader.result);
        }
      }

      reader.readAsDataURL(e.target.files[0]);
    } catch (err) {
      console.log(err);
    }
  }

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account?')) {
      dispatch(deleteMyAccount());
      if (success) {
        alert("Account deleted successfully");
        localStorage.removeItem('token');
        dispatch(tempLogout());
        navigate('/');
      }
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
                Edit your profile
              </p>
              <form onSubmit={handleSubmit}>
                <div className='grid mb-3'>
                  <TextField type='text' id="filled-basic" value={name} onChange={(e) => setName(e.target.value)} label="Name" variant="filled" placeholder={user?.name} />
                </div>
                <div className='grid mb-3'>
                  <TextField type='text' id="filled-basic" value={bio} onChange={(e) => setBio(e.target.value)} label="Bio" variant="filled" multiline rows={3} placeholder={user?.bio} />
                </div>
                <div className='grid mb-3'>
                  <TextField type='email' id="filled-basic" value={email} onChange={(e) => setEmail(e.target.value)} label="Email" variant="filled" placeholder={user?.email} />
                </div>
                <div className='grid mb-3'>
                  <input type='file' accept='.png, .jpg, .jpeg' onChange={handleImageChange} className='bg-gray-100 p-3 rounded-t-md border-b-gray-500 border-b' />
                </div>
                <div className='grid mb-3'>
                  <Button type='submit' variant='contained'>Update Profile Changes</Button>
                </div>
              </form>
            </div>
            <div className='border-2 p-8 flex justify-center items-center bg-white mb-3'>
              <p className='text-center mr-3'>Want to change password?</p>
              <Button variant='contained' size='small' onClick={() => navigate('/update-password')}>Change Password</Button>
            </div>
            <div className='border-2 p-8 flex justify-center items-center bg-white'>
              <div className='mr-3'>
                <p className='text-center mr-3'>Want to delete account?</p>
                <p className='text-red-700'>(Be careful and think again)</p>
              </div>
              <Button variant='contained' size='small' color='error' onClick={handleDeleteAccount}>Delete Account</Button>
            </div>
          </div>
        </div>}
    </>
  )
}

export default UpdateProfile
