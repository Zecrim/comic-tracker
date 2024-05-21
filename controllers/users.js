const express = require('express');
const router = express.Router();

const User = require('../models/user.js')

router.get('/', async (req, res) => {
    const users = await User.find()
    res.render(
        'users/index',
    { users: users }
)
  });

router.get('/:userId', async (req, res) => {
    const currentPage = await User.findById(req.params.userId);
    const currentUser = await User.findById(req.session.user._id);
    res.render('users/show', {user: currentPage, currentUser: currentUser})
  });

  module.exports = router;
