const express = require("express");
const {
  register,
  login,
  followUser,
  logout,
  updatePassword,
  updateProfile,
  deleteMyProfile,
  myProfile,
  getUserProfile,
  getAllUsers,
  forgotPassword,
  resetPassword,
  getMyPosts,
  getUserPosts,
  removeNotification,
  profileLock,
  clearNotifications,
  acceptFollowRequest,
  ignoreFollowRequest,
  clearRequests,
  getNotifications,
  getSavedPosts,
  getRequests,
} = require("../controllers/userControllers");
const { isAuthenticated } = require("../middlewares/auth");

const router = express.Router();

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/logout").get(logout);

router.route("/follow/:id").get(isAuthenticated, followUser);

router.route("/request").get(isAuthenticated, getRequests);

router.route("/request/accept/:id").get(isAuthenticated, acceptFollowRequest);

router.route("/request/ignore/:id").get(isAuthenticated, ignoreFollowRequest);

router.route("/request/clear").put(isAuthenticated, clearRequests);

router.route("/update/password").put(isAuthenticated, updatePassword);

router.route("/update/profile").put(isAuthenticated, updateProfile);

router.route("/delete/me").delete(isAuthenticated, deleteMyProfile);

router.route("/me").get(isAuthenticated, myProfile);

router.route("/my/posts").get(isAuthenticated, getMyPosts);

router.route("/userposts/:id").get(isAuthenticated, getUserPosts);

router.route("/user/:id").get(isAuthenticated, getUserProfile);

router.route("/users").get(isAuthenticated, getAllUsers);

router.route("/forgot/password").post(forgotPassword);

router.route("/password/reset/:token").put(resetPassword);

router.route("/notification")
  .get(isAuthenticated, getNotifications)
  .put(isAuthenticated, clearNotifications);

router.route("/notification/:id").delete(isAuthenticated, removeNotification);

router.route("/saved/posts").get(isAuthenticated, getSavedPosts);

router.route("/profile/lock").put(isAuthenticated, profileLock);

module.exports = router;
