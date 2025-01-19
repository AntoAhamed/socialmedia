import React, { useEffect } from 'react'
import PostCard from '../user/PostCard'
import { useDispatch, useSelector } from 'react-redux';
import { getPostsOfTheFollowings } from '../../features/postSlice';
import Loader from '../layout/Loader';
import { Link } from 'react-router-dom';
import userPic from '../../assets/user.png'

function Home(props) {
  const { handleComponent, user } = props;
  const dispatch = useDispatch();
  const { isLoading, postInfo, error } = useSelector(state => state.post);

  const posts = postInfo?.posts;

  const getPosts = () => {
    dispatch(getPostsOfTheFollowings());
  };

  useEffect(() => {
    handleComponent("home")
    getPosts();
  }, [dispatch]);
  return (
    <>
      {isLoading ? <Loader /> :
        <div className='lg:px-32 md:px-16 sm:px-8'>
          <div className='flex flex-col lg:px-16 lg:py-4 p-4 bg-white'>
            <Link to='/create-post' onClick={()=>handleComponent("create-post")}>
              <div className='flex items-center border-2 rounded-md p-3 mb-4 bg-white hover:bg-gray-100 cursor-pointer'>
                <img src={user?.avatar?.url || userPic} alt='User' className='w-12 h-12 rounded-full object-cover mr-3' />
                <p className='text-gray-700'>Share your thoughts...</p>
              </div>
            </Link>
            {posts?.length ? posts.map((post, index) => (
              <div className='mb-4' key={index}>
                <PostCard handleComponent={handleComponent} post={post} getPosts={getPosts} />
              </div>
            )) : <p className='text-center text-2xl font-semibold text-gray-500 h-svh'>No posts to show. Follow somebody to see their posts.</p>}
          </div>
        </div>}
    </>
  )
}

export default Home
