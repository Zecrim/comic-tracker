/* Import packages and models
-------------------------------------------------- */
const express = require('express');
const router = express.Router();

const User = require('../models/user.js');

  // New route
router.get('/new', (req, res) => {
  res.render('comics/new')
})

// Create route
router.post('/', async (req, res) => {
  try {
      // Look up the currently logged in user by using req.session
      const currentUser = await User.findById(req.session.user._id);
      console.log(req.body)
      currentUser.comic.push(req.body);
      // Save the changes made to the user document
      await currentUser.save();
      res.redirect(`/users/${currentUser._id}/comic-list`);
  } catch (error) {
      // If POSTing throws any errors, redirect the user back to the new form
      console.log(error);
      res.redirect(`/users/${req.session.user._id}/comic-list/new`);
  }
})

// Show route
router.get('/:comicId', async (req, res) => {
  try {
      // Look up the currently logged in user by using req.session
      const currentUser = await User.findById(req.session.user._id);
      // Use the built-in Mongoose method `id()` to find a subdocument in aarray using its ID
      const comic = currentUser.comic.id(req.params.comicId);
      // Render the job application in the show page
      res.render('comics/show', { comic: comic })
  } catch (error) {
      // If any errors, log them and redirect back home
      console.log(error);
      res.redirect(`/users/${req.session.user._id}/comic-list`)
  }
})

// Delete route
router.delete('/:comicId', async (req, res) => {
  try {
      // Look up the currently logged in user by using req.session
      const currentUser = await User.findById(req.session.user._id);
      // Use the Mongoose .deleteOne() method to delete 
      // an application using the id supplied from req.params
      currentUser.comic.id(req.params.comicId).deleteOne();
      // Save the changes made to the user document
      await currentUser.save();
      // Redirect the user to the applications index route
      res.redirect(`/users/${currentUser._id}/comic-list`);
  } catch (error) {
      // If any errors, log them and redirect back to the show page
      console.log(error);
      res.redirect(`/users/${req.session.user._id}/comic-list/${req.params.applicationId}`)
  }
})

// Edit route
router.get('/:comicId/edit', async (req, res) => {
  try {
      // Look up the currently logged in user by using req.session
      const currentUser = await User.findById(req.session.user._id);
      // Use the built-in Mongoose method `id()` to find a subdocument in array using its ID
      const comic = currentUser.comic.id(req.params.comicId);
      // Render the job application in the edit form
      res.render('comics/edit', { comic: comic })
  } catch (error) {
      // If any errors, log them and redirect back to the show page
      console.log(error)
      res.redirect(`/users/${req.session.user._id}/comic-list/${req.params.applicationId}`)
  }
})

// Update route
router.put('/:comicId', async (req, res) => {
  try {
      // Look up the currently logged in user by using req.session
      const currentUser = await User.findById(req.session.user._id);
      // Use the built-in Mongoose method `id()` to find a subdocument in array using its ID
      const comic = currentUser.comic.id(req.params.comicId);
      // Use the built-in Mongoose method `set()` to update a subdocument
      comic.set(req.body)
      // Save the changes made to the user document
      await currentUser.save();
      res.redirect(`/users/${currentUser._id}/comic-list/${comic._id}`)
  } catch (error) {
      console.log(error)
      res.redirect(`/users/${req.session.user._id}/comic-list/${req.params.id}/edit`)
  }
})

module.exports = router;
