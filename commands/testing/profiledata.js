const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const axios = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('testprofiledata')
		.setDescription('Buggy af')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
	async execute(interaction) {
        const res = await axios.get(`https://sky.shiiyu.moe/api/v2/profile/LifeOverflow`)

        let profiles = Object.values(res.data.profiles)

        profiles.forEach(async (profile) => {
            if (profile.current) {
                console.log(profile.profile_id)
            }
        })

        interaction.reply({ content: '!', ephemeral: true })
	},
};