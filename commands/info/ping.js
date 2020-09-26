const { getMember, warningEmbed, formatDate } = require("../../functions.js");

module.exports = {
    name: "ping",
    category: "info",
    description: "Returns latency and API ping.",
    run: async (client, message, args) => {
        const msg = await message.channel.send('🏓 Pinging...');
        msg.edit(warningEmbed(client,`Latency Stats:\nLatency is ${Math.floor(msg.createdAt - message.createdAt)}ms\nAPI Latency is ${Math.round(client.ping)}ms!`));
    }
}
