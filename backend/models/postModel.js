const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  caption: String,

  images: [
    {
      public_id: String,
      url: String,
    },
  ],

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      comment: {
        type: String,
        required: true,
      },
      likes: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        }
      ],
      replies: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          reply: {
            type: String,
            required: true,
          },
          likes: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
            }
          ],
          createdAt: {
            type: Date,
            default: Date.now,
          }
        }
      ],
      createdAt: {
        type: Date,
        default: Date.now,
      }
    },
  ],

  saves: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

module.exports = mongoose.model("Post", postSchema);
