const User = require("../models/userModel");
const Post = require("../models/postModel");
const { sendEmail } = require("../middlewares/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

// Register a user
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const check = await User.findOne({ email });

    if (check) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    /*const myCloud = await cloudinary.v2.uploader.upload(avatar, {
      folder: "avatars",
    });*/

    const user = await User.create({
      name,
      email,
      password,
      /*avatar: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url
      },*/
    });

    const token = await user.generateToken();

    /*const options = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.status(201).cookie("token", token, options).json({
      success: true,
      user,
      token,
    });*/

    // Notification for account create
    user.notifications.unshift({
      type: "other",
      message: "Account has been created successfully.",
    })

    user.newNotifications = user.newNotifications + 1;

    await user.save();

    //Should be replaced by cookies...
    res.status(201).json({
      success: true,
      user,
      token,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password").populate("posts followers following");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }

    const token = await user.generateToken();

    /*const options = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.status(200).cookie("token", token, options).json({
      success: true,
      user,
      token,
    });*/

    //Should be replaced by cookies...
    res.status(200).json({
      success: true,
      user,
      token,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Logout user
exports.logout = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", null, { expires: new Date(Date.now()), httpOnly: true })
      .json({
        success: true,
        message: "Logged out",
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get my profile
exports.myProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "posts followers following notifications.user saves requests requested"
    );

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const resetPasswordToken = user.getResetPasswordToken();

    await user.save();

    /*const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/password/reset/${resetPasswordToken}`;*/

    const resetUrl = `http://localhost:3000/reset-password/${resetPasswordToken}`;

    const message = `Reset your password by clicking on the link below: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Social Media Password Recovery",
        message,
      });

      res.status(200).json({
        success: true,
        message: `Email sent to ${user.email} successfully`,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid or has expired",
      });
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password dose not matched",
      })
    }

    user.password = req.body.newPassword;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    // Notification for reset password
    user.notifications.unshift({
      type: "other",
      message: "Account recovered successfully.",
    })

    user.newNotifications = user.newNotifications + 1;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password Updated Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update password
exports.updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("+password");

    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide old and new passwords",
      });
    }

    const isMatch = await user.matchPassword(oldPassword);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect old password",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password dose not match",
      })
    }

    user.password = newPassword;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password Updated Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const { name, bio, email, avatar } = req.body;

    if (name) {
      user.name = name;
    }

    if (bio) {
      user.bio = bio;
    }

    if (email) {
      user.email = email;
    }

    if (avatar) {
      if (user.avatar.public_id) {
        await cloudinary.v2.uploader.destroy(user.avatar.public_id);
      }
      //await cloudinary.v2.uploader.destroy(user.avatar.public_id);

      const myCloud = await cloudinary.v2.uploader.upload(avatar, {
        folder: "avatars",
      });

      user.avatar.public_id = myCloud.public_id;
      user.avatar.url = myCloud.secure_url;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Follow User
exports.followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const loggedInUser = await User.findById(req.user._id);

    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (loggedInUser.following.includes(userToFollow._id)) {
      const indexfollowing = loggedInUser.following.indexOf(userToFollow._id);
      const indexfollowers = userToFollow.followers.indexOf(loggedInUser._id);

      loggedInUser.following.splice(indexfollowing, 1);
      userToFollow.followers.splice(indexfollowers, 1);

      await loggedInUser.save();
      await userToFollow.save();

      res.status(200).json({
        success: true,
        message: "User Unfollowed",
      });
    } else {
      if (!userToFollow.profileLock) {
        // Notification for follows
        userToFollow.notifications.unshift({
          type: "follow",
          message: "started following you.",
          user: req.user._id,
        })

        userToFollow.newNotifications = userToFollow.newNotifications + 1;

        loggedInUser.following.push(userToFollow._id);
        userToFollow.followers.push(loggedInUser._id);

        await loggedInUser.save();
        await userToFollow.save();

        res.status(200).json({
          success: true,
          message: "User followed",
        });
      } else {
        if (loggedInUser.requested.includes(userToFollow._id)) {
          const indexRequested = loggedInUser.requested.indexOf(userToFollow._id);
          const indexRequests = userToFollow.requests.indexOf(loggedInUser._id);

          loggedInUser.requested.splice(indexRequested, 1);
          userToFollow.requests.splice(indexRequests, 1);

          await loggedInUser.save();
          await userToFollow.save();

          res.status(200).json({
            success: true,
            message: "Requeste canceled",
          });
        } else {
          userToFollow.newRequests = userToFollow.newRequests + 1;

          loggedInUser.requested.push(userToFollow._id);
          userToFollow.requests.push(loggedInUser._id);

          await loggedInUser.save();
          await userToFollow.save();

          res.status(200).json({
            success: true,
            message: "Request sent",
          });
        }
      }
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Get Requests
exports.getRequests = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const requests = [];

    for (let i = 0; i < user.requests.length; i++) {
      const iUser = await User.findById(user.requests[i]);
      requests.push(iUser);
    }

    res.status(200).json({
      success: true,
      requests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Accept Follow Request
exports.acceptFollowRequest = async (req, res) => {
  try {
    const whoSentFollowReq = await User.findById(req.params.id);
    const loggedInUser = await User.findById(req.user._id);

    if (!whoSentFollowReq) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Notification for follows
    whoSentFollowReq.notifications.unshift({
      type: "follow",
      message: "started following you.",
      user: req.user._id,
    })

    loggedInUser.notifications.unshift({
      type: "follow",
      message: "started following you.",
      user: req.params.id,
    })

    whoSentFollowReq.newNotifications = whoSentFollowReq.newNotifications + 1;
    loggedInUser.newNotifications = loggedInUser.newNotifications + 1;

    //Remove reqs
    const indexRequested = whoSentFollowReq.requested.indexOf(loggedInUser._id);
    const indexRequests = loggedInUser.requests.indexOf(whoSentFollowReq._id);

    loggedInUser.requests.splice(indexRequests, 1);
    whoSentFollowReq.requested.splice(indexRequested, 1);

    // And follow each other
    loggedInUser.followers.push(whoSentFollowReq._id);
    loggedInUser.following.push(whoSentFollowReq._id);
    whoSentFollowReq.followers.push(loggedInUser._id);
    whoSentFollowReq.following.push(loggedInUser._id);

    await loggedInUser.save();
    await whoSentFollowReq.save();

    res.status(200).json({
      success: true,
      message: "Request accepted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Ignore Follow Request
exports.ignoreFollowRequest = async (req, res) => {
  try {
    const whoSentFollowReq = await User.findById(req.params.id);
    const loggedInUser = await User.findById(req.user._id);

    if (!whoSentFollowReq) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    //Remove reqs
    const indexRequested = whoSentFollowReq.requested.indexOf(loggedInUser._id);
    const indexRequests = loggedInUser.requests.indexOf(whoSentFollowReq._id);

    loggedInUser.requests.splice(indexRequests, 1);
    whoSentFollowReq.requested.splice(indexRequested, 1);

    await loggedInUser.save();
    await whoSentFollowReq.save();

    res.status(200).json({
      success: true,
      message: "Request removed",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Clear Requests
exports.clearRequests = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.newRequests = 0;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Request Cleared Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Profile
exports.deleteMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const posts = user.posts;
    const followers = user.followers;
    const following = user.following;
    const requests = user.requests;
    const requested = user.requested;
    const userId = user._id;

    // Removing Avatar from cloudinary
    if (user.avatar.public_id) {
      await cloudinary.v2.uploader.destroy(user.avatar.public_id);
    }

    await user.deleteOne();

    // Logout user after deleting profile
    /*res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });*/

    // Delete all posts of the user
    for (let i = 0; i < posts.length; i++) {
      const post = await Post.findById(posts[i]);
      if (post.images) {
        for (let i = 0; i < post.images.length; i++) {
          await cloudinary.v2.uploader.destroy(post.images[i].public_id);
        }
      }
      await post.deleteOne();
    }

    // Removing User from Followers Following
    for (let i = 0; i < followers.length; i++) {
      const follower = await User.findById(followers[i]);

      const index = follower.following.indexOf(userId);
      follower.following.splice(index, 1);
      await follower.save();
    }

    // Removing User from Following's Followers
    for (let i = 0; i < following.length; i++) {
      const follows = await User.findById(following[i]);

      const index = follows.followers.indexOf(userId);
      follows.followers.splice(index, 1);
      await follows.save();
    }

    // Removing User from Requests Requested
    for (let i = 0; i < requests.length; i++) {
      const request = await User.findById(requests[i]);

      const index = request.requested.indexOf(userId);
      request.requested.splice(index, 1);
      await request.save();
    }

    // Removing User from Requested's Requests
    for (let i = 0; i < requested.length; i++) {
      const request = await User.findById(requested[i]);

      const index = request.requests.indexOf(userId);
      request.requests.splice(index, 1);
      await request.save();
    }

    // removing all comments of the user from all posts
    const allPosts = await Post.find();

    for (let i = 0; i < allPosts.length; i++) {
      const post = await Post.findById(allPosts[i]._id);

      for (let j = 0; j < post.comments.length; j++) {
        if (post.comments[j].user === userId) {
          post.comments.splice(j, 1);
        }
      }
      await post.save();
    }

    // removing all likes of the user from all posts
    for (let i = 0; i < allPosts.length; i++) {
      const post = await Post.findById(allPosts[i]._id);

      for (let j = 0; j < post.likes.length; j++) {
        if (post.likes[j] === userId) {
          post.likes.splice(j, 1);
        }
      }
      await post.save();
    }

    res.status(200).json({
      success: true,
      message: "Profile Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate(
      "posts followers following saves requests requested"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get users by searching
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({
      name: { $regex: req.query.name, $options: "i" },
    });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get my posts
exports.getMyPosts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const posts = [];

    for (let i = 0; i < user.posts.length; i++) {
      const post = await Post.findById(user.posts[i]).populate(
        "likes comments.user comments.replies.user saves owner"
      );

      posts.push(post);
    }

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get user posts
exports.getUserPosts = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    const posts = [];

    for (let i = 0; i < user.posts.length; i++) {
      const post = await Post.findById(user.posts[i]).populate(
        "likes comments.user comments.replies.user saves owner"
      );

      posts.push(post);
    }

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Notifications
exports.getNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const notifications = [];

    for (let i = 0; i < user.notifications.length; i++) {
      const iUser = await User.findById(user.notifications[i].user).populate(
        "posts followers following saves requests requested"
      );

      if (user.notifications.post !== null) {
        const post = await Post.findById(user.notifications[i].post).populate(
          "likes comments.user comments.replies.user saves owner"
        );

        let tmpNotification = user.notifications[i];

        tmpNotification.post = post;

        tmpNotification.user = iUser;

        notifications.push(tmpNotification);
      } else {
        let tmpNotification = user.notifications[i];

        tmpNotification.user = iUser;

        notifications.push(tmpNotification);
      }
    }

    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Remove Notification
exports.removeNotification = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    let index;

    for (let i = 0; i < user.notifications.length; i++) {
      if (req.params.id.toString() === user.notifications[i]._id.toString()) {
        index = i;
      }
    }

    user.notifications.splice(index, 1);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Notification Removed Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Clear Notification
exports.clearNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.newNotifications = 0;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Notification Cleared Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get saved posts
exports.getSavedPosts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const saves = [];

    for (let i = 0; i < user.saves.length; i++) {
      const post = await Post.findById(user.saves[i]).populate(
        "likes comments.user comments.replies.user saves owner"
      );

      saves.push(post);
    }

    res.status(200).json({
      success: true,
      saves: saves.reverse(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Profile Lock
exports.profileLock = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.profileLock = req.body.isChecked;

    await user.save();

    if (req.body.isChecked) {
      res.status(200).json({
        success: true,
        message: "Profile Locked Successfully",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Profile Unlocked Successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
