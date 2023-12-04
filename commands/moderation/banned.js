const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('banned')
		.setDescription('Shows list of banned users')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDMPermission(false),
	async execute(interaction) {
        let list = [];
        interaction.guild.bans.fetch().then(banned => {
            banned.forEach(ban => {
                if (ban.reason === null) ban.reason = 'No reason provided';
                list.push(`<@${ban.user.id}>: \`${ban.reason}\``)
            })
        }).catch(console.error).then(() => {
            const emb = new EmbedBuilder()
                .setAuthor({
                    name: `${list.length} users are banned`,
                    iconURL: interaction.client.user.displayAvatarURL(),
                })
                .setDescription(`${list.join('\n')}`)
                .setTimestamp()
                .setColor('a3def8')

            interaction.reply({ embeds: [emb] })
        })
	},
};