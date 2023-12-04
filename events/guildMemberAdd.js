const { Events, EmbedBuilder } = require('discord.js');
const dayjs = require('dayjs')

const sql = require("mssql")
const { mssqlUser, mssqlPassword, mssqlIp, mssqlDatabase } = require('../config.json')
const config = {
	user: mssqlUser,
	password: mssqlPassword,
	server: mssqlIp,
	database: mssqlDatabase,
    encrypt: false,
	trustServerCertificate: true
}

module.exports = {
	name: Events.GuildMemberAdd,
	async execute(member) {
        let connection = await sql.connect(config)
        const pool = connection.request()

        pool.input('username', sql.VarChar, member.user.username)
        const query = await pool.query(`SELECT * FROM jujunonshq.jujuhaters WHERE discord LIKE @username AND exist = 1`)

        if (query.recordset.length != 0) {
            const announcements = await member.guild.channels.cache.find(r => r.name === 'announcements')

            const emb = new EmbedBuilder()
                .setDescription(`Juju hater joined our server!\nWelcome <@${member.user.id}> (\`${query.recordset[0].ign}\`)!`)
                .setColor('a3def8')

            return announcements.send({ embeds: [emb] })
        } else return
	},
};