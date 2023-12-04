const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const dayjs = require('dayjs')

const axios = require('axios');

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
		.setName('jujuhaters')
		.setDescription('Gives list of juju haters added by /addjujuhater command'),
	async execute(interaction) {
        let connection = await sql.connect(config)
        const pool = connection.request()

        let listLength = 0;

        const query = await pool.query(`SELECT * FROM jujunonshq.jujuhaters WHERE exist = 1 ORDER BY ign ASC`)

        const emb = new EmbedBuilder()
        emb.setColor('a3def8')
        emb.setTimestamp()

        await interaction.deferReply();

        let currentIgn

        query.recordset.forEach(async hater => {
            if (hater.discord == null) hater.discord = 'Discord is not provided'

            //currentIgn = await fetch(`https://api.minetools.eu/profile/${hater.mcuuid}`).then(data => data.json()).then(json => json.decoded.profileName)

            //hater.ign = hater.ign + (hater.ign == currentIgn ? '' : ` (${currentIgn})`)

            emb.addFields({ name: hater.ign, value: `\`${hater.mcuuid}\`\n\`${hater.discord}\`\nAdded by <@${hater.addedby}>` })
            listLength++
            //console.log(listLength)
        })

        emb.setAuthor({ name: query.recordset.length + ' hater' + (query.recordset.length == 1 ? '' : 's') + ' are in database!', iconURL: interaction.client.user.displayAvatarURL() })

        if (listLength === query.recordset.length) return interaction.editReply({ embeds: [emb] })
	},
};
