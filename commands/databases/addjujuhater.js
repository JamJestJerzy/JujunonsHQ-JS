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
		.setName('addjujuhater')
		.setDescription('Adds inputed user to juju haters database.')
        .addStringOption(option =>
            option
                .setName('ign')
                .setDescription('Minecraft IGN of juju hater')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('discord')
                .setDescription('Discord username (not tag, displayname or id) of juju hater')),
	async execute(interaction) {
        const ign = interaction.options.getString('ign');
        const discord = interaction.options.getString('discord') ?? null;

        let mcuserdata = await fetch(`https://api.mojang.com/users/profiles/minecraft/${ign}`).then(data => data.json())

        let connection = await sql.connect(config)
        const pool = connection.request()

        pool.input('uuid', sql.VarChar, mcuserdata.id)
        pool.input('ign', sql.VarChar, mcuserdata.name)
        pool.input('dc', sql.VarChar, discord)
        pool.input('by', sql.VarChar, interaction.user.id)

        // If user with inputed IGN doesn't exist
        if (mcuserdata.errorMessage) {
            const notEdixtEmb = new EmbedBuilder()
                .setDescription(`User with IGN \`${ign}\` does not exist.`)
                .setTimestamp()
                .setColor('a3def8')
            return interaction.reply({ embeds: [notEdixtEmb] })
        }

        const emb = new EmbedBuilder()
            .setAuthor({
                name: `Added hater to database!`,
                iconURL: interaction.user.displayAvatarURL(),
            })
            .setDescription(`Added \`${mcuserdata.name}\` with uuid:\n\`${mcuserdata.id}\`\nAnd discord: \`${discord}\`\nTo database!`)
            .setTimestamp()
            .setColor('a3def8')

        // If user is already in database
        const check = await pool.query(`SELECT * FROM jujunonshq.jujuhaters WHERE mcuuid LIKE @uuid`)
        if (check.recordset.length != 0) {
            // If user is just disabled
            if (!check.recordset[0].exist) {
                await pool.query(`UPDATE jujunonshq.jujuhaters SET exist = 1 WHERE mcuuid = @uuid;`)
                return interaction.reply({ embeds: [emb] })
            }
            const alreadyInEmb = new EmbedBuilder()
                .setAuthor({
                    name: `Hater is already in the database!`,
                    iconURL: interaction.user.displayAvatarURL(),
                })
                .setDescription(`\`${mcuserdata.name}\` is already in database!\nAdded by <@${check.recordset[0].addedby}>`)
                .setTimestamp()
                .setColor('a3def8')
            return interaction.reply({ embeds: [alreadyInEmb] })
        }

        await pool.query(`INSERT INTO jujunonshq.jujuhaters (mcuuid, ign, discord, addedby) VALUES (@uuid, @ign, @dc, @by);`)

        return interaction.reply({ embeds: [emb] })
	},
};