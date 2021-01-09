/*-------------------------------
BINDING EXPRESS FRAMEWORK
-------------------------------*/
const express = require('express');

/*-------------------------------
BINDING MONGOOSE
-------------------------------*/
const mongoose = require('mongoose');

/*-------------------------------
IMPORT POST OBJECT
-------------------------------*/
const Post = require('./models/post');

/*-------------------------------
IMPORT POST ROUTER
-------------------------------*/
const postsRouter = require('./routes/posts');

/*-------------------------------
BINDING METHOD OVERRIDE
-------------------------------*/
//allows useing delte, put etc as methods to rather than only POST/GET
const methodOverride = require('method-override');

/*-------------------------------
BINDING EXPRESS TO APP VARIABLE
-------------------------------*/
const app = express();

/*----------------------
DB CONFIG
-----------------------*/
const db = require('./config/keys').MongoURI;
//Now I can connect to mongo

/*----------------------
CONNECT TO MONGO
-----------------------*/
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
//promise
.then(() => console.log('Mongo DB connected'))
.catch(err => console.log(err));

/*-------------------------------
SETTING VIEW ENGINE FOR TEMPLATING
-------------------------------*/
// As I want actual HTML to get rendered on my page: I set up the ejs view engine here
app.set('view engine', 'ejs');
// Now I can create my VIEWS folder and put my first index.ejs in it

/*-------------------------------
ACCESS PUBLIC FOLDER
-------------------------------*/
app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/img', express.static(__dirname + 'public/img'));
app.use('/js', express.static(__dirname + 'public/js'));
/*-------------------------------
PROVIDE ACCESS TO HTML FORM
-------------------------------*/
app.use(express.urlencoded({ extended: false }));
// now I can access everything within the body obj of the form

/*-------------------------------
ALLOW USING OVERRIDE DEPENDENCY
-------------------------------*/
app.use(methodOverride('_method'));
//Whenever I set parameter _method in any kind of form situation this is going to override method

/*-------------------------------
CREATE POST SPAWN ROUTE
-------------------------------*/
//sets up a route to my main/index route  || req = Request ; res = Response
//Basically sending requests to the server and getting response from the server
// async function -> dont forget about await
app.get('/', async (req, res) => {
  const posts = await Post.find().sort({ createdAt: 'desc' });
  res.render('posts/index', { posts: posts });
}); 

/*-------------------------------
TELL APP TO USE ROUTER
-------------------------------*/
app.use('/posts', postsRouter);

/*-------------------------------
PORT
-------------------------------*/
const PORT = process.env.PORT || 5000;

/*-------------------------------
SETTING UP SERVER
-------------------------------*/
//doing that by calling the listen function on our app var. Which actually is the root of our application
app.listen(PORT, () => console.log(`Runs on Port ${PORT}`));
//Routes need to be setted.. at least to my index site