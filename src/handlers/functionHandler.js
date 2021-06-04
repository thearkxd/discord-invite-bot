const { GuildMember, TextChannel, MessageEmbed } = require("discord.js");
const { emojis } = require("../configs/config.json");
const task = require("../schemas/task");
const coin = require("../schemas/coin");

/**
 * @param { Client } client
 */
module.exports = function (client) {
	/**
	 * @param {String} guildID
	 * @param {String} type
	 * @param {Number} data
	 * @param {TextChannel|VoiceChannel} channel
	 * @returns {Promise<void>}
	 */
	GuildMember.prototype.updateTask = async function (guildID, type, data, channel = null) {
		const taskData = await task.find({ guildID, userID: this.user.id, type, active: true });
		taskData.forEach(async (x) => {
			if (channel && x.channels && x.channels.some((x) => x !== channel.id)) return;
			x.completedCount += data;
			if (x.completedCount >= x.count) {
				x.active = false;
				x.completed = true;
				await coin.findOneAndUpdate({ guildID, userID: this.user.id }, { $inc: { coin: x.prizeCount } });

				const embed = new MessageEmbed().setColor(this.displayHexColor).setAuthor(this.displayName, this.user.avatarURL({ dynamic: true, size: 2048 })).setThumbnail("https://img.itch.zone/aW1nLzIzNzE5MzEuZ2lm/original/GcEpW9.gif");
				if (channel && channel.type === "text") channel.send(embed.setDescription(`
				${this.toString()} Tebrikler! ${type.charAt(0).toLocaleUpperCase() + type.slice(1)} görevini başarıyla tamamladın.
				
				${x.message}
				${emojis.coin} \`${x.prizeCount} coin kazandın!\`
				`));
			}
			await x.save();
		});
	};

	/**
	 * @param {Message} message
	 * @param {String} text
	 * @returns {Promise<void>}
	 */
	TextChannel.prototype.error = async function (message, text) {
		const theark = await client.users.fetch("350976460313329665");
		const embed = new MessageEmbed()
			.setColor("RED")
			.setAuthor(
				message.member.displayName,
				message.author.avatarURL({ dynamic: true, size: 2048 })
			)
			.setFooter("Developed by Theark", theark.avatarURL({ dynamic: true }));
		return this.send(embed.setDescription(text)).then((x) => {
			if (x.deletable) x.delete({ timeout: 10000 });
		});
	};
};
