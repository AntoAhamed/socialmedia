import React from 'react'
import PostCard from '../user/PostCard';

function HomePosts(props) {
  const { handleComponent, posts, getPosts } = props;
    return (
      <div className='grid grid-cols-1 gap-4'>
        {posts?.length ? 
        posts.map((post, index) => (<PostCard key={index} handleComponent={handleComponent} post={post} getPosts={getPosts} />)) : 
        <p className='text-center text-2xl font-semibold text-gray-500'>No posts to show. Follow somebody to see their posts.</p>}
      </div>
    )
}

export default HomePosts
