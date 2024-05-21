const mongoose = require('mongoose');

const comicSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['plan-to-read', 'reading', 'completed', 'dropped']
    },
    comicId: String,
})

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  comic: [comicSchema],
  reading: Number,
  completed: Number,
  planToRead: Number
});

const User = mongoose.model('User', userSchema);

module.exports = User;
