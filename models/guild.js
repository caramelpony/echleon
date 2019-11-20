const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');

const guildSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  owner_id: String,
  permissions: Number,
  analytics: {
    features: Array,
    mfa_level: Number,
    large: Boolean,
    unavailable: Boolean,
    member_count: Number,
    max_members: Number,
    verification_level: Number,
    default_message_notifications: Number,
    explicit_content_filter: Number,
    region: String,
    roles: Array,
    name: String,
    icon: String,
    members: Array,
    channels: Array,
    presences: Array
  },
  misc: {
    splash: String,
    vanity_url_code: String,
    description: String,
    banner: String,
    premium_tier: Number,
    emojis: Array
  },
  bot: {
    changelog: Boolean,
    changelogChannel: Number,
    prefix: String,
    firstTime: Boolean
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
