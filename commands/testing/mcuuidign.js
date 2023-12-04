const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('testuuid')
		.setDescription('Buggy af')
        .addStringOption(option =>
            option
                .setName('uuid')
                .setDescription('UUID of user to get IGN of')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
	async execute(interaction) {
        const uuid = interaction.options.getString('uuid');

        let ign = await fetch(`https://api.minetools.eu/profile/${uuid}`).then(data => data.json()).then(data => data.decoded.profileName)
        console.log(ign)
	},
};