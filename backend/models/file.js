const mongoose = require('mongoose');

const fileModel = mongoose.model(
  'File',
  new mongoose.Schema({
    location: String,
    description: String,
  })
);

module.exports = fileModel;
