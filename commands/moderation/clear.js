const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

const fs = require('fs');
const dayjs = require('dayjs')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Clears given amount of messages')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Amount of messages to delete')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
	async execute(interaction) {
        const channel = await interaction.client.channels.fetch(interaction.channelId);
        const member = interaction.member

        let number = interaction.options.getInteger('amount')
        let amount
        amount = (number >= 100 ? amount = 100 : amount = number)

        let messagesFetch = await channel.messages.fetch({limit: amount})
        await interaction.channel.bulkDelete(messagesFetch, true)

        let messageList = []
        let logChannel = await interaction.guild.channels.cache.find(r => r.name === 'message-logs')

        let emb = new EmbedBuilder()
            .setAuthor({name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL()})
            .setDescription(`Deleted ${messagesFetch.size} message(s). (from ${number} requested)`)
            .setColor('a3def8')

        await interaction.reply({ embeds: [emb] }).then(msg => {setTimeout(() => msg.delete(), 5000)})

        messagesFetch.forEach(msg => {
            let date = new Date(msg.createdTimestamp)
            messageList.push(`[${dayjs(date).format('DD.MM.YYYY HH:mm')}] ${msg.author.tag}: ${msg.content}`)
        });
        messageList.reverse()
        let text = ` ---------------------------------
- Generated: ${dayjs().format('DD.MM.YYYY HH:mm:ss')}
- Channel: #${channel.name} (${channel.id})
- Together: ${messagesFetch.size} messages 
\ ---------------------------------\n\n`
        let fileName = `./deleted-${interaction.channelId}.txt`
        fs.writeFileSync(fileName, `${text}${messageList.join('\n')}\n\n\n`);
        await logChannel.send({ content: `Deleted ${messagesFetch.size} messages from <#${interaction.channelId}>`, files: [fileName] })
        fs.unlinkSync(fileName);
        return;
	},
};