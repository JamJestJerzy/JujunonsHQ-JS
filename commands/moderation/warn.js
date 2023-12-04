const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const numbers = require('../../functions/numbers');

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
		.setName('warn')
		.setDescription('Warns user')
        .addUserOption(option =>
			option
                .setName('user')
				.setDescription('User to warn')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('The reason of warn'))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
	async execute(interaction) {
        const target = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') ?? 'No reason provided';

        const member = interaction.guild.members.cache.get(target.id)

        if (member.id === '1153269776320307250') return interaction.reply({ content: 'You cannot warn me!' })

        let connection = await sql.connect(config)
        const pool = connection.request()

        pool.input('userid', sql.VarChar, target.id)

        const check = await pool.query(`SELECT * FROM jujunonshq.warns WHERE userid = @userid`)

        if (check.recordset.length == 0) await pool.query(`INSERT INTO jujunonshq.warns (userid) VALUES (@userid);`)

        const query = await pool.query(`SELECT * FROM jujunonshq.warns WHERE userid = @userid`)

        pool.input('warns', sql.Int, query.recordset[0].warns + 1)
        pool.input('totalwarns', sql.Int, query.recordset[0].totalwarns + 1)

        pool.query(`UPDATE jujunonshq.warns SET warns = @warns, totalwarns = @totalwarns WHERE userid = @userid;`)

        const emb = new EmbedBuilder()
			.setAuthor({ name: `You got warned in ${interaction.guild.name}!`, iconURL: interaction.user.displayAvatarURL() })
			.addFields({ name: 'Reason', value: `\`${reason}\``, inline: true })
			.setDescription(`This is your \`${numbers.order(query.recordset[0].warns + 1)}\` warn (\`${query.recordset[0].totalwarns + 1}\` in total)\nAdministrator: ${interaction.user.username}`)
			.setTimestamp()
			.setColor('a3def8')

        const reply = new EmbedBuilder()
            .setDescription(`Warned <@${target.id}> for \`${reason}\`\nThis is his \`${numbers.order(query.recordset[0].warns + 1)}\` warn (\`${query.recordset[0].totalwarns + 1}\` in total)`)
            .setTimestamp()
			.setColor('a3def8')
        
        const bannedReply = new EmbedBuilder()
            .setDescription(`<@${target.id}> got banned cus he got warned 5 god damn times.`)
            .setTimestamp()
			.setColor('a3def8')

        const checkQuery = await pool.query(`SELECT * FROM jujunonshq.warns WHERE userid = @userid`)

        if (checkQuery.recordset[0].warns >= 5) {
            const DMEmb = new EmbedBuilder()
                .setAuthor({
                    name: `You got banned from ${interaction.guild.name}!`,
                    iconURL: interaction.user.displayAvatarURL(),
                })
                .addFields({
                    name: "Reason:",
                    value: `\`You got warned 5 god damn times\``,
                    inline: true,
                })
                .setDescription(`Administrator: \`${interaction.user.username}\``)
                .setTimestamp()
                .setColor('a3def8')

            await target.send({ embeds: [DMEmb] })
            await member.ban({ reason: `You got warned 5 god damn times. Like wtf?` });
            return await interaction.reply({ embeds: [bannedReply] });
        }

		await interaction.reply({ embeds: [reply] });
        await target.send({ embeds: [emb] })
	},
};