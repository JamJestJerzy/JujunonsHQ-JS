const { Events } = require('discord.js');

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
        if (!message.mentions.everyone) return;

        return await message.delete();
	},
};