/*-------------------------------
THIS FOLDER HANDLES ALL MY ROUTES
-------------------------------*/
// with my routes I can handle different serverside requests
// also I can determine which kind of response should be send back
// such like rendering a new site
// basically telling the templating engine what to render in what kind of context

/*-------------------------------
BIND EXPRESS
-------------------------------*/
const express = require('express');

/*-------------------------------
IMPORTS MY POST SCHEMA
-------------------------------*/
//actualy importing an object which is passed to MongoDB
// Allows me to access DB data
const Post = require('../models/post');

/*-------------------------------
INIT THE ROUTER FUNCTION ON A VARIABLE
-------------------------------*/
//This is a feature coming with express which helps making route handling much easier
const router = express.Router();

/*-------------------------------
GET ROUTE TO NEW POSTS
-------------------------------*/
// allows me to render the new post page as soon as user clicks new post button
router.get('/new', (req, res) => {
  res.render('posts/new', { post: new Post() });
});

/*-------------------------------
EDIT POST ROUTE
-------------------------------*/
// allows me to get acess to the edit page
// renders in the contenrt of the post I want to edit
//this is a asynchronous process
// async / await make it possible to handle async processes with JS even tho JS on its own is sync
router.get('/edit/:id', async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.render('posts/edit', { post: post });
});

/*-------------------------------
MAKE SLUGS WORK
-------------------------------*/
// Access a page via slugified url
router.get('/:slug', async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug });
  if (post === null) res.redirect('/');
  res.render('posts/show', { post: post });
});

/*-------------------------------
MAKE NEW POST AND ADD TO DB
-------------------------------*/
router.post('/', async (req, res, next) => {
  req.post = new Post();
  next();
}, saveArticleAndRedirect('new'));

/*-------------------------------
ACTUALLY EDIT A POST AND SAFE CHANGED VERSION TO DB
-------------------------------*/
router.put('/:id', async (req, res, next) => {
  req.post = await Post.findById(req.params.id);
  next();
}, saveArticleAndRedirect('edit'));

/*-------------------------------
MANAGES TO DELETE A POST
-------------------------------*/
router.delete('/:id', async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

/*-------------------------------
FUNCTION TO SAVE POST 
-------------------------------*/
//since this is needed posting new content and saving edited conted I put this in an extra function
//invoking this function above
function saveArticleAndRedirect(path) {
  return async (req, res) => {
    let post = req.post;
    post.title = req.body.title;
    post.teaser = req.body.teaser;
    post.goal = req.body.goal;
    post.process = req.body.process;
    post.outcome = req.body.outcome;
    try {
      post = await post.save()
      res.redirect(`/posts/${post.slug}`);
    } catch (e) {
      res.render(`posts/${path}`, { post: post });
    }
  }
}

/*-------------------------------
EXPORT ROUTER
-------------------------------*/
module.exports = router;