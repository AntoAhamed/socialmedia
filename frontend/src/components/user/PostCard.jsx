import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from '@mui/icons-material/Share';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import img from '../../assets/img.jpg'
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createComment, deleteComment, deletePost, deleteReply, likeAndUnlikePost, replyToComment, saveAndUnsavePost } from '../../features/postSlice';
import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Loader from '../layout/Loader';
import { loadUser } from '../../features/userSlice';
import userPic from '../../assets/user.png'
import { useMediaQuery } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Anonymous from '../../assets/anonymous.png'

export default function PostCard(props) {
  const { post, editAndDelete, getPosts } = props

  const naigate = useNavigate();

  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);
  const { isLoading, postInfo, error } = useSelector(state => state.post);

  const isSmall = useMediaQuery("(max-width: 500px)");
  const isMedium = useMediaQuery("(max-width: 755px)");

  let size = 750;
  if (isSmall) size = 360;
  else if (isMedium) size = 500;

  //Post liked or not by the user
  const [liked, setLiked] = React.useState(false);

  const handleLike = async () => {
    await dispatch(likeAndUnlikePost(post._id));
    setLiked(!liked);
    getPosts();
  }

  //Comment state and function
  const [comment, setComment] = React.useState('');

  const handleComment = async () => {
    await dispatch(createComment({ id: post._id, comment }));

    setComment('');

    getPosts();
  };

  // Reply state and function
  const [openReplies, setOpenReplies] = React.useState({}); // Track visibility of replies by comment ID

  const toggleReplies = (commentId) => {
    setOpenReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId], // Toggle visibility for the specific comment
    }));
  };

  const [replies, setReplies] = React.useState({}); // Store replies by comment ID

  const handleReplyChange = (commentId, value) => {
    setReplies(prev => ({ ...prev, [commentId]: value })); // Update only the specific comment's reply
  };

  const handleReply = async (commentId) => {
    await dispatch(replyToComment({ id: post._id, commentId, reply: replies[commentId] }))

    setReplies(prev => ({ ...prev, [commentId]: '' })); // Clear the reply for the specific comment

    getPosts();
  };

  //Post saved or not by the user
  const [saved, setSaved] = React.useState(false);

  const handleSave = async () => {
    await dispatch(saveAndUnsavePost(post._id));
    setSaved(!saved);
    getPosts();
    //dispatch(loadUser());
  }

  //Modal style
  const style = {
    position: 'absolute',
    top: '0%', // Fixed top gap
    left: '50%', // Center horizontally
    transform: 'translateX(-50%)', // Adjust only horizontally
    width: size,
    maxHeight: '85vh', // Optional: Limit modal height to prevent overflow
    overflowY: 'auto', // Enable scrolling for overflow content
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 24,
    p: 4,
  };

  //Modal state for likes
  const [openLikes, setOpenLikes] = React.useState(false);
  const handleLikesModalOpen = () => setOpenLikes(true);
  const handleLikesModalClose = () => setOpenLikes(false);

  //Modal state for comments
  const [openComments, setOpenComments] = React.useState(false);
  const handleCommentsModalOpen = () => setOpenComments(true);
  const handleCommentsModalClose = () => {
    setOpenReplies(false);
    setOpenComments(false);
  }

  //Settting the anchor element for the comment menu
  const [anchorElCom, setAnchorElCom] = React.useState(null);

  const handleCommentClick = (event) => {
    setAnchorElCom(event.currentTarget);
  };

  const handleCommentClose = () => {
    setAnchorElCom(null);
  };

  //Settting the anchor element for the reply menu
  const [anchorElRep, setAnchorElRep] = React.useState(null);

  const handleReplyClick = (event) => {
    setAnchorElRep(event.currentTarget);
  };

  const handleReplyClose = () => {
    setAnchorElRep(null);
  };

  //Settting the anchor element for the menu
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  //Delete post
  const handleDelete = async () => {
    await dispatch(deletePost(post._id));
    await dispatch(loadUser());
    getPosts();
  };

  //Delete comment
  const handleDeleteComment = async (commentId) => {
    await dispatch(deleteComment({ id: post._id, commentId }));
    getPosts();
  };

  //Delete reply
  const handleDeleteReply = async (commentId, replyId) => {
    await dispatch(deleteReply({ id: post._id, commentId, replyId }));
    getPosts();
  }

  React.useEffect(() => {
    //Checking if the post is liked by the user
    if (post?.likes.find(like => like._id === user?._id)) {
      setLiked(true);
    }
    //Checking if the post is saved by the user
    if (post?.saves.find(save => save._id === user?._id)) {
      setSaved(true);
    }
  }, [post]);
  return (
    <>
      {isLoading ? <Loader /> :
        <Card sx={{ width: '100%', justifySelf: 'center', border: '1px solid #bfbfbf' }}>
          {/* Card Header */}
          <CardHeader
            avatar={post.isAnonymous ?
              <img
                src={Anonymous}
                alt="Anonymous"
                className="w-12 h-12 rounded-full"
              /> :
              <img
                src={post?.owner?.avatar?.url || userPic}
                alt="User"
                className="w-12 h-12 rounded-full"
              />
            }
            action={editAndDelete &&
              <IconButton aria-label="settings" onClick={handleClick}>
                <MoreVertIcon />
              </IconButton>
            }
            title={post.isAnonymous ?
              <span className='text-lg font-semibold'>Anonymous</span> :
              <span className='text-lg font-semibold'>
                <Link to={`/profile/${post?.owner?._id}`}>
                  {post?.owner?.name}
                </Link>
              </span>}
            subheader={<span className='text-sm text-gray-500 font-semibold'>{post?.createdAt.substring(0, 10)} at {post?.createdAt.substring(11, 19)}</span>}
          />
          {/* Settings Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem
              onClick={() => {
                handleClose();
                naigate(`/edit-post/${post._id}`);
              }}
            >
              <EditNoteIcon />
              <span className='text-blue-500'>Edit</span>
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClose();
                handleDelete();
              }}
            >
              <DeleteIcon />
              <span className='text-red-500'>Delete</span>
            </MenuItem>
          </Menu>
          {/* Card Media */}
          {(post.images && post.images.length > 0) && <Carousel
            className="carousel-container"
            autoPlay
            infiniteLoop
            showThumbs={false}
            renderArrowPrev={(onClickHandler, hasPrev, label) =>
              hasPrev && (
                <button
                  type="button"
                  onClick={onClickHandler}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-80 text-white rounded-full w-10 h-10 flex items-center justify-center z-10"
                  aria-label={label}
                >
                  ‹
                </button>
              )
            }
            renderArrowNext={(onClickHandler, hasNext, label) =>
              hasNext && (
                <button
                  type="button"
                  onClick={onClickHandler}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-80 text-white rounded-full w-10 h-10 flex items-center justify-center z-10"
                  aria-label={label}
                >
                  ›
                </button>
              )
            }
          >
            {post.images.map((image, index) => (
              <CardMedia
                key={index}
                component="img"
                image={image.url}
                alt="Post image"
                sx={{ height: 300, objectFit: 'contain', backgroundColor: '#f0f0f0' }}
              />
            ))}
          </Carousel>}
          {/* Card Content */}
          <CardContent>
            <Typography variant="body1">
              {post?.caption}
            </Typography>
          </CardContent>
          {/* Card likes and comments summery */}
          <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="div" color="text.secondary" sx={{ marginRight: '10px', cursor: 'pointer' }} onClick={handleLikesModalOpen}>
              {post?.likes.length} reacts
            </Typography>
            <Typography>
              <Typography variant="div" color="text.secondary" sx={{ marginRight: '10px', cursor: 'pointer' }} onClick={handleCommentsModalOpen}>
                {post?.comments.length} comments
              </Typography>
              {!post.isAnonymous && <Typography variant="div" color="text.secondary" sx={{ cursor: 'pointer' }}>
                {post?.saves.length} saves
              </Typography>}
            </Typography>
          </CardContent>
          {/* Card Actions */}
          <CardActions disableSpacing sx={{ display: 'flex', justifyContent: 'space-around', borderTop: '1px solid #bfbfbf' }}>
            <IconButton aria-label="add to favorites" onClick={handleLike}>
              {!liked ? <FavoriteBorderIcon /> :
                <FavoriteIcon sx={{ color: 'red' }} />}
            </IconButton>
            <IconButton aria-label="add to favorites" onClick={handleCommentsModalOpen}>
              <CommentIcon />
            </IconButton>
            {!post.isAnonymous && <IconButton aria-label="share" onClick={handleSave}>
              {!saved ? <BookmarkBorderOutlinedIcon /> :
                <BookmarkOutlinedIcon sx={{ color: '#0066ff' }} />}
            </IconButton>}
          </CardActions>
          {/* Likes Modal */}
          <Modal
            open={openLikes}
            onClose={handleLikesModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ marginBottom: '10px' }}>
                Likes
              </Typography>
              {post?.likes.map((like, index) => (
                <div className='flex justify-between items-center border-b py-3' key={index}>
                  <div className='flex items-center'>
                    <img
                      src={like.avatar?.url || userPic}
                      alt="User"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className='mx-3'>
                      <Link to={`/profile/${like._id}`} className='font-semibold'>{like.name}</Link>
                    </div>
                  </div>
                </div>
              ))}
            </Box>
          </Modal>
          {/* Comments Modal */}
          <Modal
            open={openComments}
            onClose={handleCommentsModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ marginBottom: '10px' }}>
                Comments
              </Typography>

              {/*Comment*/}
              {post?.comments.map((comment, index) => (
                <div key={index} className='border-b py-2'>
                  <div className='flex justify-between items-center'>
                    <div className='flex items-center'>
                      <img
                        src={comment.user?.avatar?.url || userPic}
                        alt="User"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className='mx-3'>
                        <div>
                          <Link to={`/profile/${comment.user?._id}`} className='font-semibold'>{comment.user?.name}</Link>
                          <span className='font-semibold text-gray-500' style={{ fontSize: '12px' }}> {comment.createdAt.substring(8, 10)}-{comment.createdAt.substring(5, 7)} at {comment.createdAt.substring(11, 16)}</span>
                        </div>
                        <p>{comment.comment}</p>
                      </div>
                    </div>
                    <div className='flex flex-col justify-center items-center'>
                      {comment.user?._id === user?._id &&
                        <div>
                          <IconButton aria-label="settings" onClick={handleCommentClick}>
                            <MoreVertIcon fontSize='small' />
                          </IconButton>

                          <Menu
                            anchorEl={anchorElCom}
                            open={Boolean(anchorElCom)}
                            onClose={handleCommentClose}
                          >
                            <MenuItem
                              onClick={() => {
                                handleCommentClose();
                                handleDeleteComment(comment._id)
                              }}
                              className='hover:text-red-500'
                            >
                              <DeleteIcon fontSize='small' />
                            </MenuItem>
                          </Menu>
                        </div>}

                      {/*<IconButton aria-label="add to favorites" onClick={handleLike}>
                        {!liked ? <FavoriteBorderIcon fontSize='small' /> :
                          <FavoriteIcon fontSize='small' sx={{ color: 'red' }} />}
                      </IconButton>*/}
                    </div>
                  </div>

                  {/*Replies*/}
                  <div className='pl-14 flex flex-col'>
                    {openReplies[comment._id] ?
                      comment.replies.map((reply, index) => (
                        <div key={index} className='flex justify-between items-center py-1'>
                          <div className='flex items-center'>
                            <img
                              src={reply.user?.avatar?.url || userPic}
                              alt="User"
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div className='mx-3'>
                              <div>
                                <Link to={`/profile/${reply.user?._id}`} className='font-semibold'>{reply.user?.name}</Link>
                                <span className='font-semibold text-gray-500' style={{ fontSize: '10px' }}> {comment.createdAt.substring(8, 10)}-{comment.createdAt.substring(5, 7)} at {comment.createdAt.substring(11, 16)}</span>
                              </div>
                              <p className='text-sm'>{reply.reply}</p>
                            </div>
                          </div>
                          <div className='flex flex-col justify-center items-center'>
                            {reply.user?._id === user?._id &&
                              <div>
                                <IconButton aria-label="settings" onClick={handleReplyClick}>
                                  <MoreVertIcon fontSize='small' />
                                </IconButton>

                                <Menu
                                  anchorEl={anchorElRep}
                                  open={Boolean(anchorElRep)}
                                  onClose={handleReplyClose}
                                >
                                  <MenuItem
                                    onClick={() => {
                                      handleReplyClose();
                                      handleDeleteReply(comment._id, reply._id)
                                    }}
                                    className='hover:text-red-500'
                                  >
                                    <DeleteIcon fontSize='small' />
                                  </MenuItem>
                                </Menu>
                              </div>}

                            {/*<IconButton aria-label="add to favorites" onClick={handleLike}>
                              {!liked ? <FavoriteBorderIcon fontSize='small' /> :
                                <FavoriteIcon fontSize='small' sx={{ color: 'red' }} />}
                            </IconButton>*/}
                          </div>
                        </div>
                      )) :
                      comment.replies.length > 0 &&
                      <div className='py-1'>
                        <span
                          className='text-sm font-semibold hover:border-b-2 border-black hover:cursor-pointer'
                          onClick={() => toggleReplies(comment._id)}
                        >
                          {comment.replies.length} more replies
                        </span>
                      </div>}

                    {/*Reply field*/}
                    <div className='flex'>
                      <input
                        type='text'
                        placeholder={`Reply to ${comment.user?.name || 'Outstagram user'}...(Upto 100 letters)`}
                        value={replies[comment._id] || ''} // Use the specific comment's reply
                        onChange={(e) => handleReplyChange(comment._id, e.target.value)} // Update reply for the specific comment
                        disabled={!comment.user}
                        className='w-full p-2 mt-1 mr-1 bg-gray-100 rounded-full focus:outline-none'
                        maxLength={100}
                      />
                      <IconButton
                        aria-label="send"
                        disabled={!replies[comment._id]} // Disable if the reply is empty
                        onClick={() => handleReply(comment._id)} // Send reply for the specific comment
                      >
                        <SendIcon fontSize='small' sx={{ color: `${!replies[comment._id] ? 'gray' : '#0099ff'}` }} />
                      </IconButton>
                    </div>
                  </div>
                </div>
              ))}
            </Box>
          </Modal>
          {/* Add Comment */}
          <CardActions disableSpacing sx={{ borderTop: '1px solid #bfbfbf' }}>
            <img
              src={user?.avatar?.url || userPic}
              alt="User"
              className="w-12 h-12 rounded-full"
            />
            <input type='text' placeholder='Add a comment...(Upto 100 latters)' value={comment} onChange={(e) => setComment(e.target.value)} className='w-full p-2 mx-2 bg-gray-100 rounded-full focus:outline-none' maxLength={100} />
            <IconButton aria-label="send" disabled={comment === ''} onClick={handleComment} >
              <SendIcon sx={{ color: `${comment === '' ? 'gray' : '#0099ff'}` }} />
            </IconButton>
          </CardActions>
        </Card>
      }
    </>
  );
}

PostCard.defaultProps = {
  editAndDelete: false
}
