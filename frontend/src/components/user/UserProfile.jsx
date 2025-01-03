import React, { use, useEffect, useState } from 'react'
import userPic from '../../assets/user.png'
import { Button } from '@mui/material'
import UserPosts from './UserPosts'
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { followUser, getUserPosts, getUserProfile, loadUser } from '../../features/userSlice';
import Loader from '../layout/Loader';

function UserProfile() {
  const { id } = useParams();

  const dispatch = useDispatch();
  const { isLoading, user, error, success, message, posts, userInfo } = useSelector(state => state.user);

  const [followed, setFollowed] = useState(false);

  const handleFollow = async () => {
    await dispatch(followUser(id));
    await dispatch(getUserProfile(id));
    await dispatch(loadUser());
    setFollowed(!followed);
  }

  const getPosts = () => {
    dispatch(getUserPosts(id));
  }

  useEffect(() => {
    dispatch(getUserProfile(id));
    dispatch(getUserPosts(id));
    //Checking if the user is already followed or not
    if (userInfo?.user?.followers.find(follower => follower._id === user?._id)) {
      setFollowed(true);
    }
  }, [dispatch]);
  return (
    <>
      {isLoading ? <Loader /> :
        <div className={`border-l-4 border-r-8 border-gray-300 ${posts?.length <= 0 ? 'h-svh' : null}`}>
          <div className='p-3 bg-white rounded-br-lg shadow-xl'>
            <div className='grid lg:grid-cols-2 md:grid-cols-1 gap-4 mb-3'>
              <div className='flex justify-center'>
                <img src={userInfo?.user?.avatar?.url || userPic} alt='User' width={'30%'} style={{ borderRadius: '50%' }} className='border-2' />
              </div>
              <div className='flex justify-between items-center'>
                <div className='flex flex-col items-center hover:underline cursor-pointer'>
                  <span className='text-lg font-bold'>{userInfo?.user?.posts.length}</span>
                  <span>Posts</span>
                </div>
                <div className='flex flex-col items-center mx-3 hover:underline cursor-pointer'>
                  <span className='text-lg font-bold'>{userInfo?.user?.followers.length}</span>
                  <span>Followers</span>
                </div>
                <div className='flex flex-col items-center hover:underline cursor-pointer'>
                  <span className='text-lg font-bold'>{userInfo?.user?.following.length}</span>
                  <span>Following</span>
                </div>
              </div>
            </div>
            <div className='mb-3'>
              <p className='text-xl font-semibold'>{userInfo?.user?.name}</p>
              <p className='text-lg'>{userInfo?.user?.bio}</p>
              <p className='text-md text-gray-500'>{userInfo?.user?.email}</p>
              <p className='text-sm text-gray-500'>Joined On : {userInfo?.user?.createdAt}</p>
            </div>
            {userInfo?.user?._id !== user?._id ?
              <div className='grid mt-3'>
                {followed ? <Button variant='outlined' onClick={handleFollow}>Unfollow</Button> :
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
