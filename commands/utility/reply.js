const { SlashCommandBuilder } = require('discord.js');
const dayjs = require('dayjs')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reply')
		.setDescription('Replies to message as bot')
        .addStringOption(option =>
			option.setName('messageid')
				.setDescription('MessageID of message to reply')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('channelid')
                .setDescription('ChahannelID of channel with message')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('text')
                .setDescription('text of reply')
                .setRequired(true)),
	async execute(interaction) {
        let message = interaction.options.getString('messageid');
        message = Number.isInteger(message) ? parseInt(message) : null;
        let channelid = interaction.options.getString('channelid');
        channelid = Number.isInteger(channelid) ? parseInt(channelid) : null;
        const text = interaction.options.getString('text');

        if (message == null || channelid == null) return;
        let channel = await interaction.client.channels.fetch(channelid)
		let messagesFetch = await channel.messages.fetch(message)
		messagesFetch.reply(text)
	},
};
