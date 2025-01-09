const Post = require("../models/postModel");
const User = require("../models/userModel");
const cloudinary = require("cloudinary");

// Create post
exports.createPost = async (req, res) => {
  try {
    const { image, caption } = req.body

    if (image !== '') {
      const myCloud = await cloudinary.v2.uploader.upload(image, {
        folder: "posts",
      });

      const newPostData = {
        caption: caption,
        image: {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        },
        owner: req.user._id,
      };

      const post = await Post.create(newPostData);

      const user = await User.findById(req.user._id);

      user.posts.unshift(post._id);

      await user.save();
    } else {
      const newPostData = {
        caption: caption,
        owner: req.user._id,
      };

      const post = await Post.create(newPostData);

      const user = await User.findById(req.user._id);

      user.posts.unshift(post._id);

      await user.save();
    }

    res.status(201).json({
      success: true,
      message: "Post created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (post.image.public_id) {
      await cloudinary.v2.uploader.destroy(post.image.public_id);
    }

    await post.deleteOne();

    const user = await User.findById(req.user._id);

    const index = user.posts.indexOf(req.params.id);

    user.posts.splice(index, 1);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Like and unlike post
exports.likeAndUnlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.likes.includes(req.user._id)) {
      const index = post.likes.indexOf(req.user._id);

      post.likes.splice(index, 1);

      await post.save();

      return res.status(200).json({
        success: true,
        message: "Post Unliked",
      });
    } else {
      // Notification for likes
      if (post.owner.toString() !== req.user._id.toString()) {
        const user = await User.findById(post.owner);

        user.notifications.unshift({
          type: "like",
          message: "liked your post.",
          user: req.user._id,
          post: post._id,
        });

        user.save();
      }

      post.likes.push(req.user._id);

      await post.save();

      return res.status(200).json({
        success: true,
        message: "Post Liked",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get posts of the followings
exports.getPostOfFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const posts = await Post.find({
      owner: {
        $in: user.following,
      },
    }).populate("owner likes comments.user comments.replies.user");

    res.status(200).json({
      success: true,
      posts: posts.reverse(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update post
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    const { image, caption } = req.body;

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (post.image.public_id) {
      await cloudinary.v2.uploader.destroy(post.image.public_id);
    }

    if (image !== '') {
      const myCloud = await cloudinary.v2.uploader.upload(image, {
        folder: "posts",
      });

      post.image = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      }

      post.caption = caption;

      await post.save();
    } else {
      post.caption = caption;

      await post.save();
    }

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Comment on post
exports.commentOnPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Code for one user one comment
    /*let commentIndex = -1;

    // Checking if comment already exists
    post.comments.forEach((item, index) => {
      if (item.user.toString() === req.user._id.toString()) {
        commentIndex = index;
      }
    });

    if (commentIndex !== -1) {
      // Notification for comments
      if (post.owner.toString() !== req.user._id.toString()) {
        const user = await User.findById(post.owner);

        user.notifications.unshift({
          type: "comment",
          message: "commented in your post.",
          user: req.user._id,
          post: post._id,
        });

        user.save();
      }

      post.comments[commentIndex].comment = req.body.comment;

      await post.save();

      return res.status(200).json({
        success: true,
        message: "Comment Updated",
      });
    } else {
      // Notification for comments
      if (post.owner.toString() !== req.user._id.toString()) {
        const user = await User.findById(post.owner);

        user.notifications.unshift({
          type: "comment",
          message: "commented in your post.",
          user: req.user._id,
          post: post._id,
        });

        user.save();
      }

      post.comments.push({
        user: req.user._id,
        comment: req.body.comment,
      });

      await post.save();

      return res.status(200).json({
        success: true,
        message: "Comment added",
      });
    }*/

    // Code for one user multiple comments
    // Notification for comments
    if (post.owner.toString() !== req.user._id.toString()) {
      const user = await User.findById(post.owner);

      user.notifications.unshift({
        type: "comment",
        message: "commented in your post.",
        user: req.user._id,
        post: post._id,
      });

      user.save();
    }

    post.comments.push({
      user: req.user._id,
      comment: req.body.comment,
    });

    await post.save();

    return res.status(200).json({
      success: true,
      message: "Comment added",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete comment
exports.deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Checking If owner wants to delete
    if (post.owner.toString() === req.user._id.toString()) {
      if (req.body.commentId === undefined) {
        return res.status(400).json({
          success: false,
          message: "Comment Id is required",
        });
      }

      post.comments.forEach((item, index) => {
        if (item._id.toString() === req.body.commentId.toString()) {
          return post.comments.splice(index, 1);
        }
      });

      await post.save();

      return res.status(200).json({
        success: true,
        message: "Selected Comment has deleted",
      });
    } else {
      post.comments.forEach((item, index) => {
        if (item.user.toString() === req.user._id.toString()) {
          return post.comments.splice(index, 1);
        }
      });

      await post.save();

      return res.status(200).json({
        success: true,
        message: "Your Comment has deleted",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Reply to a comment
exports.replyToComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Code for one user one comment and one reply
    let commentIndex = -1;
    let replyIndex = -1;

    // Checking if reply already exists
    post.comments.forEach((comment, index) => {
      if (comment._id.toString() === req.body.commentId.toString()) {
        commentIndex = index

        comment.replies.forEach((reply, index) => {
          if (reply.user.toString() === req.user._id.toString()) {
            replyIndex = index;
          }
        })
      }
    });

    /*if (replyIndex !== -1) {
      // Notification for reply
      if (post.owner.toString() !== req.user._id.toString()) {
        const user = await User.findById(post.owner);

        user.notifications.unshift({
          type: "reply",
          message: "replyed in your post.",
          user: req.user._id,
          post: post._id,
        });

        user.save();
      }

      post.comments[commentIndex].replies[replyIndex].reply = req.body.reply;

      await post.save();

      return res.status(200).json({
        success: true,
        message: "Reply Updated",
      });
    } else {
      // Notification for reply
      if (post.owner.toString() !== req.user._id.toString()) {
        const user = await User.findById(post.owner);

        user.notifications.unshift({
          type: "reply",
          message: "replyed in your post.",
          user: req.user._id,
          post: post._id,
        });

        user.save();
      }

      post.comments[commentIndex].replies.push({
        user: req.user._id,
        reply: req.body.reply,
      });

      await post.save();

      return res.status(200).json({
        success: true,
        message: "Reply added",
      });
    }*/

    // Code for one user one comment and multiple replies
    // Notification for reply
    if (post.owner.toString() !== req.user._id.toString()) {
      const user = await User.findById(post.owner);

      user.notifications.unshift({
        type: "reply",
        message: "replyed in your post.",
        user: req.user._id,
        post: post._id,
      });

      user.save();
    }

    post.comments[commentIndex].replies.push({
      user: req.user._id,
      reply: req.body.reply,
    });

    await post.save();

    return res.status(200).json({
      success: true,
      message: "Reply added",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete reply
exports.deleteReply = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Checking If owner wants to delete
    if (post.owner.toString() === req.user._id.toString()) {
      if (req.body.commentId === undefined) {
        return res.status(400).json({
          success: false,
          message: "Comment Id is required",
        });
      }

      if (req.body.replyId === undefined) {
        return res.status(400).json({
          success: false,
          message: "Reply Id is required",
        });
      }

      post.comments.forEach((comment, index) => {
        if (comment._id.toString() === req.body.commentId.toString()) {
          comment.replies.forEach((reply, index) => {
            if (reply._id.toString() === req.body.replyId.toString()) {
              return comment.replies.splice(index, 1);
            }
          })
        }
      });

      await post.save();

      return res.status(200).json({
        success: true,
        message: "Selected Reply has deleted",
      });
    } else {
      post.comments.forEach((comment, index) => {
        if (comment._id.toString() === req.body.commentId.toString()) {
          comment.replies.forEach((reply, index) => {
            if (reply._id.toString() === req.body.replyId.toString()) {
              return comment.replies.splice(index, 1);
            }
          })
        }
      });

      await post.save();

      return res.status(200).json({
        success: true,
        message: "Your Reply has deleted",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
