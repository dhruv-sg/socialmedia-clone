const express = require("express");
const router = express.Router();
const Post = require("../model/postSchema");
const upload = require("../middleware/upload");
const { authmiddleware } = require("../auth");

// 📌 Create Post (with image upload)
router.post("/create", authmiddleware, upload.single("image"), async (req, res) => {
  try {
    const { description } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    const newPost = new Post({
      image: req.file.filename, // store filename
      description,
      user: req.user.id,
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// // 📌 Get All Posts
// router.get("/all", authmiddleware, async (req, res) => {
//   try {
//     const posts = await Post.find()
//       .populate("user", "name email")
//       .populate("comments.user", "name email")
//       .sort({ createdAt: -1 });
//     res.status(200).json(posts);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

router.get("/all", authmiddleware, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name email")
      .populate("comments.user", "name email")
      .sort({ createdAt: -1 });

    const cleanPosts = posts.map(post => ({
      ...post.toObject(),
      user: {
        _id: post.user._id,
        name: post.user.name,
        email: post.user.email
      },
      likes: post.likes.length, // optional: return count instead of array
    }));

    res.status(200).json(cleanPosts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// 📌 Like / Unlike Post
router.post("/:id/like", authmiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ error: "Post not found" });

    const alreadyLiked = post.likes.includes(req.user.id);

    if (alreadyLiked) {
      post.likes.pull(req.user.id);
      await post.save();
      return res.json({ message: "Post unliked", likes: post.likes.length });
    } else {
      post.likes.push(req.user.id);
      await post.save();
      return res.json({ message: "Post liked", likes: post.likes.length });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 📌 Add Comment
router.post("/:id/comment", authmiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Comment text required" });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    post.comments.push({ user: req.user.id, text });
    await post.save();

    res.json({ message: "Comment added", comments: post.comments });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
