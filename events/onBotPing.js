const { Events, EmbedBuilder, Colors} = require('discord.js');
const os = require('os');

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
        if (!message.content.includes(`<@${message.client.user.id}>`)) return; // If doesnt contain ping
		if (message.author.bot) return;

        console.log(`${message.author.username} pinged bot`)

        const uptimeInSeconds = message.client.uptime / 1000;

        const up_d = (uptimeInSeconds / 86400).toFixed(0);
        const up_h = ((uptimeInSeconds % 86400) / 3600).toFixed(0);
        const up_m = ((uptimeInSeconds % 3600) / 60).toFixed(0);
        const up_s = (uptimeInSeconds % 60).toFixed(0);

        const uptime = `${up_d}d ${up_h}h ${up_m}m ${up_s}s`;

        const emb = new EmbedBuilder()
            .setTitle('Welcome!')
            .setDescription(`
            **Ping:** ${message.client.ws.ping}ms
            **Uptime:** ${uptime}
            **RAM Usage:** ${(process.memoryUsage().heapUsed / 1000000).toFixed(2)} MB
            **Discord.js Version:** ${require('discord.js').version}
            **NodeJS Version:** ${process.versions.node}
            [Source Code (JavaScript)](https://github.com/JamJestJerzy/JujunonsHQ-JS)
            `)
            .setFooter({text: "by Jerzy (dash1e)", iconURL: "https://j3rzy.dev/images/JavaScript.png"})
            .setColor("#FFDF00");

        return await message.reply({ embeds: [emb], allowedMentions: { repliedUser: false } });
	},
};
