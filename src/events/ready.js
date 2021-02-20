const client = global.client;

module.exports = async () => {
  client.guilds.cache.forEach(async (guild) => {
    const invites = await guild.fetchInvites();
    client.invites.set(guild.id, invites);
  });
};

module.exports.conf = {
  name: "ready",
};
