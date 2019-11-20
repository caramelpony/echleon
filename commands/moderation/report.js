const { RichEmbed } = require('discord.js');
const {stripIndents } = require('common-tags');
const { getMember, warningEmbed, formatDate } = require("../../functions.js");

module.exports = {
    name: "report",
    category: "moderation",
    description: "Reports a member.",
    usage: "<mention | id>",
    run: async (client, message, args) => {
        if (message.deletable) message.delete();

        let rMember = message.mentions.members.first() || message.guild.members.get(args[0]);

        if(!rMember)
            return message.channel.send(warningEmbed(client, "Couldn't find that person.")).then(m => m.delete(5000));

        if (rMember.hasPermission("BAN_MEMBERS") || rMember.user.bot)
            return message.channel.send(warningEmbed(client, "Can't report that member!")).then(m => m.delete(5000));

        if (!args[1])
            return message.channel.send(warningEmbed(client, "Please provide a reason for the report!")).then(m => m.delete(5000));

        const channel = message.guild.channels.find(channel => channel.name === "reports");

        if (!channel)
            return message.channel.send(warningEmbed(client, "I couldn't find a \`#reports\` channel.")).then(m => m.delete(5000));

        const embed = new RichEmbed()
            .setColor("#ff0000")
            .setTimestamp()
            .setFooter(message.guild.name, message.guild.iconURL)
            .setAuthor("Reported member", rMember.user.displayAvatarURL)
            .setDescription(stripIndents`**Member:** ${rMember} (${rMember.id})
            **Reported by:** ${message.member} (${message.member.id})
            **Reported in:** ${message.channel}
            **Reason:** ${args.slice(1).join(" ")}`);

        return channel.send(embed);
    }
}
