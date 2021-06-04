const client = global.client;

/**
 * @returns {Promise<void>}
 */
module.exports = async () => {
  client.guilds.cache.forEach(async (guild) => {
    const invites = await guild.fetchInvites();
    client.invites.set(guild.id, invites);
  });
};

module.exports.conf = {
  name: "ready",
};
