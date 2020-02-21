const {Client, RichEmbed, Collection} = require('discord.js');
const { getMember, warningEmbed, formatDate, updateBot } = require("./functions.js");
require('dotenv').config();
const mongoose = require('mongoose');
const moment = require('moment');
const findOrCreate = require('mongoose-findorcreate');
const { prefix } = require("./config.json");
const express = require('express');
const port = 3000;
mongoose.connect(process.env.MONGO_CONNECT, {useNewUrlParser: true, useUnifiedTopology: true}).catch(err => {
  console.log("[🛰️  ] [❕] | "+err);
});

const fs = require('fs');

const client = new Client();
client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync('./commands/');
client.cooldowns = new Collection();
const db = mongoose.connection;

var connectedDB = false;

const Owner = require('./models/owner');
const User = require('./models/user');
const Guild = require('./models/guild');

["command"].forEach(handler => {
  require(`./handler/${handler}`)(client);
});

async function syncGuild(guildObject){
  let time = moment().unix();
  foundGuild = await Guild.findOne({ id: guildObject.id }).catch(err => {
    console.log("[🛰️  ] [❕] | "+err);
  });
  foundGuild.timeOfSnap = time;
  foundGuild.analytics.name = guildObject.name;
  foundGuild.analytics.icon = guildObject.iconURL;
  foundGuild.analytics.region = guildObject.region;
  foundGuild.analytics.member_count = guildObject.memberCount;
  foundGuild.analytics.unavailable = guildObject.available;
  foundGuild.analytics.members = [];
  guildObject.members.forEach(member => {
      foundGuild.analytics.members.push({
        id: member.id,
        name: member.user.username,
        nick: member.nick,
        joined: formatDate(member.joinedAt)
      });
  });
  foundGuild.analytics.channels = [];
  guildObject.channels.forEach(channel => {
      let parent = 0;
      if (channel.parentID)
        parent = channel.parentID;
      let topic = "";
      if (channel.topic)
        topic = channel.topic;
      let nsfw = false;
      if (channel.nsfw)
        nsfw = channel.nsfw;
      foundGuild.analytics.channels.push({
        id: Number(channel.id),
        name: channel.name,
        chantype: channel.type,
        position: channel.position,
        nsfw: nsfw,
        topic: topic,
        parent: parent
      });
  });
  foundGuild.save(err => {
      if(err) console.log(err);
  });
};

async function updatePresence(){
  client.user.setPresence({ game: { name: ` ${client.guilds.size} servers!`, type: 'WATCHING' }, status: 'online' })
    .then(console.log(`[🤖  ] | Activity updated.`))
    .catch(console.error);
};

async function update(){
  await updateBot()
    .then(function (res) {
        if (res == true){
          console.log("\x1b[31m\x1b[0m","Bot Update Detected!");
        } else {
          return;
        }
    });
}

update();

client.on('ready', () => {
  console.log(`[🤖  ] | Logged in as ${client.user.tag}!`);
  updatePresence();
  console.log(`[🤖  ] | Ready to serve on ${client.guilds.size} servers, for ${client.users.size} users.`);

  client.guilds.forEach(guild => {
    Guild.findOrCreate({ id: guild.id }, { name: guild.name }, async function(err, foundGuild, created){
      if (created) {
        console.log(`[🤖  ] | New server Discovered! \"${guild.name}\".`);
        syncGuild(guild);
      } else {
        console.log(`[🤖  ] | Re-Discovered server! \"${guild.name}\".`);
        syncGuild(guild);
      }
    });
  });

});

client.on("error", (e) => console.error("[🤖  ] [❌] | " + e));

client.on("warn", (e) => console.warn("[🤖  ] [⚠️] | " + e));

