import React from 'react'
import { Outlet, Link } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function Navbar() {
  return (
    <>
      <nav className='border-b py-5'>
        <ul className='grid lg:grid-cols-4 sm:grid-cols-1 gap-4'>
          <li>
            <p className='text-2xl font-bold italic text-center'>Instagram</p>
          </li>
          <div className='flex justify-around col-span-3'>
            <li>
              <Link to="/home">
                <HomeIcon fontSize='large' />
              </Link>
            </li>
            <li>
              <Link to="/create-post">
                <AddIcon fontSize='large' />
              </Link>
            </li>
            <li>
              <Link to="/search">
                <SearchIcon fontSize='large' />
              </Link>
            </li>
            <li>
              <Link to="/profile">
                <AccountCircleIcon fontSize='large' />
              </Link>
            </li>
          </div>

        </ul>
      </nav>

      <div className='lg:px-36 md:px-4 bg-gray-100'>
        <Outlet />
      </div>
    </>
  )
}

export default Navbar
