import React, { useEffect, useState } from 'react'
import userPic from '../../assets/user.png'
import { Button, Typography } from '@mui/material'
import MyPosts from './MyPosts'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getMyPosts, getUserProfile, loadUser, tempLogout } from '../../features/userSlice'
import Loader from '../layout/Loader'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

function Profile() {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { isLoading, user, error, success, message, posts } = useSelector(state => state.user);

  //Modal style
  const style = {
    position: 'absolute',
    top: '15%',
    left: '50%',
    right: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
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

  const handleLogout = () => {
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
        <div className={`border-l-4 border-r-8 border-gray-300 ${posts?.length <= 0 ? 'h-svh' : null}`}>
          <div className='p-3 bg-white rounded-b-lg shadow-xl'>
            <div className='grid lg:grid-cols-2 md:grid-cols-1 gap-4 mb-3'>
              <div className='flex justify-center'>
                <img src={user?.avatar?.url || userPic} alt='User' width={'30%'} style={{ borderRadius: '50%' }} className='border-2' />
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
                  <div className='flex justify-between items-center border-b-2 py-3' key={index}>
                    <div className='flex items-center'>
                      <img src={follower.avatar?.url} alt='User' width='50' style={{ borderRadius: '50%' }} />
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
                  <div className='flex justify-between items-center border-b-2 py-3' key={index}>
                    <div className='flex items-center'>
                      <img src={following.avatar?.url} alt='User' width='50' style={{ borderRadius: '50%' }} />
                      <div className='mx-3'>
                        <Link to={`/profile/${following._id}`} className='font-semibold'>{following.name}</Link>
                      </div>
                    </div>
                  </div>
                ))}
              </Box>
            </Modal>

            <div className='mb-3'>
              <p className='text-xl font-semibold'>{user?.name}</p>
              <p className='text-lg'>{user?.bio}</p>
              <p className='text-md text-gray-500'>{user?.email}</p>
              <p className='text-sm text-gray-500'>Joined On : {user?.createdAt}</p>
            </div>
            <div className='grid grid-cols-2'>
              <div className='grid mr-3'>
                <Button variant='contained' onClick={() => navigate('/update-profile')}>Edit Profile</Button>
              </div>
              <div className='grid ml-3'>
                <Button variant='outlined' onClick={handleLogout}>Log out</Button>
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
