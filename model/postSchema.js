const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    image: {
      type: String, // store filename/path
      required: [true, "image is required"],
    },
    description: {
      type: String,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);
postSchema.set("toJSON",{
    transform:function(doc,ret){
        ret.createdAt = new Date(ret.createdAt).toLocaleString();
        ret.updatedAt = new Date(ret.updatedAt).toLocaleString();
        return ret;
    }
})

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
