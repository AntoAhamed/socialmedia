import React, { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '../../features/userSlice';
import userPic from '../../assets/user.png';
import Loader from '../layout/Loader';

function Search() {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { isLoading, user, error, success, message, users } = useSelector(state => state.user);

  const [name, setName] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();

    dispatch(getAllUsers(name));
  }
  return (
    <>
      {isLoading ? <Loader /> :
        <div className='h-svh pt-4'>
          <div className='flex flex-col px-32 py-20 bg-white'>
            <div className='pb-3'>
              <p className='text-3xl font-semibold italic text-center mb-3'>Outstagram</p>
              <p className='font-semibold text-gray-500 text-center mb-3'>
                Search for your friends/loved ones
              </p>
              <form onSubmit={handleSearch}>
                <div className='grid mb-3'>
                  <TextField type='text' id="filled-basic" value={name} onChange={(e) => setName(e.target.value)} label="Username" variant="filled" required />
                </div>
                <div className='grid mb-3'>
                  <Button type='submit' variant='contained'>Search</Button>
                </div>
              </form>
            </div>

            <div className='border-t pt-3'>
              {users && users.map(user => (
                <div key={user._id} className='border-2 p-3 flex items-center'>
                  <img src={user.avatar?.url || userPic} alt='user' className='w-10 h-10 rounded-full' />
                  <div className='flex items-center justify-between w-full ml-3'>
                    <div>
                      <p className='font-semibold'>{user.name}</p>
                      <p className='text-gray-500'>{user.email}</p>
                    </div>
                    <Link to={`/profile/${user._id}`} className='text-blue-500'>View Profile</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>}
    </>

  )
}

export default Search
