import React, { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { deleteMyAccount, loadUser, tempLogout, updateProfile } from '../../features/userSlice';
import Loader from '../layout/Loader';
import userPic from '../../assets/user.png'
import imageCompression from 'browser-image-compression';

function UpdateProfile() {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { isLoading, user, error, success, message } = useSelector(state => state.user);

  const [alertMessageForUpdate, setAlertMessageForUpdate] = useState('');
  const [alertMessageForDelete, setAlertMessageForDelete] = useState('');

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user?.email === "user@gmail.com") {
      return setAlertMessageForUpdate("You can't change the guest user profile...");
    }

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
      navigate('/profile');
    } else {
      console.log(error);
    }
  }

  const handleImageChange = async (e) => {
    try {
      const file = e.target.files[0];
      const options = {
        maxSizeMB: 0.1, // Set max size to 100 KB
        maxWidthOrHeight: 300, // Set max dimensions to 300x300 pixels
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatar(reader.result);
        }
      }

      reader.readAsDataURL(compressedFile);
    } catch (err) {
      console.log(err);
    }
  }

  const handleDeleteAccount = () => {
    if (user?.email === "user@gmail.com") {
      return setAlertMessageForDelete("You can't delete the guest user...");
    }

    if (window.confirm('Are you sure you want to delete your account?')) {
      dispatch(deleteMyAccount());
      if (success) {
        localStorage.removeItem('active');
        localStorage.removeItem('token');
        dispatch(tempLogout());
        navigate('/');
      }
    }
  }
  return (
    <>
      {isLoading ? <Loader /> :
        <div className='grid lg:grid-cols-3 md:grid-cols-1 h-full'>
          <div>
            <div className='bg-blue-500 w-full h-full'></div>
          </div>
          <div className='col-span-2 lg:mx-24 md:mx-16 lg:my-16 md:my-8 my-4'>
            <div className='border-2 flex flex-col lg:p-16 p-4 mb-3 bg-white'>
              <p className='lg:text-3xl text-2xl font-semibold italic text-center mb-3'>Outstagram</p>
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
                  <TextField type='email' id="filled-basic" disabled value={email} onChange={(e) => setEmail(e.target.value)} label="Email" variant="filled" placeholder={user?.email} />
                </div>
                <div className='flex mb-3'>
                  <img src={avatar || userPic} alt='' className='w-14 h-14 rounded-lg' />
                  <input type='file' accept='.png, .jpg, .jpeg' onChange={handleImageChange} className='bg-gray-100 p-3 rounded-t-md border-b-gray-500 border-b w-full ml-2' />
                </div>
                <div className='grid mb-3'>
                  <Button type='submit' variant='contained' disabled={name === '' && bio === '' && email === '' && avatar === ''}>Update Profile Changes</Button>
                </div>
                {alertMessageForUpdate.length > 0 && <p className='text-red-500 font-semibold'>&#9432; {alertMessageForUpdate}</p>}
              </form>
            </div>
            <div className='border-2 lg:p-8 p-4 flex justify-center items-center bg-white mb-3'>
              <p className='text-center mr-3'>Want to change password?</p>
              <Button variant='contained' size='small' onClick={() => navigate('/update-password')}>Change Password</Button>
            </div>
            <div className='border-2 lg:p-8 p-4 flex justify-center items-center bg-white'>
              <div className='mr-3'>
                <p className='text-center mr-3'>Want to delete account?</p>
                <p className='text-red-700'>(Be careful and think again)</p>
                {alertMessageForDelete.length > 0 && <p className='text-red-500 font-semibold'>&#9432; {alertMessageForDelete}</p>}
              </div>
              <Button variant='contained' size='small' color='error' onClick={handleDeleteAccount}>Delete Account</Button>
            </div>
          </div>
        </div>}
    </>
  )
}

export default UpdateProfile
