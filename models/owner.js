const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');

const ownerSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  username: String,
  discriminator: String,
  avatar: String
});

ownerSchema.plugin(findOrCreate);
module.exports = mongoose.model('Owner', ownerSchema);
