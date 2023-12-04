const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
	name: Events.MessageUpdate,
	async execute(oldMessage, newMessage) {
        if (oldMessage.author.bot) return
		if (newMessage.content === oldMessage.content) return

		const emb = new EmbedBuilder()
            .setAuthor({
                name: `Edited ${newMessage.author.globalName}'s message`,
                iconURL: newMessage.author.displayAvatarURL(),
            })
            .addFields(
                { name: "Before", value: `\`${oldMessage.content}\``, inline: false },
                { name: "After", value: `\`${newMessage.content}\``, inline: false },
                {
                    name: "Channel",
                    value: `https://discord.com/channels/${newMessage.guildId}/${newMessage.channelId}/${newMessage.id}`,
                    inline: false,
                }
            )
            .setTimestamp()
            .setColor('a3def8')

		let logChannel = await oldMessage.guild.channels.cache.find(r => r.name === 'message-logs')
		return await logChannel.send({ embeds: [emb] })
	},
};