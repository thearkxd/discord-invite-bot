const inviteMemberSchema = require("../schemas/inviteMember");
const moment = require("moment");
moment.locale("tr");

module.exports = {
  conf: {
    aliases: ["davetler"],
    name: "invites"
  },

  run: async (client, message, args, embed) => {
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    const data = await inviteMemberSchema.find({ guildID: message.guild.id, inviter: member.user.id });
    const filtered = data.filter(x => message.guild.members.cache.get(x.userID));
    console.log(filtered)
    embed.setDescription(filtered.length > 0 ? filtered.map(m => `<@${m.userID}> - ${moment(m.date).format("LLL")}`).join("\n") : "Kimseyi davet etmemiş!");
    message.channel.send(embed);
  },
};
