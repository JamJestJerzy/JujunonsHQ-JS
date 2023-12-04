const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ghostping')
		.setDescription('Ghostpings @everyone >:)')
        .setDefaultMemberPermissions(PermissionFlagsBits.MentionEveryone)
        .setDMPermission(false),
	async execute(interaction) {
        try {
            await interaction.channel.send({ content: '@everyone', flags: [ 4096 ] }).then(msg => {msg.delete()})
            await interaction.reply({ content: 'Ghostpinged @everyone >:)', ephemeral: true })
        } catch (error) {
            console.log(error)
        }
	},
};
