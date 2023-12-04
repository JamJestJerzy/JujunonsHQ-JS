const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const dayjs = require('dayjs')

const sql = require("mssql")
const { mssqlUser, mssqlPassword, mssqlIp, mssqlDatabase } = require('../../config.json')
const config = {
	user: mssqlUser,
	password: mssqlPassword,
	server: mssqlIp,
	database: mssqlDatabase,
    encrypt: false,
	trustServerCertificate: true
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('removejujuhater')
		.setDescription('Removes selected user from juju haters database.')
        .addStringOption(option =>
            option
                .setName('uuid')
                .setDescription('UUID of user in database. Get uuid from /jujuhaters command.')
                .setRequired(true)),
	async execute(interaction) {
        const uuid = interaction.options.getString('uuid');

        let connection = await sql.connect(config)
        const pool = connection.request()

        pool.input('uuid', sql.VarChar, uuid)

        // If there is no such user id db (or its hidden)
        const check = await pool.query(`SELECT * FROM jujunonshq.jujuhaters WHERE mcuuid LIKE @uuid AND exist = 1`)
        if (check.recordset.length == 0) {
            const notInEmb = new EmbedBuilder()
                .setDescription(`User with uuid "\`${uuid}\`" doesn't exist in database!`)
                .setTimestamp()
                .setColor('a3def8')
            return interaction.reply({ embeds: [notInEmb] })
        }

        const emb = new EmbedBuilder()
            .setAuthor({
                name: `Removed hater from database!`,
                iconURL: interaction.user.displayAvatarURL(),
            })
            .setDescription(`Removed user with uuid\n\`${uuid}\`\n(and IGN \`${check.recordset[0].ign}\`)\nfrom database!`)
            .setTimestamp()
            .setColor('a3def8')

        const noPermsEmb = new EmbedBuilder()
            .setDescription(`You don't have permissions to do that!`)
            .setTimestamp()
            .setColor('a3def8')

        if (interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            await pool.query(`UPDATE jujunonshq.jujuhaters SET exist = 0 WHERE mcuuid = @uuid;`)
            return interaction.reply({ embeds: [emb] })
        } else if (check.recordset[0].addedby === interaction.user.id) {
            await pool.query(`UPDATE jujunonshq.jujuhaters SET exist = 0 WHERE mcuuid = @uuid;`)
            return interaction.reply({ embeds: [emb] })
        } else {
            return interaction.reply({ embeds: [noPermsEmb]})
        }
	},
};