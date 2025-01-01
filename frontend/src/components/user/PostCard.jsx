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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import img from '../../assets/img.jpg'
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createComment, deleteComment, deletePost, likeAndUnlikePost } from '../../features/postSlice';
import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Loader from '../layout/Loader';
import { loadUser } from '../../features/userSlice';

export default function PostCard(props) {
  const { post, editAndDelete, getPosts } = props

  const naigate = useNavigate();

  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);
  const { isLoading, postInfo, error } = useSelector(state => state.post);

  //Post liked or not by the user
  const [liked, setLiked] = React.useState(false);

  const handleLike = () => {
    dispatch(likeAndUnlikePost(post._id));
    setLiked(!liked);
    getPosts();
  }

  //Comment state and function
  const [comment, setComment] = React.useState('');

  const handleComment = () => {
    dispatch(createComment({ id: post._id, comment }));

    if (postInfo?.success) {
      setComment('');
      getPosts();
    }
  };

  //Modal style
  const style = {
    position: 'absolute',
    top: '15%',
    left: '50%',
    right: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
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
  const handleCommentsModalClose = () => setOpenComments(false);

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
  const handleDeleteComment = (commentId) => {
    dispatch(deleteComment({ id: post._id, commentId }));
    getPosts();
  };

  console.log(post);

  React.useEffect(() => {
    //Checking if the post is liked by the user
    if (post?.likes.find(like => like._id === user?._id)) {
      setLiked(true);
    }
  }, [post]);

  return (
    <>
      {isLoading ? <Loader /> :
        <Card sx={{ width: '100%', justifySelf: 'center', border: '1px solid #bfbfbf' }}>
          {/* Card Header */}
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                {post?.owner?.name.charAt(0).toUpperCase()}
              </Avatar>
            }
            action={editAndDelete &&
              <IconButton aria-label="settings" onClick={handleClick}>
                <MoreVertIcon />
              </IconButton>
            }
            title={<span className='text-lg font-semibold'>{post?.owner?.name}</span>}
            subheader={post?.createdAt}
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
                //onEdit(post._id);
              }}
            >
              <EditNoteIcon />
              <span className='text-blue-500'>Edit</span>
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClose();
                handleDelete();
                //onDelete(post._id);
              }}
            >
              <DeleteIcon />
              <span className='text-red-500'>Delete</span>
            </MenuItem>
          </Menu>
          {/* Card Media */}
          <CardMedia
            component="img"
            height="194"
            image={post?.image?.url}
            alt="Post image"
          />
          {/* Card Content */}
          <CardContent>
            <Typography variant="body1">
              {post?.caption}
            </Typography>
          </CardContent>
          {/* Card likes and comments summery */}
          <CardContent>
            <Typography variant="div" color="text.secondary" sx={{ marginRight: '10px', cursor: 'pointer' }} onClick={handleLikesModalOpen}>
              {post?.likes.length} likes
            </Typography>
            <Typography variant="div" color="text.secondary" sx={{ cursor: 'pointer' }} onClick={handleCommentsModalOpen}>
              {post?.comments.length} comments
            </Typography>
          </CardContent>
          {/* Card Actions */}
          <CardActions disableSpacing sx={{ display: 'flex', justifyContent: 'space-around', borderTop: '1px solid #bfbfbf' }}>
            <IconButton aria-label="add to favorites" onClick={handleLike}>
              {!liked ? <FavoriteBorderIcon /> :
                <FavoriteIcon sx={{ color: 'red' }} />}
              <span className='ml-2'>{post?.likes.length}</span>
            </IconButton>
            <IconButton aria-label="add to favorites" onClick={handleCommentsModalOpen}>
              <CommentIcon />
              <span className='ml-2'>{post?.comments.length}</span>
            </IconButton>
            <IconButton aria-label="share">
              <ShareIcon />
              <span className='ml-2'>{post?.shares?.length || 0}</span>
            </IconButton>
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
                Liked by
              </Typography>
              {post?.likes.map((like, index) => (
                <div className='flex justify-between items-center border-b-2 py-3' key={index}>
                  <div className='flex items-center'>
                    <img src={like.avatar?.url} alt='User' width='50' style={{ borderRadius: '50%' }} />
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
              {post?.comments.map((comment, index) => (
                <div className='flex justify-between items-center border-b-2 py-3' key={index}>
                  <div className='flex items-center'>
                    <img src={comment.user.avatar?.url} alt='User' width='50' style={{ borderRadius: '50%' }} />
                    <div className='mx-3'>
                      <Link to={`/profile/${comment.user._id}`} className='font-semibold'>{comment.user.name}</Link>
                      <p>{comment.comment}</p>
                    </div>
                  </div>
                  {comment.user._id === user?._id &&
                    <IconButton aria-label="send" onClick={() => handleDeleteComment(comment._id)} >
                      <DeleteIcon color='error' />
                    </IconButton>}
                </div>
              ))}
            </Box>
          </Modal>
          {/* Add Comment */}
          <CardActions disableSpacing sx={{ borderTop: '1px solid #bfbfbf' }}>
            <img src={user?.avatar?.url} alt='User' width='50' style={{ borderRadius: '50%' }} />
            <input type='text' placeholder='Add a comment...(Upto 100 latters)' value={comment} onChange={(e) => setComment(e.target.value)} className='w-full p-2 bg-gray-100 rounded-full focus:outline-none' maxLength={100} />
            <IconButton aria-label="send" onClick={handleComment} >
              <SendIcon sx={{ color: '#0099ff' }} />
            </IconButton>
          </CardActions>
        </Card>}</>
  );
}

PostCard.defaultProps = {
  editAndDelete: false
}
