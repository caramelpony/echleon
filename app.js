const {Client, RichEmbed, Collection} = require('discord.js');
require('dotenv').config();
const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');
const { prefix } = require("./config.json");
mongoose.connect(process.env.MONGO_CONNECT, {useNewUrlParser: true, useUnifiedTopology: true}).catch(err => {
  console.log("[🛰️  ] [❕] | First database connection!");
});
const client = new Client();
client.commands = new Collection();
client.aliases = new Collection();
const db = mongoose.connection;

var connectedDB = false;

const Owner = require('./models/owner');
const User = require('./models/user');
const Guild = require('./models/guild');

["command"].forEach(handler => {
  require(`./handler/${handler}`)(client);
});

client.on('ready', () => {
  console.log(`[🤖  ] | Logged in as ${client.user.tag}!`);
  client.user.setPresence({
        game: {
            name: ` ${client.guilds.size} servers!`,
            type: 'WATCHING'
        },
        status: 'online'
    });
  //client.user.setActivity(`on ${client.guilds.size} servers!`);
  console.log(`[🤖  ] | Ready to serve on ${client.guilds.size} servers, for ${client.users.size} users.`);


});

client.on("error", (e) => console.error("[🤖  ] [❌] | " + e));

client.on("warn", (e) => console.warn("[🤖  ] [⚠️] | " + e));

//client.on("debug", (e) => console.info("[🤖  ] [❕] | " + e));

client.on('message', async message => {
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

client.on("guildCreate", guild => {
  Guild.findOrCreate({ id: guild.id }, { name: guild.name }, function(err, Guild, created){
    if (created) {
      console.log(`[🤖  ] | New server joined! "${guild.name}".`);
      client.user.setPresence({
            game: {
                name: ` ${client.guilds.size} servers!`,
                type: 'WATCHING'
            },
            status: 'online'
        });
    } else {
      console.log(`[🤖  ] | Re-joined server! "${guild.name}".`);
      client.user.setPresence({
            game: {
                name: ` ${client.guilds.size} servers!`,
                type: 'WATCHING'
            },
            status: 'online'
        });
    }
  });
});

client.on('guildUpdate', async (oldGuild, newGuild) => {
	await Guild.updateOne(
		{ id: oldGuild.id },
		{
			name: newGuild.name
		}
	);
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
  db.close();
  process.exit();
});

client.login(process.env.FILLYTOKEN);

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

  /*
  console.log(`[🤖  ] | [${message.guild.username}] <${message.author.username}> : ${message.content}!`);
  if(command === 'join'){
    client.emit("guildMemberAdd", message.member);
  } else if (command === 'leave'){
    client.emit("guildMemberRemove", message.member);
  } else if (command === 'prefix'){
    foundGuild.bot.prefix = args[0];
    foundGuild.save().then(
    message.channel.send('Your prefix has been successfully saved!')
    .catch( err => {
      message.channel.send(`There was an error, ${err}.`);
      console.log("[🤖  ] [❌] | "+err);
    }));
  } else {
    message.channel.send("That command doesn\'t exist.");
  }
  */