client.on('message', async message => {
  client.emit("guildUnavailable", message.channel.guild);
  if (message.author.bot) return;
  if (!message.guild) return;
  if (!message.content.startsWith(prefix)) return;
  if (!message.member) message.member = await message.guild.fetchMember(message);

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();

  if (cmd.length === 0) return;

  let command = client.commands.get(cmd);
  if (!command) command = client.commands.get(client.aliases.get(cmd));

  if (command)
      command.run(client, message, args);

});

client.on("guildMemberAdd", (member) => {
  console.log(`[🤖  ] | "${member.user.username}" has joined "${member.guild.name}".`);
  //member.guild.channels.find(c => c.name === "welcome").send(`"${member.user.username}" has joined this server`);
});

client.on("guildMemberRemove", (member) => {
  console.log(`[🤖  ] | "${member.user.username}" has left "${member.guild.name}".`);
  //member.guild.channels.find(c => c.name === "welcome").send(`"${member.user.username}" has joined this server`);
});

client.on("guildCreate", (guild) => {
  Guild.findOrCreate({ id: guild.id }, { name: guild.name }, async function(err, foundGuild, created){
    if (created) {
      console.log(`[🤖  ] | New server Discovered! "${guild.name}".`);
      syncGuild(guild, true);
      updatePresence();
    } else {
      console.log(`[🤖  ] | Re-Discovered server! "${guild.name}".`);
      syncGuild(guild, true);
      updatePresence();
    }
  });
});

client.on('guildUpdate', async (oldGuild, newGuild) => {
  syncGuild(newGuild);
});

client.on('guildUnavailable', async (guild) => {
  syncGuild(guild);
});

client.on('channelCreate', async (channel) => {
  syncGuild(channel.guild);
});

client.on('channelDelete', async (channel) => {
  syncGuild(channel.guild);
});

client.on('channelUpdate', async (oldChannel, newChannel) => {
  syncGuild(newChannel.guild);
});

client.on('emojiCreate', async (emoji) => {
  syncGuild(emoji.guild);
});

client.on('emojiDelete', async (emoji) => {
  syncGuild(emoji.guild);
});

client.on('emojiUpdate', async (oldEmoji, newEmoji) => {
  syncGuild(newEmoji.guild);
});

client.on('roleCreate', async (role) => {
  syncGuild(role.guild);
});

client.on('roleDelete', async (role) => {
  syncGuild(role.guild);
});

client.on('roleUpdate', async (oldRole, newRole) => {
  syncGuild(newRole.guild);
});

client.on('disconnect', () => {
  console.log("[🤖  ] | Disconnected.")
});

db.once('open', function() {
  console.log("[🛰️  ] [✔️] | First database connection!");
});

db.on('connecting', function() {
  console.log("[🛰️  ] [🕐] | Attempting database connection!");
});

db.on('connected', function() {
  console.log("[🛰️  ] [✔️] | Database connected!");
  connectedDB = true;
});

db.on('reconnected', function() {
  console.log("[🛰️  ] [✔️] | Database reconnected!");
  connectedDB = true;
});

db.on('disconnected', function() {
  console.log("[🛰️  ] [❌] | Database disconnected!");
  connectedDB = false;
});

process.on('SIGINT', function() {
  console.log("[🖥️ ] [⚠️] | Recieved Shut Down command!")
  console.log("[🖥️ ] [⚠️] | Gracefully shutting down.");
  client.destroy();
  db.close();
  process.exit();
});

client.login(process.env.FILLYTOKEN);

const app = express();
console.log("[Express] | Starting Dashboard.");

app.get('/', function (req, res) {
  res.send('Hello World');
  console.log("[Express] | GET Request from:", req.ip)
})

app.listen(port, () => console.log(`[Express] | Started Dashboard on port ${port}!`))

/*
  let guildPrefix = prefix;
  if (message.author.bot) return;
  var foundGuild;

  if (message.guild) {
		foundGuild = await Guild.findOne({ id: message.guild.id });
		if (foundGuild.prefix != null){
      guildPrefix = foundGuild.prefix;
    } else {
      guildPrefix = prefix;
    }
	}
  */
