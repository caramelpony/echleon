const {Client, RichEmbed, Collection} = require('discord.js');
const {getMember, warningEmbed, formatDate, updateBot, syncGuild, syncUser} =
    require("./functions.js");
require('dotenv').config();
const mongoose = require('mongoose');
const moment = require('moment');
const findOrCreate = require('mongoose-findorcreate');
const {prefix} = require("./config.json");
const express = require('express');
const port = 3000;

mongoose.connect(process.env.MONGO_CONNECT)
    .catch(e => { console.log("[🛰️  ] [❕] | " + e); });

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
const {stripIndents} = require('common-tags');

["command"].forEach(handler => { require(`./handler/${handler}`)(client); });

function presentTOS(guild) {
  const channel = guild.channels.find(channel => channel.name === "general");
  ;
  const roleColor = guild.me.displayHexColor === "#000000"
                        ? "#ffffff"
                        : guild.me.displayHexColor;

  const embed =
      new RichEmbed()
          //.setColor(roleColor)
          .setColor('#99e786')
          .setTitle(stripIndents`Echleon - Discord Server Analytics`)
          .setDescription(
              stripIndents`Echleon is built with Analytics, and control in mind. It strives to give you the information and tools to fully manage and grow your servers.`)
          .setTimestamp()
          .setAuthor(client.user.username, client.user.displayAvatarURL)
          .setThumbnail(client.user.displayAvatarURL)
          .setFooter(
              `${client.user.username} - ${Math.round(client.ping)}ms Latency`,
              client.user.displayAvatarURL)
          .addField(
              'Terms:', stripIndents`Server, Channel, and Memeber information
        is collected and processed to create analytical information.
        Most of this data is collected with privacy in mind, but we still want to
        confirm server administration's consent.`,
              true)

          .addField(
              'Instructions:',
              stripIndents`None needed! You consented to these terms by adding the bot to your server.
        You can also use \`=owner\` to learn more about the developer.`,
              true)

          .addField(
              'Website:',
              stripIndents`**Github**: https://github.com/solemcaelum/echleon`)
  if (channel) {
    channel.send(embed);
    syncGuild(guild);
  }
  else {
    syncGuild(guild);
  }
}

async function updatePresence() {
  client.user
      .setPresence({
        game : {name : ` ${client.guilds.size} servers!`, type : 'WATCHING'},
        status : 'online'
      })
      .then(console.log(`[🤖  ] | Activity updated.`))
      .catch(console.error);
};

async function update() {
  await updateBot().then(function(res) {
    if (res == true) {
      console.log("\x1b[31m\x1b[0m", "Bot Update Detected!");
    } else {
      return;
    }
  });
}

update();

client.on('ready', () => {
  console.log(`[🤖  ] | Logged in as ${client.user.tag}!`);
  updatePresence();
  console.log(`[🤖  ] | Ready to serve on ${
      client.guilds.size} servers, for ${client.users.size} users.`);

  client.users.forEach(user => {
    User.findOrCreate({id : user.id}, {username : user.username},
                      async function(err, foundGuild, created) {
                        if (created) {
                          console.log(`New user added to database! ID: ${
                              user.id} | Username: ${user.username}`);
                          syncUser(user);
                        } else {
                          console.log(`User Exists! Updating database! ID: ${
                              user.id} | Username: ${user.username}`);
                          syncUser(user);
                        }
                      });
  });

  client.guilds.forEach(guild => {
    Guild.findOrCreate(
        {id : guild.id}, {name : guild.name},
        async function(err, foundGuild, created) {
          if (created) {
            console.log(`[🤖  ] | New server Discovered! \"${guild.name}\".`);
            presentTOS(guild)
            syncGuild(guild)
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
  if (message.author.bot)
    return;
  if (!message.guild)
    return;
  if (!message.content.startsWith(prefix))
    return;
  if (!message.member)
    message.member = await message.guild.fetchMember(message);

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();

  if (cmd.length === 0)
    return;

  let command = client.commands.get(cmd);
  if (!command)
    command = client.commands.get(client.aliases.get(cmd));

  if (command)
    command.run(client, message, args);
});

client.on("guildMemberAdd", (member) => {
  console.log(`[🤖  ] | "${member.user.username}" has joined "${
      member.guild.name}".`);
  // member.guild.channels.find(c => c.name ===
  // "welcome").send(`"${member.user.username}" has joined this server`);
});

client.on("guildMemberRemove", (member) => {
  console.log(
      `[🤖  ] | "${member.user.username}" has left "${member.guild.name}".`);
  // member.guild.channels.find(c => c.name ===
  // "welcome").send(`"${member.user.username}" has joined this server`);
});

client.on("guildCreate", (guild) => {
  Guild.findOrCreate(
      {id : guild.id}, {name : guild.name},
      async function(err, foundGuild, created) {
        if (created) {
          console.log(`[🤖  ] | New server Discovered! "${guild.name}".`);
          presentTOS(guild);
          syncGuild(guild)
          updatePresence();

        } else {
          console.log(`[🤖  ] | Re-Discovered server! "${guild.name}".`);
          syncGuild(guild);
          updatePresence();
        }
      });
});

client.on('guildUpdate',
          async (oldGuild, newGuild) => { syncGuild(newGuild); });

client.on('guildUnavailable', async (guild) => { syncGuild(guild); });

client.on('channelCreate', async (channel) => { syncGuild(channel.guild); });

client.on('channelDelete', async (channel) => { syncGuild(channel.guild); });

client.on('channelUpdate',
          async (oldChannel, newChannel) => { syncGuild(newChannel.guild); });

client.on('emojiCreate', async (emoji) => { syncGuild(emoji.guild); });

client.on('emojiDelete', async (emoji) => { syncGuild(emoji.guild); });

client.on('emojiUpdate',
          async (oldEmoji, newEmoji) => { syncGuild(newEmoji.guild); });

client.on('roleCreate', async (role) => { syncGuild(role.guild); });

client.on('roleDelete', async (role) => { syncGuild(role.guild); });

client.on('roleUpdate',
          async (oldRole, newRole) => { syncGuild(newRole.guild); });

client.on('disconnect', () => {console.log("[🤖  ] | Disconnected.")});

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

app.get('/', function(req, res) {
  res.send('Hello World');
  console.log("[Express] | GET Request from:", req.ip)
})

app.listen(port,
           () => console.log(`[Express] | Started Dashboard on port ${port}!`))

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
