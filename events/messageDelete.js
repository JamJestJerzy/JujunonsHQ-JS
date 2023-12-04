const { Events, EmbedBuilder, Attachment} = require('discord.js');

module.exports = {
	name: Events.MessageDelete,
	async execute(message) {
        if (message.author.bot) return

		const emb = new EmbedBuilder()
			.setAuthor({
				name: `Deleted ${message.author.globalName}'s message`,
				iconURL: message.author.displayAvatarURL(),
			})
			.addFields({
				inline: true,
				name: "Channel",
				value: `https://discord.com/channels/${message.guildId}/${message.channelId}/${message.id}`
			})
			.setDescription(`${(message.content) ? message.content : "*No content*"}`)
			.setTimestamp()
			.setColor('#a3def8')

		let logChannel = await message.guild.channels.cache.find(r => r.name === 'message-logs')

		return await logChannel.send({ embeds: [emb] })
	},
};