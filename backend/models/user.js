const mongoose = require('mongoose');

const userModel = mongoose.model(
  'User',
  new mongoose.Schema({
    username: String,
    password: String,
  })
);

module.exports = userModel;
