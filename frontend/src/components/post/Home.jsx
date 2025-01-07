import React, { useEffect } from 'react'
import PostCard from '../user/PostCard'
import { useDispatch, useSelector } from 'react-redux';
import { getPostsOfTheFollowings } from '../../features/postSlice';
import Loader from '../layout/Loader';

function Home() {
  const dispatch = useDispatch();
  const { isLoading, postInfo, error } = useSelector(state => state.post);

  const posts = postInfo?.posts;

  const getPosts = () => {
    dispatch(getPostsOfTheFollowings());
  };

  useEffect(() => {
    getPosts();
  }, [dispatch]);

  return (
    <>
      {isLoading ? <Loader /> :
        <div className='lg:px-32 md:px-16 sm:px-8'>
          <div className='flex flex-col lg:px-16 lg:py-4 p-4 bg-white'>
            <h1 className='text-xl text-gray-400 font-semibold mb-5 text-center'>Enjoy your newsfeed</h1>
            {posts?.length ? posts.map((post, index) => (
              <div className='mb-4' key={index}>
                <PostCard post={post} getPosts={getPosts} />
              </div>
            )) : <p className='text-center text-2xl font-semibold text-gray-500 h-svh'>No posts to show. Follow somebody to see their posts.</p>}
          </div>
        </div>}
    </>
  )
}

export default Home
