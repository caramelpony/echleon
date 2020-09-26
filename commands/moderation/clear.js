const { getMember, warningEmbed, formatDate } = require("../../functions.js");

module.exports = {
    name: "clear",
    aliases: ["cls"],
    category: "moderation",
    description: "Clears channel.",
    usage: "[amount to delete]",
    run: async (client, message, args) => {
        var amountToDelete = 99;

        if (message.deletable) message.delete();

        if (!getMember(message).hasPermission("MANAGE_CHANNELS"))
            return message.channel.send(warningEmbed(client,"You don't have permission!")).then(m => m.delete(5000));

        const roleColor = message.guild.me.displayHexColor === "#000000" ? "#ffffff" : message.guild.me.displayHexColor;

        if (args[0] > 99 || args[0] < 1)
            return message.channel.send(warningEmbed(client,"Number is not within range! (1-99)")).then(m => m.delete(5000));

        if (isNaN(args[0]))
            return message.channel.send(warningEmbed(client,"Input is not a number!")).then(m => m.delete(5000));

        if (args[0])
            amountToDelete = args[0];

        async function clear() {

            const fetched = await message.channel.fetchMessages({limit: amountToDelete});

            message.channel.bulkDelete(fetched).catch((error) => {
                console.error(error);
            });
 
        }
        clear();
    }
}
