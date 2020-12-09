const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  //doc: https://mongoosejs.com/docs/guide.html
  title: {type: String, required: true},
  content: {type: String, required: true}
});

module.exports = mongoose.model('Post', postSchema);