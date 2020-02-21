const { RichEmbed } = require('discord.js');
const {stripIndents } = require('common-tags');
const axios = require('axios');
const { version } = require('./package.json');

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
        const response = await axios.get('https://github.com/solemcaelum/echleon/blob/master/package.json');
        console.log(`${response}`);
        console.log(`${response.version} : ${version}`);
        if ( response.version > version){
          return true;
        } else {
          return false;
        }
      } catch (error) {
        console.error(error);
      }
    }

}
