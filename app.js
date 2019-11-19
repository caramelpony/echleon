const Discord = require('discord.js');
const mongoose = require('mongoose');
const {token, mongoConnect} = require("./config.json");
mongoose.connect(mongoConnect, {useNewUrlParser: true, useUnifiedTopology: true}).catch(err => {
  console.log("[🛰️  ] [❕] | First database connection!");
});
const client = new Discord.Client();
const db = mongoose.connection;

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

client.on('ready', () => {
  console.log(`[🤖  ] | Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  console.log(`[🤖  ] | [${msg.guild.username}] <${msg.author.username}> : ${msg.content}!`);
});

client.login(token);

db.once('open', function() {
  console.log("[🛰️  ] [❕] | First database connection!");
});

db.on('connecting', function() {
  console.log("[🛰️  ] [❕] | Attempting database connection!");
});

db.on('connected', function() {
  console.log("[🛰️  ] [❕] | Database connected!");
});

db.on('reconnected', function() {
  console.log("[🛰️  ] [❕] | Database reconnected!");
});

db.on('disconnected', function() {
  console.log("[🛰️  ] [❕] | Database disconnected!");
});

process.on('SIGINT', function() {
  console.log("[🖥️ ] [⚠️] | Recieved Shut Down command!")
  console.log("[🖥️ ] [⚠️] | Gracefully shutting down.");
  db.close();
  process.exit();
});
