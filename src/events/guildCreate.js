const client = global.client;

module.exports = async (guild) => {
  const invites = await guild.fetchInvites();
  client.invites.set(guild.id, invites);
};

module.exports.conf = {
  name: "guildCreate",
};
