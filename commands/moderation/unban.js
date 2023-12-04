const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unban')
		.setDescription('Unbans user')
        .addStringOption(option =>
            option
                .setName('id')
                .setDescription('Id of user to unban. Do /banned for list')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDMPermission(false),
	async execute(interaction) {
        const id = interaction.options.getString('id');

		const notIntEmb = new EmbedBuilder()
			.setDescription(`You need to enter id of user to unban.\n\`${id}\` is not a integer, therefore not user id.`)
			.setTimestamp()
			.setColor('a3def8')

		const emb = new EmbedBuilder()
			.setDescription(`User <@${id}> got unbanned!`)
			.setTimestamp()
			.setColor('a3def8')

		const notBannedEmb = new EmbedBuilder()
			.setDescription(`User <@${id}> is not banned.\nTherefore didn't get unbanned.`)
			.setTimestamp()
			.setColor('a3def8')

		if (!Number.parseInt(id)) return interaction.reply({ embeds: [notIntEmb] });

		try {
			await interaction.guild.members.unban(id);
		} catch (err) {
			if (err.rawError.message === 'Unknown Ban') return interaction.reply({ embeds: [notBannedEmb] });
			return console.log(err.rawError.message)
		}

		return interaction.reply({ embeds: [emb] });
	},
};