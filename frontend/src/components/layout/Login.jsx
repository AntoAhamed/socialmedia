import React, { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { clearErrorAndMessage, login } from '../../features/userSlice';
import Loader from './Loader';

function Login() {
  const dispatch = useDispatch();
  const { isLoading, user, error, success, message, isAuth } = useSelector(state => state.user);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    }

    await dispatch(login(userData));

    if (isAuth ) {
      setEmail('');
      setPassword('');
    }else{
      alert("Something went wrong!")
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
            <p className='lg:text-3xl text-2xl font-semibold italic text-center mb-3'>Outstagram</p>
            <form onSubmit={handleSubmit}>
              <div className='grid mb-3'>
                <TextField type='email' id="filled-basic" value={email} onChange={(e) => setEmail(e.target.value)} label="Email" variant="filled" required />
              </div>
              <div className='grid mb-3'>
                <TextField type='password' id="filled-basic" value={password} onChange={(e) => setPassword(e.target.value)} label="Password" variant="filled" required />
              </div>
              <div className='grid mb-3'>
                <Button type='submit' variant='contained'>Log in</Button>
              </div>
            </form>
            <p className='text-center'>
              <Link to='/forgot-password'>Forgot Password?</Link>
            </p>
          </div>
          <div className='border-2 p-8 bg-white'>
            <p className='text-center'>Don't have an account? <Link to='/signup' className='text-blue-700 font-semibold'>Sign up</Link></p>
          </div>
        </div>}
    </div>
  )
}

export default Login
