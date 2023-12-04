const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Kicks user')
        .addUserOption(option =>
			option
                .setName('user')
				.setDescription('User to kick')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('The reason of kick'))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .setDMPermission(false),
	async execute(interaction) {
        const target = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') ?? 'No reason provided';

        const emb = new EmbedBuilder()
			.setAuthor({
				name: `You got kicked from ${interaction.guild.name}!`,
				iconURL: interaction.user.displayAvatarURL(),
			})
			.addFields({
				name: "Reason",
				value: `\`${reason}\``,
				inline: true,
			})
			.setDescription(`Administrator: ${interaction.user.username}`)
			.setTimestamp()
			.setColor('a3def8')

		await interaction.reply(`Kicked \`${target.username}\` for \`${reason}\``);
        await target.send({ embeds: [emb] })
        await interaction.guild.members.kick(target);
	},
};