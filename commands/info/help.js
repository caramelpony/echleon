const { RichEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const { getMember, warningEmbed, formatDate } = require("../../functions.js");

module.exports = {
	name: 'help',
	aliases: ['h'],
	category: 'info',
	description: 'Returns all commands, or one specific command info',
	usage: '[command | alias]',
	supportsDM: true,
	run: async (client, message, args) => {
		if (args[0]) {
			return getCMD(client, message, args[0]);
		} else {
			return getAll(client, message);
		}
	}
};

function getAll(client, message) {
	const embed = new RichEmbed().setColor(message.guild.me.displayHexColor).setTitle('Commands');

	const commands = category => {
		return client.commands.filter(cmd => cmd.category === category).map(cmd => `- ${cmd.name}`);
	};

	client.categories.forEach(e => {
		embed.addField(e.charAt(0).toUpperCase() + e.slice(1), commands(e), true);
	});

	let serverPrefix = () => {
		if (client.foundGuild === undefined) return '-';
		return client.foundGuild.prefix;
	};

	embed.setFooter(`The prefix for this server is ${serverPrefix()}`);

	return message.channel.send(embed);
}

function getCMD(client, message, input) {

	const cmd = client.commands.get(input.toLowerCase()) || client.commands.get(client.aliases.get(input.toLowerCase()));

	if (!cmd) {
		return warningEmbed(`\`${input.toLowerCase()}\` does not exist. \nPlease see the \`help\` for a list of commands.`);
	}

  const embed = new RichEmbed();

  let title = '';
  let info = '';

	if (cmd.name) {
		title = `${cmd.name.charAt(0).toUpperCase() + cmd.name.substring(1)}`;
		info = '';
	}
	if (cmd.aliases) info += `\n**Aliases**: ${cmd.aliases.map(a => `\`${a}\``).join(', ')}`;
	if (cmd.description) info += `\n**Description**: ${cmd.description}`;
	if (cmd.usage) {
		info += `\n**Usage**: ${cmd.usage}`;
		embed.setFooter(`Syntax: <> = required, [] = optional`);
	}

	return message.channel.send(
		embed
			.setColor(message.guild.me.displayHexColor)
			.setTitle(title)
			.setDescription(info)
	);
}
