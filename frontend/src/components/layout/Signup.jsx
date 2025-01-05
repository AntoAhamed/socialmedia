import React, { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { clearErrorAndMessage, signup } from '../../features/userSlice';
import Loader from '../layout/Loader';

function Signup() {
  const dispatch = useDispatch();
  const { isLoading, user, error, success, message, isAuth } = useSelector(state => state.user);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      name,
      email,
      password,
    }

    await dispatch(signup(userData));

    if (isAuth) {
      setName('');
      setEmail('');
      setPassword('');
    }else{
      console.log(error)
    }
  }
  return (
    <div className='grid lg:grid-cols-2 md:grid-cols-1 h-screen'>
      <div>
        <div className='bg-blue-500 w-full h-full rounded-br-full'></div>
      </div>
      {isLoading ? <Loader /> :
        <div className='lg:mx-32 md:mx-16 my-16'>
          <div className='border-2 flex flex-col lg:p-16 p-8 mb-3 bg-white'>
            <p className='text-3xl font-semibold italic text-center mb-3'>Outstagram</p>
            <p className='font-semibold text-gray-500 text-center mb-3'>
              Sign up to see photos and videos from your friend.
            </p>
            <form onSubmit={handleSubmit}>
              <div className='grid mb-3'>
                <TextField type='text' id="filled-basic" value={name} onChange={(e) => setName(e.target.value)} label="Name" variant="filled" required />
              </div>
              <div className='grid mb-3'>
                <TextField type='email' id="filled-basic" value={email} onChange={(e) => setEmail(e.target.value)} label="Email" variant="filled" required />
              </div>
              <div className='grid mb-3'>
                <TextField type='password' id="filled-basic" value={password} onChange={(e) => setPassword(e.target.value)} label="Password" variant="filled" required />
              </div>
              <div className='grid mb-3'>
                <Button type='submit' variant='contained'>Sign up</Button>
              </div>
            </form>
          </div>
          <div className='border-2 p-8 bg-white'>
            <p className='text-center'>Have an account? <Link to='/' className='text-blue-700 font-semibold'>Log in</Link></p>
          </div>
        </div>}
    </div>
  )
}

export default Signup
