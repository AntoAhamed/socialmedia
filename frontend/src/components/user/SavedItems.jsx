import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import img from '../../assets/img.jpg'
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import PostCard from './PostCard';
import { getSavedPosts } from '../../features/userSlice';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function SavedItems(props) {
  const { handleComponent } = props;
  const dispatch = useDispatch();
  const { isLoading, user, error, success, message, users, userInfo } = useSelector(state => state.user);
  const [post, setPost] = useState({})

  //Modal state
  const [open, setOpen] = useState(false);
  const handleOpen = (post) => {
    setOpen(true);
    setPost(post);
  }
  const handleClose = () => setOpen(false);

  const getNotifications = () => {
    dispatch(getSavedPosts())
    setOpen(false)
  }

  const saves = userInfo?.saves;

  useEffect(() => {
    dispatch(getSavedPosts())
  }, [dispatch])
  return (
    <div className='p-4'>
      <div className={`lg:mx-28 lg:${saves?.length > 10 ? 'h-full' : 'h-svh'} md:${saves?.length > 7 ? 'h-full' : 'h-svh'} ${saves?.length > 5 ? 'h-full' : 'h-svh'} p-4 bg-white`}>
        <p className='lg:text-3xl text-2xl font-semibold italic text-center mb-3'>Outstagram</p>
        <p className='font-semibold text-gray-500 text-center mb-3'>Your saved items</p>
        {saves?.length > 0 ? saves?.map(item => (
          <div className='border p-3 flex items-center hover:font-semibold cursor-pointer' key={item?._id} onClick={()=>handleOpen(item)}>
            <img
              src={item?.images[0]?.url || img}
              alt="Post"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className='flex flex-col justify-center mx-3 w-full'>
              <p>{item?.caption.substring(0, 10)}...</p>
              <p className='text-sm text-gray-500'>{item?.likes.length}likes {item?.comments.length}comments {item?.saves.length}saves</p>
            </div>
          </div>
        )) : <p>No saved items yet</p>}

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <PostCard handleComponent={handleComponent} post={post} getPosts={getNotifications} />
          </Box>
        </Modal>
      </div>
    </div>
  )
}

export default SavedItems
