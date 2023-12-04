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

		if (message.attachments.size > 0) {
			let attachments = "";

			message.attachments.forEach((attachment) => {
				attachments = attachments + `[${attachment.name}](${attachment.url}) (${getSize(attachment.size)})\n`;
			});

			emb.addFields({
				inline: false,
				name: "Attachments",
				value: attachments
			})
		}

		let logChannel = await message.guild.channels.cache.find(r => r.name === 'message-logs')

		return await logChannel.send({ embeds: [emb] })
	},
};

function getSize(bytes) {
	const kilobytes = bytes / 1024.0;
	const megabytes = bytes / (1024.0 * 1024);
	const gigabytes = bytes / (1024.0 * 1024 * 1024);
	const terabytes = bytes / (1024.0 * 1024 * 1024 * 1024);

	if (terabytes > 1) {
		return `${terabytes.toFixed(2)} TB`;
	} else if (gigabytes > 1) {
		return `${gigabytes.toFixed(2)} GB`;
	} else if (megabytes > 1) {
		return `${megabytes.toFixed(2)} MB`;
	} else if (kilobytes > 1) {
		return `${kilobytes.toFixed(2)} KB`;
	} else {
		return `${bytes} bytes`;
	}
}
