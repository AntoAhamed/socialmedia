import React, { useEffect, useState } from 'react'
import userPic from '../../assets/user.png'
import { Button, IconButton, Typography, useMediaQuery } from '@mui/material'
import MyPosts from './MyPosts'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getMyPosts, getUserProfile, loadUser, profileLock, tempLogout } from '../../features/userSlice'
import Loader from '../layout/Loader'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import LockResetIcon from '@mui/icons-material/LockReset';
import Switch from '@mui/material/Switch';

function Profile() {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { isLoading, user, error, success, message, posts } = useSelector(state => state.user);

  const isSmall = useMediaQuery("(max-width: 500px)");
  const isMedium = useMediaQuery("(max-width: 755px)");

  let size = 750;
  if (isSmall) size = 360;
  else if (isMedium) size = 500;

  //Modal style
  const style = {
    position: 'absolute',
    top: '0%', // Fixed top gap
    left: '50%', // Center horizontally
    transform: 'translateX(-50%)', // Adjust only horizontally
    width: size,
    maxHeight: '85vh', // Optional: Limit modal height to prevent overflow
    overflowY: 'auto', // Enable scrolling for overflow content
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 24,
    p: 4,
  };

  //Modal state for followers
  const [openFollowers, setOpenFollowers] = React.useState(false);
  const handleFollowersModalOpen = () => setOpenFollowers(true);
  const handleFollowersModalClose = () => setOpenFollowers(false);

  //Modal state for following
  const [openFollowing, setOpenFollowing] = React.useState(false);
  const handleFollowingModalOpen = () => setOpenFollowing(true);
  const handleFollowingModalClose = () => setOpenFollowing(false);

  //Settting the anchor element for the menu
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  //States for profile lock
  const [openLockModal, setOpenLockModal] = React.useState(false);
  const handleLockModalOpen = () => setOpenLockModal(true);
  const handleLockModalClose = () => setOpenLockModal(false);

  const [isChecked, setIsChecked] = useState(user.profileLock);

  const handleSwitchChange = (event) => {
    setIsChecked(event.target.checked); // Update the state with the new value
  };

  const handleProfileLock = async () => {
    await dispatch(profileLock(isChecked))
    dispatch(loadUser())
  }

  const handleLogout = () => {
    localStorage.removeItem('active');
    localStorage.removeItem('token');
    dispatch(tempLogout());
    navigate('/');
  }

  const getPosts = () => {
    dispatch(getMyPosts());
  }

  useEffect(() => {
    getPosts();
  }, [dispatch]);
  return (
    <>
      {isLoading ? <Loader /> :
        <div className={`lg:mx-28 border-l-4 border-r-8 border-gray-300 ${posts?.length <= 0 ? 'h-svh' : null}`}>
          <div className='lg:p-6 p-3 bg-white rounded-b-lg shadow-xl'>
            <div className='grid lg:grid-cols-2 md:grid-cols-1 gap-4 mb-3'>
              <div className='flex justify-center'>
                <img
                  src={user?.avatar?.url || userPic}
                  alt="User"
                  className="lg:w-32 md:w-24 w-20 lg:h-32 md:h-24 h-20 rounded-full border-2"
                />
              </div>
              <div className='flex justify-between items-center'>
                <div className='flex flex-col items-center hover:underline cursor-pointer'>
                  <span className='text-lg font-bold'>{user?.posts.length}</span>
                  <span>Posts</span>
                </div>
                <div className='flex flex-col items-center mx-3 hover:underline cursor-pointer' onClick={handleFollowersModalOpen}>
                  <span className='text-lg font-bold'>{user?.followers.length}</span>
                  <span>Followers</span>
                </div>
                <div className='flex flex-col items-center hover:underline cursor-pointer' onClick={handleFollowingModalOpen}>
                  <span className='text-lg font-bold'>{user?.following.length}</span>
                  <span>Following</span>
                </div>
              </div>
            </div>

            {/* Followers Modal */}
            <Modal
              open={openFollowers}
              onClose={handleFollowersModalClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ marginBottom: '10px' }}>
                  Followers
                </Typography>
                {user?.followers.map((follower, index) => (
                  <div className='flex justify-between items-center border-b py-3' key={index}>
                    <div className='flex items-center'>
                      <img
                        src={follower.avatar?.url || userPic}
                        alt="User"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className='mx-3'>
                        <Link to={`/profile/${follower._id}`} className='font-semibold'>{follower.name}</Link>
                      </div>
                    </div>
                  </div>
                ))}
              </Box>
            </Modal>

            {/* Following Modal */}
            <Modal
              open={openFollowing}
              onClose={handleFollowingModalClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ marginBottom: '10px' }}>
                  Following
                </Typography>
                {user?.following.map((following, index) => (
                  <div className='flex justify-between items-center border-b py-3' key={index}>
                    <div className='flex items-center'>
                      <img
                        src={following.avatar?.url || userPic}
                        alt="User"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className='mx-3'>
                        <Link to={`/profile/${following._id}`} className='font-semibold'>{following.name}</Link>
                      </div>
                    </div>
                  </div>
                ))}
              </Box>
            </Modal>

            <div className='mb-3'>
              <p className='lg:text-2xl text-xl font-semibold'>{user?.name}</p>
              <p className='lg:text-lg font-semibold'>{user?.bio}</p>
              <p className='font-semibold text-gray-500'>{user?.email}</p>
              <p className='text-sm font-semibold text-gray-500'>
                Joined On : {user?.createdAt.substring(0, 10)} at {user?.createdAt.substring(11, 19)}
              </p>
              <p className='text-sm font-semibold text-black my-2'>{user?.profileLock ? "[Account Locked]" : ''}</p>
            </div>
            <div className='grid grid-cols-2'>
              <div className='grid lg:mr-3 md:mr-2 mr-1'>
                <Button variant='contained' onClick={() => navigate('/update-profile')}>Edit Profile</Button>
              </div>
              <div className='grid lg:grid-cols-12 md:grid-cols-8 grid-cols-4 lg:ml-3 md:ml-2 ml-1'>
                <div className='grid lg:col-span-11 md:col-span-7 col-span-3'>
                  <Button variant='outlined' onClick={handleLogout}>Log out</Button>
                </div>
                <div className='flex justify-end'>
                  <IconButton aria-label='action' onClick={handleClick}>
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem
                      onClick={async () => {
                        //handleClose();
                        await dispatch(loadUser());
                        //Save func
                        navigate('/saved-items');
                      }}
                    >
                      <BookmarksIcon />
                      <span className='text-black hover:text-blue-500'>Saved Items</span>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        //handleClose();
                        handleLockModalOpen();
                      }}
                    >
                      <LockResetIcon />
                      <span className='text-black hover:text-blue-500'>Profile Lock</span>
                    </MenuItem>
                    {/* Profile lock modal */}
                    <Modal
                      open={openLockModal}
                      onClose={handleLockModalClose}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h5" component="h2" sx={{ borderBottom: '1px solid gray' }}>
                          About Profile Lock
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                          Profile Lock is a feature that allows you to restrict your profile's visibility to only your followers.
                          If you enable Profile Lock, people who do not follow you will only see limited information, such as your profile picture and name.
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                          <span className='flex justify-between items-center'>
                            <span className='text-xl'>Profile Lock</span>
                            <Switch checked={isChecked} onChange={handleSwitchChange} />
                          </span>
                        </Typography>
                        <div className='grid mt-2'>
                          <Button variant='contained' onClick={handleProfileLock}>Confirm</Button>
                        </div>
                      </Box>
                    </Modal>
                  </Menu>
                </div>
              </div>
            </div>
          </div>
          <div>
            <MyPosts posts={posts} getPosts={getPosts} />
          </div>
        </div>}
    </>
  )
}

export default Profile
