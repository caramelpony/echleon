const { getMember, warningEmbed, formatDate } = require("../../functions.js");

module.exports = {
    name: "say",
    aliases: ["bc","broadcast"],
    category: "moderation",
    description: "Broadcasts input.",
    usage: "<input>",
    run: async (client, message, args) => {
        if (message.deletable) message.delete();

        if (args.length < 1)
            return message.channel.send(warningEmbed(client,"No message provided!")).then(m => m.delete(5000));

        if (!getMember(message).hasPermission("BAN_MEMBERS"))
            return message.channel.send(warningEmbed(client,"You don't have permission!")).then(m => m.delete(5000));

        const roleColor = message.guild.me.displayHexColor === "#000000" ? "#ffffff" : message.guild.me.displayHexColor;

        if (args[0].toLowerCase() === "embed") {
            const embed = new RichEmbed()
                .setColor(roleColor)
                .setDescription(args.slice(1).join(" "))
                .setTimestamp()
                .setImage(client.user.displayAvatarURL)
                .setAuthor(message.author.name, message.author.displayAvatarURL)
                .setFooter(client.user.username, client.user.displayAvatarURL)

            message.channel.send(embed);
        } else {
            message.channel.send(args.join(" "));
        }
    }
}
