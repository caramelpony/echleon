const { RichEmbed } = require('discord.js');
const {stripIndents } = require('common-tags');
const { getMember, warningEmbed, formatDate } = require("../../functions.js");

module.exports = {
    name: "owner",
    aliases: ["owned","master"],
    category: "bot",
    description: "Bot's Maintainer.",
    run: async (client, message, args) => {
        let ownerUser = await client.fetchUser(process.env.OWNER);
        const roleColor = message.guild.me.displayHexColor === "#000000" ? "#ffffff" : message.guild.me.displayHexColor;

        console.log(ownerUser);

        const embed = new RichEmbed()
            .setColor(roleColor)
            .setDescription(`This bot is maintained free of charge, at the expense of the Owner! Please consider donating if it's helped your server~`)
            .setTimestamp()
            .setAuthor(ownerUser.username, ownerUser.displayAvatarURL)
            .setThumbnail(ownerUser.displayAvatarURL)
            .setFooter(`${client.user.username} - ${Math.round(client.ping)}ms Latency`, client.user.displayAvatarURL)

            .addField('User information:', stripIndents`**ID:** ${ownerUser.id}
            **Username**: ${ownerUser.username}
            **Tag**: ${ownerUser.tag}`, true)

            .addField('Support the Dev:', stripIndents`**Ko-Fi:** https://ko-fi.com/carameldrop
            **Patreon:** https://patreon.com/carameldrop`, true)

            .addField('Platforms:', stripIndents`**Twitter:** https://twitter.com/ponyidle
            **Steam:** https://steamcommunity.com/id/fillyanon
            **Streaming:** https://candyhorse.live/`,true)

            .addField('UwU', stripIndents`**owo**`, true)

            //**Website**: https://caramel.horse/`

        message.channel.send(embed);

    }
}
