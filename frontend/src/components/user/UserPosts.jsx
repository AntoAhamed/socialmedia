import React from 'react'
import PostCard from './PostCard'

function UserPosts(props) {
  const { posts, getPosts } = props;
  return (
    <div className='grid grid-cols-1 lg:gap-6 gap-4 lg:p-6 p-3'>
      {posts?.length ? posts.map((post, index) => (<PostCard key={index} post={post} getPosts={getPosts} />)) : <p className='text-gray-500 text-xl' >No posts</p>}
    </div>
  )
}

export default UserPosts
