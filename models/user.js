const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');

const userSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  username: String,
  discriminator: String,
  avatar: String,
  bot: Boolean,
  data: Array
});

userSchema.plugin(findOrCreate);
module.exports = mongoose.model('User', userSchema);
