import React from 'react'
import PostCard from './PostCard'

function MyPosts(props) {
  const { posts, getPosts } = props;
  return (
    <div className='grid lg:grid-cols-2 md:grid-cols-1 gap-4 p-3'>
      {posts?.length ? posts.map((post, index) => (<PostCard key={index} post={post} editAndDelete={true} getPosts={getPosts} />)) : <p className='text-gray-500 text-xl'>No posts yet</p>}
    </div>
  )
}

export default MyPosts
