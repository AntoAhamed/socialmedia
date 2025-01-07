import React from 'react'
import { Outlet, Link } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { useMediaQuery } from '@mui/material';

function Navbar() {
  const isSmall = useMediaQuery("(max-width: 360px)");
  const isMedium = useMediaQuery("(max-width: 720px)");

  let size = "large";
  if (isSmall) size = "small";
  else if (isMedium) size = "medium";

  return (
    <>
      <nav className='border-b lg:py-5 py-3'>
        <ul className='grid lg:grid-cols-4 grid-cols-1 gap-4'>
          <li>
            <p className='lg:text-2xl md:text-2xl text-xl font-bold italic text-center'>Outstagram</p>
          </li>
          <div className='flex justify-around lg:col-span-3'>
            <li>
              <Link to="/home">
                <HomeOutlinedIcon fontSize={size} />
              </Link>
            </li>
            <li>
              <Link to="/create-post">
                <AddOutlinedIcon fontSize={size} />
              </Link>
            </li>
            <li>
              <Link to="/search">
                <SearchOutlinedIcon fontSize={size} />
              </Link>
            </li>
            <li>
              <Link to="/notifications">
                <NotificationsOutlinedIcon fontSize={size} />
              </Link>
            </li>
            <li>
              <Link to="/profile">
                <AccountCircleOutlinedIcon fontSize={size} />
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
