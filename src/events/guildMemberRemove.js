const client = global.client;
const inviterSchema = require("../schemas/inviter");
const inviteMemberSchema = require("../schemas/inviteMember");
const conf = require("../configs/config.json");

module.exports = async (member) => {
  const channel = member.guild.channels.cache.get(conf.invLogChannel);
  if (!channel || member.user.bot) return;

  const inviteMemberData = await inviteMemberSchema.findOne({ guildID: member.guild.id, userID: member.user.id });
  if (!inviteMemberData) return channel.send(`\`${member.user.tag}\` sunucumuzdan ayrıldı ama kim tarafından davet edildiğini bulamadım.`);
  const inviter = await client.users.fetch(inviteMemberData.inviter);
  await inviterSchema.findOneAndUpdate({ guildID: member.guild.id, userID: inviter.id }, { $inc: { leave: 1, total: -1 } }, { upsert: true });
  const inviterData = await inviterSchema.findOne({ guildID: member.guild.id, userID: inviter.id, });
  const total = inviterData ? inviterData.total : 0;
  channel.send(`\`${member.user.tag}\` sunucumuzdan ayrıldı. ${inviter.tag} tarafından davet edilmişti. (**${total}** davet)`);
  const inviterMember = member.guild.members.cache.get(inviter.id);
  if (inviterMember) await inviterMember.updateTask(member.guild.id, "invite", -1);
};

module.exports.conf = {
  name: "guildMemberRemove",
};
