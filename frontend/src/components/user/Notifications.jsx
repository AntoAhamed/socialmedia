import React from 'react'
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import userPic from '../../assets/user.png';
import Loader from '../layout/Loader';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import { loadUser, removeNotification } from '../../features/userSlice';

function Notifications() {
    const dispatch = useDispatch();
    const { isLoading, user, error, success, message, users } = useSelector(state => state.user);

    const handleRemoveNotification = async (id) => {
        await dispatch(removeNotification(id))
        dispatch(loadUser())
    }
    return (
        <div className='p-4'>
            {isLoading ? <Loader /> :
                <div className={`lg:${user?.notifications?.length > 10 ? 'h-full' : 'h-svh'} md:${user?.notifications?.length > 7 ? 'h-full' : 'h-svh'} ${user?.notifications?.length > 5 ? 'h-full' : 'h-svh'} p-4 bg-white`}>
                    <p className='lg:text-3xl text-2xl font-semibold italic text-center mb-3'>Outstagram</p>
                    <p className='font-semibold text-gray-500 text-center mb-3'>Your notifications</p>
                    {user?.notifications?.length > 0 ? user?.notifications?.map(notification => (
                        <div key={notification._id} className='border p-3 flex items-center'>
                            <img src={notification.user?.avatar?.url || userPic} alt='user' className='w-10 h-10 rounded-full' />
                            <div className='flex items-center justify-between w-full mx-3'>
                                <p>
                                    <Link to={`/profile/${notification.user?._id}`} className='font-semibold hover:border-b-2 hover:border-black'>{notification.user?.name}</Link>
                                    <span> {notification.message}</span>
                                </p>
                                <p className='text-blue-700 text-sm font-semibold flex lg:flex-row md:flex-row flex-col'>
                                    <span>On {notification.createdAt.substring(0, 10)} at {notification.createdAt.substring(11, 19)}</span>
                                </p>
                            </div>
                            <IconButton className='hover:text-red-500' onClick={() => handleRemoveNotification(notification._id)}>
                                <CloseIcon fontSize='small' />
                            </IconButton>
                        </div>
                    )) : <p>No notifications yet</p>}
                </div>}
        </div>

    )
}

export default Notifications
