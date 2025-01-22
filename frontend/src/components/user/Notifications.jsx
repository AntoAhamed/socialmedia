import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import userPic from '../../assets/user.png';
import Loader from '../layout/Loader';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import { getNotification, loadUser, removeNotification } from '../../features/userSlice';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import PostCard from './PostCard';

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

function Notifications(props) {
    const { handleComponent } = props;
    const dispatch = useDispatch();
    const { isLoading, user, error, success, message, users, userInfo } = useSelector(state => state.user);
    const [post, setPost] = useState({})
    const notifications = userInfo?.notifications;

    //Modal state
    const [open, setOpen] = React.useState(false);
    const handleOpen = (post) => {
        setOpen(true);
        setPost(post);
    }
    const handleClose = () => setOpen(false);

    const getNotifications = () => {
        dispatch(getNotification())
        setOpen(false)
    }

    const handleRemoveNotification = async (id) => {
        await dispatch(removeNotification(id))
        dispatch(getNotification())
        //dispatch(loadUser())
    }

    console.log(notifications)

    useEffect(() => {
        handleComponent("notifications")
        dispatch(getNotification())
    }, [dispatch])
    return (
        <div className='p-4'>
            {isLoading ? <Loader /> :
                <div className={`lg:mx-28 lg:${notifications?.length > 10 ? 'h-full' : 'h-svh'} md:${notifications?.length > 7 ? 'h-full' : 'h-svh'} ${notifications?.length > 5 ? 'h-full' : 'h-svh'} p-4 bg-white`}>
                    <p className='lg:text-3xl text-2xl font-semibold italic text-center mb-3'>Outstagram</p>
                    <p className='font-semibold text-gray-500 text-center mb-3'>Your notifications</p>
                    {notifications?.length > 0 ? notifications.map(notification => (
                        <div key={notification._id} className='border p-3 flex items-center'>
                            <img
                                src={notification.user?.avatar?.url || userPic}
                                alt="User"
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            <div className='flex items-center justify-between w-full mx-3'>
                                <p>
                                    <Link to={`/profile/${notification.user?._id}`} onClick={() => handleComponent(`profile/${notification.user?._id}`)} className='font-semibold hover:border-b-2 hover:border-black'>{notification.user?.name}</Link>
                                    <span> {notification.message} </span>
                                    {notification.post && <span className='text-sm hover:text-gray-700 cursor-pointer font-semibold' onClick={() => handleOpen(notification.post)}>See post</span>}
                                </p>
                                <p className='text-blue-700 text-sm font-semibold flex lg:flex-row md:flex-row flex-col'>
                                    <span>{new Date(notification.createdAt).toLocaleString().replace(',', ' at')}</span>
                                </p>
                            </div>
                            <IconButton className='hover:text-red-500' onClick={() => handleRemoveNotification(notification._id)}>
                                <CloseIcon fontSize='small' />
                            </IconButton>
                        </div>
                    )) : <p>No notifications yet</p>}

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
                </div>}
        </div>

    )
}

export default Notifications
