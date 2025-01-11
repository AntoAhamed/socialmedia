import React from 'react'
import { Link } from 'react-router-dom';
import img from '../../assets/img.jpg'

function SavedItems(props) {
  const { saves } = props;

  console.log(saves)
  return (
    <div className='p-4'>
      <div className={`lg:${saves.length > 10 ? 'h-full' : 'h-svh'} md:${saves.length > 7 ? 'h-full' : 'h-svh'} ${saves.length > 5 ? 'h-full' : 'h-svh'} p-4 bg-white`}>
        <p className='lg:text-3xl text-2xl font-semibold italic text-center mb-3'>Outstagram</p>
        <p className='font-semibold text-gray-500 text-center mb-3'>Your saved items</p>
        {saves.length > 0 ? saves.map(item => (
          <Link to={`/profile/${item.owner}`} key={item._id}>
            <div className='border p-3 flex items-center hover:font-semibold'>
              <img
                src={item.image?.url || img}
                alt="Post"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className='flex flex-col justify-center mx-3 w-full'>
                <p>{item.caption.substring(0, 10)}...</p>
                <p className='text-sm text-gray-500'>{item.likes.length}likes {item.comments.length}comments {item.saves.length}saves</p>
              </div>
            </div>
          </Link>
        )) : <p>No saved items yet</p>}
      </div>
    </div>
  )
}

export default SavedItems
