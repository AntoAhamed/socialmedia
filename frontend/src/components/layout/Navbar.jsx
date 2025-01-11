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
import { useMediaQuery } from '@mui/material';

function Navbar() {
  const navigate = useNavigate();
  const [activeComponent, setActiveComponent] = useState("home");
  const isSmall = useMediaQuery("(max-width: 360px)");
  const isMedium = useMediaQuery("(max-width: 720px)");

  let size = "large";
  if (isSmall) size = "small";
  else if (isMedium) size = "medium";

  const handleComponent = (active) => {
    setActiveComponent(active)
  }

  /*
  // To store which component is active
  const handleActive = (component) => {
    setActiveComponent(component);
    //localStorage.setItem('active', component)
  }

  useEffect(() => {
    //const active = localStorage.getItem('active')
    let active = "home"

    if (active) {
      setActiveComponent(active)
      navigate(`/${active}`)
    } else {
      //localStorage.setItem('active', "home")
    }
  }, [])*/

  return (
    <>
      <nav className='border-b lg:py-3 py-2'>
        <ul className='grid lg:grid-cols-4 grid-cols-1 gap-4'>
          <li className='p-2 select-none'>
            <p className='lg:text-2xl md:text-2xl text-xl font-bold italic text-center'>Outstagram</p>
          </li>
          <div className='flex justify-around lg:col-span-3'>
            <Link to="/home">
              <li className={`hover:bg-gray-200 rounded-full p-2 ${activeComponent === "home" && 'bg-gray-200'}`} onClick={()=>handleComponent("home")}>
                {activeComponent === "home" ?
                  <HomeIcon fontSize={size} /> :
                  <HomeOutlinedIcon fontSize={size} />}
              </li>
            </Link>
            <Link to="/create-post">
              <li className={`hover:bg-gray-200 rounded-full p-2 ${activeComponent === "create-post" && 'bg-gray-200'}`} onClick={()=>handleComponent("create-post")}>
                {activeComponent === "create-post" ?
                  <AddIcon fontSize={size} /> :
                  <AddOutlinedIcon fontSize={size} />}
              </li>
            </Link>
            <Link to="/search">
              <li className={`hover:bg-gray-200 rounded-full p-2 ${activeComponent === "search" && 'bg-gray-200'}`} onClick={()=>handleComponent("search")}>
                {activeComponent === "search" ?
                  <SearchIcon fontSize={size} /> :
                  <SearchOutlinedIcon fontSize={size} />}
              </li>
            </Link>
            <Link to="/notifications">
              <li className={`hover:bg-gray-200 rounded-full p-2 ${activeComponent === "notifications" && 'bg-gray-200'}`} onClick={()=>handleComponent("notifications")}>
                {activeComponent === "notifications" ?
                  <NotificationsIcon fontSize={size} /> :
                  <NotificationsOutlinedIcon fontSize={size} />}
              </li>
            </Link>
            <Link to="/profile">
              <li className={`hover:bg-gray-200 rounded-full p-2 ${activeComponent === "profile" && 'bg-gray-200'}`} onClick={()=>handleComponent("profile")}>
                {activeComponent === "profile" ?
                  <AccountCircleIcon fontSize={size} /> :
                  <AccountCircleOutlinedIcon fontSize={size} />}
              </li>
            </Link>
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
