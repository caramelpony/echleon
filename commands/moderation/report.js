const { RichEmbed } = require('discord.js');
const {stripIndents } = require('common-tags');

module.exports = {
    name: "report",
    category: "moderation",
    description: "Reports a member.",
    usage: "<mention | id>",
    run: async (client, message, args) => {
        if (message.deletable) message.delete();

        let rMember = message.mentions.members.first() || message.guild.members.get(args[0]);

        if(!rMember)
            return message.reply("Couldn't find that person.").then(m => m.delete(5000));

        if (rMember.hasPermission("BAN_MEMBERS") || rMember.user.bot)
            return message.reply("Can't report that member!").then(m => m.delete(5000));

        if (!args[1])
            return message.channel.send("Please provide a reason for the report!").then(m => m.delete(5000));

        const channel = message.guild.channels.find(channel => channel.name === "reports");

        if (!channel)
            return message.channel.send("I couldn't find a \`#reports\` channel.").then(m => m.delete(5000));

        const embed = new Rich
    }
}
