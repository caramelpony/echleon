const { RichEmbed } = require('discord.js');
const {stripIndents } = require('common-tags');
const { getMember, warningEmbed, formatDate } = require("../../functions.js");

module.exports = {
    name: "owner",
    aliases: ["owned","master", "own"],
    category: "bot",
    description: "Bot's Maintainer.",
    run: async (client, message, args) => {
        let ownerUser = await client.fetchUser(process.env.OWNER);
        const roleColor = message.guild.me.displayHexColor === "#000000" ? "#ffffff" : message.guild.me.displayHexColor;

        const embed = new RichEmbed()
            //.setColor(roleColor)
            .setColor('#99e786')
            .setDescription(stripIndents`This bot is maintained voluntarily. Please consider donating if it's helped your server~`)
            .setTimestamp()
            .setAuthor(ownerUser.username, ownerUser.displayAvatarURL)
            .setThumbnail(ownerUser.displayAvatarURL)
            .setFooter(`${client.user.username} - ${Math.round(client.ping)}ms Latency`, client.user.displayAvatarURL)

            .addField('User information:', stripIndents`**ID:** ${ownerUser.id}
            **Username**: ${ownerUser.username}
            **Tag**: ${ownerUser.tag}`, true)

            .addField('Support the Dev:', stripIndents`**Ko-Fi:** \nhttps://ko-fi.com/carameldrop
            **Patreon:** \nhttps://patreon.com/carameldrop`, true)

            .addField('Social Platforms:', stripIndents`**Twitter:** https://twitter.com/ponyidle
            **Steam:** https://steamcommunity.com/id/carameldrop
            **Streaming:** https://candyhorse.live/
            **Website**: https://caramel.horse/`)

        message.channel.send(embed);

    }
}
