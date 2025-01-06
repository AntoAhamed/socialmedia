import React, { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createPost } from '../../features/postSlice';
import Loader from '../layout/Loader';
import { getMyPosts, loadUser } from '../../features/userSlice';

function CreatePost() {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { isLoading, postInfo, error } = useSelector(state => state.post);

  const [image, setImage] = useState('');
  const [caption, setCaption] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const postData = {
      image,
      caption
    }

    await dispatch(createPost(postData));

    await dispatch(getMyPosts());

    await dispatch(loadUser());

    setImage('');
    setCaption('');

    alert("Post created successfully");

    navigate('/profile');
  }

  const handleImageChange = (e) => {
    try {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImage(reader.result);
        }
      }

      reader.readAsDataURL(e.target.files[0]);
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <>
      {isLoading ? <Loader /> :
        <div className='lg:px-32 p-4 h-full'>
          <div className='border-2 flex flex-col lg:p-16 p-4 bg-white'>
            <p className='text-3xl font-semibold italic text-center mb-3'>Outstagram</p>
            <p className='font-semibold text-gray-500 text-center mb-3'>Create post</p>
            <div className='grid mb-3 border-dashed border-2 h-96'>
              {image !== '' ? <img src={image} alt='' className='w-full h-96' /> :
                <p className='text-gray-500 text-center pt-52'>Preview image</p>}
            </div>
            <form onSubmit={handleSubmit}>
              <div className='grid mb-3'>
                <input type='file' accept='.png, .jpg, .jpeg' className='bg-gray-100 p-3 rounded-t-md border-gray-500 border-b' onChange={handleImageChange} />
              </div>
              <div className='grid mb-3'>
                <TextField id="standard-basic" label="Caption" value={caption} onChange={(e) => setCaption(e.target.value)} variant="standard" multiline required />
              </div>
              <div className='grid mb-3'>
                <Button type='submit' variant='contained' onChange={handleImageChange} color='success'>Post</Button>
              </div>
            </form>
          </div>
        </div>}
    </>
  )
}

export default CreatePost
