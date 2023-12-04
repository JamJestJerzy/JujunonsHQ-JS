const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const dayjs = require('dayjs')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Provides information about the user.')
        .addUserOption(option =>
			option.setName('user')
				.setDescription('User to get information about (optional)')),
	async execute(interaction) {
        const target = interaction.options.getUser('user');

        if (target) {
            var user = target
            var member = interaction.guild.members.cache.get(target.id)
        } else {
            var user = interaction.user
            var member = interaction.member
        }

        let emb = new EmbedBuilder()
            .setAuthor({name: member.user.username, iconURL: member.user.displayAvatarURL()})
            .addFields(
                { name: 'User ID', value: `\`${user.id}\``, inline: true },
                { name: 'Username', value: `\`${user.username}\``, inline: true },
                { name: 'Display Name', value: `\`${user.globalName}\``, inline: true },
                { name: 'Joined Guild', value: `\`${member.joinedAt.toDateString()}\``, inline: true },
                { name: 'Created At', value: `\`${member.user.createdAt.toDateString()}\``, inline: true }
            )
            .setTimestamp()
            .setColor('a3def8')
		await interaction.reply({ embeds: [emb] });
	},
};