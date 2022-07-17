const { RichEmbed } = require('discord.js');
const {stripIndents } = require('common-tags');
const axios = require('axios');
const { version } = require('./package.json');
const moment = require('moment');

const Owner = require('./models/owner.js');
const User = require('./models/user.js');
const Guild = require('./models/guild.js');

module.exports = {
    getMember: function(message, toFind = '') {
        toFind = toFind.toLowerCase();

        let target = message.guild.members.get(toFind);

        if (!target && message.mentions.members)
            target = message.mentions.members.first();

        if (!target && toFind) {
            target = message.guild.members.find(member => {
                return member.displayName.toLowerCase().includes(toFind) ||
                member.user.tag.toLowerCase().includes(toFind)
            });
        }

        if (!target)
            target = message.member;

        return target;
    },

    getGuildDomain: function(message) {
        var startingString = message.guild.name;
        var output = startingString.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, "").split(/ +/g).join("-");
        return output;
    },

    getUserDomain: function(member) {
        var startingName = member.user.username;
        var outputName = startingName.replace(/([^a-zA-Z0-9 ])/g, "");
        outputName = outputName.toLowerCase().split(/ +/g).join("-");
        return outputName;
    },

    formatDate: function(date) {
        return new Intl.DateTimeFormat('en-US').format(date)
    },

    warningEmbed: function(client, message) {
        const embed = new RichEmbed()
            .setColor("#ff8200")
            .setDescription(stripIndents`⚠ \t${message}`);

        return embed;
    },

    updateBot: async function(){
      try {
        const response = await axios.get('https://raw.githubusercontent.com/solemcaelum/echleon/master/package.json');
        console.log(`${response.data.version} : ${version}`);
        if ( response.version > version){
          return true;
        } else {
          return false;
        }
      } catch (error) {
        console.error(error);
      }
    },

    syncGuild: async function(guildObject){
      function formatDate(date) {
        return new Intl.DateTimeFormat('en-US').format(date)
      }
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
      })
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
    },

    syncUser: async function(userObject){
      let time = moment().unix();
      foundUser = await User.findOne({ id: userObject.id }).catch(err => {
        console.log("[🛰️  ] [❕] | "+err);
      });
      foundUser.username = userObject.username;
      foundUser.discriminator = userObject.discriminator;
      foundUser.avatar = userObject.displayAvatarURL;
      foundUser.bot = userObject.bot;
      foundUser.save(err => {
          if(err) console.log(err);
      });
    },

    checkUserData: async function(client, userObject, data){
      foundUser = await User.findOne({ id: userObject.id }).catch(err => {
        console.log("[🛰️  ] [❕] | "+err);
      });
      var i = 0;
      var userData = [];
      for (const badge of foundUser.data){
        userData[i] = badge;
        i++;
      }
      return userData;
    }

}
