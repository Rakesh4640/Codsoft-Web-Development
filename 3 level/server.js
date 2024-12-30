const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/bloggingPlatform', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Schema Definitions
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const PostSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String,
});

const CommentSchema = new mongoose.Schema({
  postId: mongoose.Schema.Types.ObjectId,
  comment: String,
  author: String,
});

// Models
const User = mongoose.model('User', UserSchema);
const Post = mongoose.model('Post', PostSchema);
const Comment = mongoose.model('Comment', CommentSchema);

// Helper function to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(403).send('Access denied');

  jwt.verify(token, 'secretKey', (err, user) => {
    if (err) return res.status(403).send('Invalid token');
    req.user = user;
    next();
  });
};

// Routes

// Register new user
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const user = new User({ username, email, password });
  await user.save();
  res.status(201).send('User registered');
});

// Login user
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || user.password !== password) {
    return res.status(400).send('Invalid credentials');
  }

  const token = jwt.sign({ id: user._id }, 'secretKey');
  res.status(200).json({ token });
});

// Get all blog posts
app.get('/posts', async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
});

// Create a new blog post
app.post('/posts', verifyToken, async (req, res) => {
  const { title, content } = req.body;
  const post = new Post({ title, content, author: req.user.id });
  await post.save();
  res.status(201).json(post);
});

// Add a comment
app.post('/comments', verifyToken, async (req, res) => {
  const { postId, comment } = req.body;
  const newComment = new Comment({ postId, comment, author: req.user.id });
  await newComment.save();
  res.status(201).json(newComment);
});

// Search posts
app.get('/search', async (req, res) => {
  const query = req.query.q;
  const posts = await Post.find({ title: new RegExp(query, 'i') });
  res.json(posts);
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
