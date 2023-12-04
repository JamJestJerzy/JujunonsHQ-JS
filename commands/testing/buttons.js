const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('testbuttons')
		.setDescription('Buggy af')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
	async execute(interaction) {
        const confirm = new ButtonBuilder()
			.setCustomId('confirm')
			.setLabel('Confirm')
			.setStyle(ButtonStyle.Danger);

		const cancel = new ButtonBuilder()
			.setCustomId('cancel')
			.setLabel('Cancel')
			.setStyle(ButtonStyle.Secondary);

		const row = new ActionRowBuilder()
			.addComponents(cancel, confirm);

		await interaction.reply({
			content: `These buttons doesn't fucking work.`,
			components: [row],
		});

        const filter = m => m.customId === 'confirm' || 'cancel' && m.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter: filter, max: 1, time: 30000 });

        collector.on('collect', async (m) => {
            if (m.customId === 'confirm') {
                await m.deferUpdate();
                return await m.followUp({ content: `Confirmed!`, embeds: [], components: [] });
            } else if (m.customId === 'cancel') {
                await m.deferUpdate();
                return await m.followUp({ content: `Canceled!`, embeds: [], components: [] });
            }
        }); 
	},
};