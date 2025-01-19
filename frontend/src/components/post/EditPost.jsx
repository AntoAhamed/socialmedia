import React, { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updatePost } from '../../features/postSlice';
import Loader from '../layout/Loader';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

function EditPost() {
    const { id } = useParams();
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const { isLoading, postInfo, error } = useSelector(state => state.post);

    const [images, setImages] = useState([]);
    const [caption, setCaption] = useState('');

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
            caption
        }

        await dispatch(updatePost({ id, postData }));

        setImages([]);
        setCaption('');

        navigate('/profile');
    }

    const handleImageChange = (e) => {
        try {
            const files = Array.from(e.target.files);

            if (files.length > 4) {
                alert("You can upload a maximum of 4 images!");
                return;
            }

            setImages([]);

            files.forEach((file) => {
                const reader = new FileReader();

                reader.onload = () => {
                    if (reader.readyState === 2) {
                        setImages((old) => [...old, reader.result]);
                    }
                }

                reader.readAsDataURL(file);
            })
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(()=>{
        
    },[])
    return (
        <>
            {isLoading ? <Loader /> :
                <div className='lg:px-32 p-4 h-full'>
                    <div className='border-2 flex flex-col lg:p-16 p-4 bg-white'>
                        <p className='lg:text-3xl text-2xl font-semibold italic text-center mb-3'>Outstagram</p>
                        <p className='font-semibold text-gray-500 text-center mb-3'>Edit post</p>
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
                        <form onSubmit={handleSubmit}>
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
                            <div className='grid mb-3'>
                                <TextField id="standard-basic" label="Caption" value={caption} onChange={(e) => setCaption(e.target.value)} variant="standard" multiline required inputProps={{ maxLength: 400 }} />
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
