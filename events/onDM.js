const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
        if (message.guildId != null) return // If message isn't in bot's DMs
		if (message.author.bot) return

		console.log(`${message.author.username}: ${message.content}`)

		let c = message.content

		if (c.includes('if') && c.includes('racist')) return message.reply('Nah')
		if (c.includes('if') && c.includes('re')) return message.reply('Nah')
		if (c.includes('you are') || c.includes('you\'re') || c.includes('youre')) return message.reply('Nah')

		await message.react('1082651718094962738')
		return await message.reply('<:juju:1082651718094962738>')
	},
};