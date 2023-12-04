const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		console.log(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`)
		client.user.setStatus('idle');

		/*
		let channel = await client.channels.fetch('1082591631087259688')
		let messagesFetch = await channel.messages.fetch('1154006015205969960')
		messagesFetch.reply('<:Hollow:1154009098388525056>')
		*/
	},
};