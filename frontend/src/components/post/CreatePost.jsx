import React, { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createPost } from '../../features/postSlice';
import Loader from '../layout/Loader';
import { getMyPosts, loadUser } from '../../features/userSlice';
import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import imageCompression from 'browser-image-compression';

function CreatePost(props) {
  const { user } = props
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { isLoading, postInfo, error } = useSelector(state => state.post);

  const [images, setImages] = useState([]);
  const [caption, setCaption] = useState('');

  const [isChecked, setIsChecked] = useState(false);

  const handleSwitchChange = (event) => {
    setIsChecked(event.target.checked); // Update the state with the new value
    //console.log(event.target.checked)
  };

  // Input btn style
  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const postData = {
      images,
      caption,
      isChecked,
    }

    await dispatch(createPost(postData));

    setImages([]);
    setCaption('');

    await dispatch(getMyPosts());

    await dispatch(loadUser());

    navigate('/profile');
  }

  const handleImageChange = async (e) => {
    try {
      const files = Array.from(e.target.files);

      if (files.length > 4) {
        alert("You can upload a maximum of 4 images!");
        return;
      }

      setImages([]);

      const compressedImages = await Promise.all(
        files.map(async (file) => {
          const options = {
            maxSizeMB: 0.3,
            maxWidthOrHeight: 300,
            useWebWorker: true,
          };
          const compressedFile = await imageCompression(file, options);
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
              if (reader.readyState === 2) {
                resolve(reader.result);
              }
            };
            reader.readAsDataURL(compressedFile);
          });
        })
      );

      setImages(compressedImages);
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <>
      {isLoading ? <Loader /> :
        <div className='lg:px-32 p-4 h-full'>
          <div className='border-2 flex flex-col lg:p-16 p-4 bg-white'>
            <p className='lg:text-3xl text-2xl font-semibold italic text-center mb-3'>Outstagram</p>
            <p className='font-semibold text-gray-500 text-center mb-3'>Create post</p>

            {/* Image Preview Section */}
            <div className='grid mb-3 border-dashed border-2 p-4'>
              {images.length > 0 ? (
                <div className='grid grid-cols-2 gap-4'>
                  {images.map((img, index) => (
                    <img key={index} src={img} alt={`uploaded-${index}`} className='h-40 w-full' />
                  ))}
                </div>
              ) : (
                <p className='text-gray-500 text-center lg:py-32 py-16'>Preview image</p>
              )}
            </div>

            {/* Form Section */}
            <form onSubmit={handleSubmit}>
              {/* Image Input */}
              <div className='grid mb-3'>
                <Button
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  startIcon={<CloudUploadIcon />}
                >
                  Upload photos
                  <VisuallyHiddenInput
                    type="file"
                    accept='.png, .jpg, .jpeg'
                    onChange={(e) => handleImageChange(e)}
                    multiple
                  />
                </Button>
              </div>

              {/* Caption Input */}
              <div className='grid mb-3'>
                <TextField
                  id="standard-basic"
                  label="Caption"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  variant="standard"
                  multiline
                  required
                  inputProps={{ maxLength: 400 }}
                />
              </div>

              <div className='flex justify-between items-center mb-3'>
                <p>Anonymous Post <span className='text-sm font-semibold text-gray-500'>({user.anonymousPosts} post left)</span></p>
                <Switch checked={isChecked} disabled={user.anonymousPosts === 0} onChange={handleSwitchChange} />
              </div>

              {/* Submit Button */}
              <div className='grid mb-3'>
                <Button type='submit' variant='contained' color='success'>Post</Button>
              </div>
            </form>
          </div>
        </div>}
    </>
  )
}

export default CreatePost
