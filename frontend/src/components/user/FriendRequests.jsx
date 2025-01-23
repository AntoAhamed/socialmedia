import React, { useEffect } from 'react'
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import userPic from '../../assets/user.png';
import Loader from '../layout/Loader';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import { acceptRequest, getRequest, ignoreRequest, loadUser } from '../../features/userSlice';

function FriendRequests(props) {
    const { handleComponent } = props;
    const dispatch = useDispatch();
    const { isLoading, user, error, success, message, users, userInfo } = useSelector(state => state.user);

    const handleAccept = async (id) => {
        await dispatch(acceptRequest(id))
        dispatch(loadUser())
    }

    const handleIgnore = async (id) => {
        await dispatch(ignoreRequest(id))
        dispatch(loadUser())
    }

    useEffect(() => {
        handleComponent("friend-requests")
        dispatch(getRequest())
    }, [dispatch])

    const reqs = userInfo?.requests
    return (
        <div className='p-4'>
            {isLoading ? <Loader /> :
                <div className={`lg:mx-28 lg:${reqs?.length > 10 ? 'h-full' : 'h-svh'} md:${reqs?.length > 7 ? 'h-full' : 'h-svh'} ${reqs?.length > 5 ? 'h-full' : 'h-svh'} p-4 bg-white`}>
                    <p className='lg:text-3xl text-2xl font-semibold italic text-center mb-3'>Outstagram</p>
                    <p className='font-semibold text-gray-500 text-center mb-3'>Your friend requests</p>
                    {reqs?.length > 0 ? reqs.map(request => (
                        <div key={request?._id} className='border p-3 flex items-center'>
                            <img
                                src={request?.avatar?.url || userPic}
                                alt="User"
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            <div className='flex items-center justify-between w-full mx-3'>
                                <p>
                                    <Link to={`/profile/${request?._id}`} onClick={() => handleComponent(`profile/${request?._id}`)} className='font-semibold hover:border-b-2 hover:border-black'>{request?.name}</Link>
                                </p>
                            </div>
                            <div className='flex'>
                                <IconButton className='hover:text-green-500' onClick={() => handleAccept(request?._id)}>
                                    <CheckOutlinedIcon fontSize='small' />
                                </IconButton>
                                <IconButton className='hover:text-red-500' onClick={() => handleIgnore(request?._id)}>
                                    <CloseIcon fontSize='small' />
                                </IconButton>
                            </div>
                        </div>
                    )) : <p>No requests yet</p>}
                </div>}
        </div>

    )
}

export default FriendRequests
