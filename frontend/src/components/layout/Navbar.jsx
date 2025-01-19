import React, { act, useEffect, useState } from 'react'
import { Outlet, Link, useNavigate } from "react-router-dom";
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
import PeopleIcon from '@mui/icons-material/People';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import { useMediaQuery } from '@mui/material';
import { useDispatch } from 'react-redux';
import { clearNotifications, clearRequests, loadUser } from '../../features/userSlice';

function Navbar(props) {
  const { user, activeComponent, setActiveComponent, handleComponent } = props
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isSmall = useMediaQuery("(max-width: 360px)");
  const isMedium = useMediaQuery("(max-width: 720px)");

  let size = "large";
  if (isSmall) size = "small";
  else if (isMedium) size = "medium";

  useEffect(() => {
    const active = localStorage.getItem('active')

    if (active) {
      setActiveComponent(active)
      navigate(`/${active}`)
    } else {
      localStorage.setItem('active', "home")
    }
  }, [dispatch])

  return (
    <>
      <nav className='border-b lg:py-3 py-2 sticky top-0 z-10 bg-white'>
        <ul className='grid lg:grid-cols-4 grid-cols-1 lg:gap-4 md:gap-2'>
          <li className='p-2 select-none'>
            <p className='lg:text-2xl md:text-2xl text-xl font-bold italic text-center'>Outstagram</p>
          </li>
          <div className='flex justify-around lg:col-span-3'>
            <Link to="/home">
              <li className={`hover:bg-gray-200 rounded-full p-2 ${activeComponent === "home" && 'bg-gray-200'}`} onClick={() => handleComponent("home")}>
                {activeComponent === "home" ?
                  <HomeIcon fontSize={size} /> :
                  <HomeOutlinedIcon fontSize={size} />}
              </li>
            </Link>
            <Link to="/friend-requests">
              <li className={`hover:bg-gray-200 rounded-full p-2 ${activeComponent === "friend-requests" && 'bg-gray-200'}`} onClick={async () => { handleComponent("friend-requests"); await dispatch(clearRequests()); dispatch(loadUser()); }}>
                {activeComponent === "friend-requests" ?
                  <PeopleIcon fontSize={size} /> :
                  <><PeopleOutlineIcon fontSize={size} />{<sup className='lg:text-lg font-semibold text-blue-700'>{user.newRequests > 0 && user.newRequests}</sup>}</>}
              </li>
            </Link>
            <Link to="/search">
              <li className={`hover:bg-gray-200 rounded-full p-2 ${activeComponent === "search" && 'bg-gray-200'}`} onClick={() => handleComponent("search")}>
                {activeComponent === "search" ?
                  <SearchIcon fontSize={size} /> :
                  <SearchOutlinedIcon fontSize={size} />}
              </li>
            </Link>
            <Link to="/notifications">
              <li className={`hover:bg-gray-200 rounded-full p-2 ${activeComponent === "notifications" && 'bg-gray-200'}`} onClick={async () => { handleComponent("notifications"); await dispatch(clearNotifications()); dispatch(loadUser()); }}>
                {activeComponent === "notifications" ?
                  <NotificationsIcon fontSize={size} /> :
                  <><NotificationsOutlinedIcon fontSize={size} />{<sup className='lg:text-lg font-semibold text-blue-700'>{user.newNotifications > 0 && user.newNotifications}</sup>}</>}
              </li>
            </Link>
            <Link to="/profile">
              <li className={`hover:bg-gray-200 rounded-full p-2 ${activeComponent === "profile" && 'bg-gray-200'}`} onClick={() => handleComponent("profile")}>
                {activeComponent === "profile" ?
                  <AccountCircleIcon fontSize={size} /> :
                  <AccountCircleOutlinedIcon fontSize={size} />}
              </li>
            </Link>
          </div>
        </ul>
      </nav>

      <div className="relative h-screen">
        {/* Image as Background */}
        <div className="absolute inset-0">
          <img
            src={user?.avatar?.url}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        {/* Outlet Content */}
        <div className="relative lg:px-36 md:px-4 bg-gray-100 bg-opacity-80 h-full overflow-y-auto">
          <Outlet />
        </div>
      </div>

    </>
  )
}

export default Navbar
