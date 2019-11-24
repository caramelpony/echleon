const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');

const guildSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  owner_id: String,
  timeOfSnap: Number,
  analytics: {
    unavailable: Boolean,
    member_count: Number,
    region: String,
    name: String,
    icon: String,
    members: [{
        id: Number,
        name: String,
        nick: String,
        joined: String
    }],
    channels: [{
        id: Number,
        name: String,
        chantype: String,
        position: Number,
        nsfw: Boolean,
        topic: String,
        parent: Number
    }]
  },
  bot: {
    changelog: Boolean,
    changelogChannel: Number,
    prefix: String
  },
  logs: {
    enabled: Boolean,
    criticalPings: Boolean,
    criticalRole: String,
    logChannel: Number,
    connect: Boolean,
    disconnect: Boolean,
    moderation: Boolean,
    roles: Boolean,
    settings: Boolean
  }
});

guildSchema.plugin(findOrCreate);
module.exports = mongoose.model('Guild', guildSchema);
