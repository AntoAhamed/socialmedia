import React, { use, useEffect, useState } from 'react'
import userPic from '../../assets/user.png'
import { Button, Typography, useMediaQuery } from '@mui/material'
import UserPosts from './UserPosts'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { followUser, getUserPosts, getUserProfile, loadUser } from '../../features/userSlice';
import Loader from '../layout/Loader';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

function UserProfile() {
  const { id } = useParams();

  const dispatch = useDispatch();
  const { isLoading, user, error, success, message, posts, userInfo } = useSelector(state => state.user);

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

  // Calculate followed dynamically
  const isFollowed = userInfo?.user?.followers.some(
    (follower) => follower._id === user?._id
  );

  const handleFollow = async () => {
    await dispatch(followUser(id));
    await dispatch(getUserProfile(id));
    dispatch(loadUser());
  }

  const getPosts = () => {
    dispatch(getUserPosts(id));
  }

  useEffect(() => {
    dispatch(getUserProfile(id));
    dispatch(getUserPosts(id));
  }, [dispatch, id]);
  return (
    <>
      {isLoading ? <Loader /> :
        <div className={`border-l-4 border-r-8 border-gray-300 ${posts?.length <= 0 ? 'h-svh' : null}`}>
          <div className='lg:p-6 p-3 bg-white rounded-br-lg shadow-xl'>
            <div className='grid lg:grid-cols-2 md:grid-cols-1 gap-4 mb-3'>
              <div className='flex justify-center'>
                <img
                  src={userInfo?.user?.avatar?.url || userPic}
                  alt="User"
                  className="lg:w-32 md:w-24 w-20 lg:h-32 md:h-24 h-20 rounded-full object-cover"
                />
              </div>
              <div className='flex justify-between items-center'>
                <div className='flex flex-col items-center hover:underline cursor-pointer'>
                  <span className='text-lg font-bold'>{userInfo?.user?.posts.length}</span>
                  <span>Posts</span>
                </div>
                <div className='flex flex-col items-center mx-3 hover:underline cursor-pointer' onClick={handleFollowersModalOpen}>
                  <span className='text-lg font-bold'>{userInfo?.user?.followers.length}</span>
                  <span>Followers</span>
                </div>
                <div className='flex flex-col items-center hover:underline cursor-pointer' onClick={handleFollowingModalOpen}>
                  <span className='text-lg font-bold'>{userInfo?.user?.following.length}</span>
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
                {userInfo?.user?.followers.map((follower, index) => (
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
                {userInfo?.user?.following.map((following, index) => (
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
              <p className='lg:text-2xl text-xl font-semibold'>{userInfo?.user?.name}</p>
              <p className='lg:text-lg font-semibold'>{userInfo?.user?.bio}</p>
              <p className='font-semibold text-gray-500'>{userInfo?.user?.email}</p>
              <p className='text-sm font-semibold text-gray-500'>Joined On : {userInfo?.user?.createdAt.substring(0, 10)} at {userInfo?.user?.createdAt.substring(11, 19)}</p>
            </div>
            {userInfo?.user?._id !== user?._id ?
              <div className='grid mt-3'>
                {isFollowed ? <Button variant='outlined' onClick={handleFollow}>Unfollow</Button> :
                  <Button variant='contained' onClick={handleFollow}>Follow</Button>}
              </div> : <div className='text-center text-gray-500'>It's your</div>}
          </div>
          <div>
            <UserPosts posts={posts} getPosts={getPosts} />
          </div>
        </div>}
    </>
  )
}

export default UserProfile
