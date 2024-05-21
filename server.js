/* Import packages
-------------------------------------------------- */
const dotenv = require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const path = require('path')
const User = require('./models/user.js');


/* Create and configure Express app
-------------------------------------------------- */
// initialize the express app from the express package
const app = express();
// configure express to use EJS and look in the "views" folder
app.set('view engine', 'ejs');
// Set the port from environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : '3000';

// connect to MongoDB Atlas with mongoose
mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB Atlas at ${mongoose.connection.name}`);
});

// import controllers
const authController = require('./controllers/auth.js');
const comicsController = require('./controllers/comics.js');
const usersController = require('./controllers/users.js');



/* Middleware
-------------------------------------------------- */
// import custom middleware
const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');


if (process.env.ON_HERKOU === 'false') {
  app.use(morgan('dev'))
}
// Used to parse request bodies from PUT/PATCH/POST requests
app.use(express.urlencoded({ extended: false }))
// Allow HTML forms to send PUT/DELETE requests instead of just GET or POST
app.use(methodOverride('_method'))
// Set up session management
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}))
app.use(passUserToView)
app.use(express.static(path.join(__dirname, 'public')))
/* Routes
-------------------------------------------------- */
// Home Page
app.get('/', (req, res) => {
  res.render('index');
});


// comic list page
app.get('/users/:userId/comic-list', async (req, res) => {
    
  const currentUser = await User.findById(req.session.user._id);
  const currentPage = await User.findById(req.params.userId)
  res.render('comics/index', { comics: currentPage.comic, currentUser: currentUser, currentPage: currentPage})
})


// Use the "auth" controller for all routes begininng with "/auth"
app.use('/auth', authController);
app.use(isSignedIn)
app.use('/users/:userId/comic-list', comicsController);
app.use('/users', usersController);


/* Run Express app on your computer on port 3000
-------------------------------------------------- */
app.listen(port, () => {
    console.log(`The express app is ready on port ${port}!`);
  });
  