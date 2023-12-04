const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Bans user')
        .addUserOption(option =>
			option
                .setName('user')
				.setDescription('User to ban')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('The reason of ban'))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDMPermission(false),
	async execute(interaction) {
        const target = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') ?? 'No reason provided';

		const member = interaction.guild.members.cache.get(target.id)

        const DMEmb = new EmbedBuilder()
			.setAuthor({
				name: `You got banned from ${interaction.guild.name}!`,
				iconURL: interaction.user.displayAvatarURL(),
			})
			.addFields({
				name: "Reason:",
				value: `\`${reason}\``,
				inline: true,
			})
			.setDescription(`Administrator: \`${interaction.user.username}\``)
			.setTimestamp()
			.setColor('a3def8')
		
		const emb = new EmbedBuilder()
			.setAuthor({
				name: `User got banned!`,
				iconURL: interaction.client.user.displayAvatarURL(),
			})
			.setDescription(`Banned <@${target.id}>\nFor: \`${reason}\``)
			.setTimestamp()
			.setColor('a3def8')

		try {
			await member.ban({ reason: reason });
		} catch (err) {
			const ErrEmb = new EmbedBuilder()
				.setAuthor({
					name: `An Error accured!`,
					iconURL: interaction.client.user.displayAvatarURL(),
				})
				.setDescription(`While trying to ban\n<@${target.id}>\n\`${err.rawError.message}\``)
				.setTimestamp()
				.setColor('a3def8')
			return interaction.reply({ embeds: [ErrEmb] })
		}

		await target.send({ embeds: [DMEmb] })
		return await interaction.reply({ embeds: [emb] });
	},
};