import React, { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updatePost } from '../../features/postSlice';
import Loader from '../layout/Loader';

function EditPost() {
    const { id } = useParams();
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const { isLoading, postInfo, error } = useSelector(state => state.post);

    const [image, setImage] = useState('');
    const [caption, setCaption] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        const postData = {
            image,
            caption
        }

        dispatch(updatePost({ id, postData }));

        setImage('');
        setCaption('');

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
                        <p className='lg:text-3xl text-2xl font-semibold italic text-center mb-3'>Outstagram</p>
                        <p className='font-semibold text-gray-500 text-center mb-3'>Edit post</p>
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
                                <Button type='submit' variant='contained' onChange={handleImageChange}>Confirm Changes</Button>
                            </div>
                        </form>
                    </div>
                </div>}
        </>
    )
}

export default EditPost
