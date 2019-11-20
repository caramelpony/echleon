const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { getMember, warningEmbed, formatDate } = require("../../functions.js");

module.exports = {
    name: "whois",
    aliases: ["who", "user", "info"],
    description: "Returns user information",
    usage: "[username | id | mention]",
    run: (client, message, args) => {
        const member = getMember(message, args.join(' '));

        // Member variables
        const joined = formatDate(member.joinedAt);
        const roles = member.roles
            .filter(r => r.id !== message.guild.id)
            .map(r => r).join(", ") || 'none';

        // User variables
        const created = formatDate(member.user.createdAt);

        var desktop = 'Offline';
        var web = 'Offline';
        var phone = 'Offline';

        if(member.user.presence.clientStatus.phone)
            phone = member.user.presence.clientStatus.phone[0].toUpperCase() + member.user.presence.clientStatus.phone.slice(1);

        if(member.user.presence.clientStatus.web)
            web = member.user.presence.clientStatus.web[0].toUpperCase() + member.user.presence.clientStatus.web.slice(1);

        if(member.user.presence.clientStatus.desktop)
            desktop = member.user.presence.clientStatus.desktop[0].toUpperCase() + member.user.presence.clientStatus.desktop.slice(1);

        const embed = new RichEmbed()
            .setFooter(member.displayName, member.user.displayAvatarURL)
            .setThumbnail(member.user.displayAvatarURL)
            .setColor(member.displayHexColor === '#000000' ? '#ffffff' : member.displayHexColor)

            .addField('Member information:', stripIndents`**Display name:** ${member.displayName}
            **Joined at:** ${joined}
            **Roles:** ${roles}`, true)

            .addField('User information:', stripIndents`**ID:** ${member.user.id}
            **Username**: ${member.user.username}
            **Tag**: ${member.user.tag}
            **Created at**: ${created}`, true)

            .addField('Client information:', stripIndents`**Desktop:** ${desktop}
            **Phone:** ${phone}
            **Web:** ${web}`,true)

            .setTimestamp()

        if (member.user.presence.game){
            if(member.user.presence.game.name === "Custom Status") {
                embed.addField('Currently playing', stripIndents`**Custom Status:** ${member.user.presence.game.state}`,true);
            } else {
                embed.addField('Currently playing', stripIndents`**Name:** ${member.user.presence.game.name}`,true);
            }
        }

        message.channel.send(embed);
    }
}
