const express = require("express");
const {
  createPost,
  likeAndUnlikePost,
  deletePost,
  getPostOfFollowing,
  updatePost,
  commentOnPost,
  deleteComment,
  replyToComment,
  deleteReply,
  saveAndUnsavePost,
} = require("../controllers/postControllers");
const { isAuthenticated } = require("../middlewares/auth");

const router = express.Router();

router.route("/post/upload").post(isAuthenticated, createPost);

router
  .route("/post/:id")
  .get(isAuthenticated, likeAndUnlikePost)
  .put(isAuthenticated, updatePost)
  .delete(isAuthenticated, deletePost);

router
  .route("/post/save/:id")
  .get(isAuthenticated, saveAndUnsavePost)

router.route("/posts").get(isAuthenticated, getPostOfFollowing);

router
  .route("/post/comment/:id")
  .put(isAuthenticated, commentOnPost)
  .delete(isAuthenticated, deleteComment);

router
  .route("/post/comment/reply/:id")
  .post(isAuthenticated, replyToComment)
  .delete(isAuthenticated, deleteReply);

module.exports = router;
