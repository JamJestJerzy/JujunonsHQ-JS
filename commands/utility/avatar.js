const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('View a user\'s avatar')
        .addUserOption(option =>
			option.setName('user')
				.setDescription('Member to view avatar of')),
	async execute(interaction) {
        const target = interaction.options.getUser('user');

        if (target) {
            var member = interaction.guild.members.cache.get(target.id)
        } else {
            var member = interaction.member
        }

        const description = `**\\[[128](${member.displayAvatarURL({ size: 128 })})\\] | \\[[256](${member.displayAvatarURL({ size: 256 })})\\] | \\[[512](${member.displayAvatarURL({ size: 512 })})\\] | \\[[1024](${member.displayAvatarURL({ size: 1024 })})\\] | \\[[2048](${member.displayAvatarURL({ size: 2048 })})\\]**`

        let emb = new EmbedBuilder()
            .setColor('a3def8')
            .setDescription(description)
            .setImage(member.displayAvatarURL({ size: 512 }))
            .setFooter({ text: `${member.user.username}'s avatar (in 512x512)` })

		await interaction.reply({ embeds: [emb] });
	},
};