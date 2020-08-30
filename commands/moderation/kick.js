const { RichEmbed } = require('discord.js');
const {stripIndents } = require('common-tags');
const { getMember, warningEmbed, formatDate } = require("../../functions.js");

module.exports = {
    name: "kick",
    category: "moderation",
    description: "Kicks a member.",
    usage: "<mention | id>",
    run: async (client, message, args) => {
        if (message.deletable) message.delete();

        let rMember = message.mentions.members.first() || message.guild.members.get(args[0]);

        if(!rMember)
            return message.channel.send(warningEmbed(client, "Couldn't find that person.")).then(m => m.delete(5000));

        if (!message.guild.members.get(message.author.id).hasPermission("BAN_MEMBERS") || rMember.user.bot)
            return message.channel.send(warningEmbed(client, "You don't have permission to kick users!")).then(m => m.delete(5000));

        if (!args[1])
            return message.channel.send(warningEmbed(client, "Please provide a reason for the kick!")).then(m => m.delete(5000));

        const channel = message.guild.channels.find(channel => channel.name === "reports");

        if (!channel)
            return message.channel.send(warningEmbed(client, "I couldn't find a \`#reports\` channel.")).then(m => m.delete(5000));

        const embed = new RichEmbed()
            .setColor("#ff0000")
            .setTimestamp()
            .setFooter(message.guild.name, message.guild.iconURL)
            .setAuthor("Kicked member", rMember.user.displayAvatarURL)
            .setDescription(stripIndents`**Member:** ${rMember} (${rMember.id})
            **Kicked by:** ${message.member} (${message.member.id})
            **Kicked executed in:** ${message.channel}
            **Reason:** ${args.slice(1).join(" ")}`);

        function kickMember( member ){
            member.kick();
            channel.send(embed);
        }

        return kickMember(rMember);
    }
}
