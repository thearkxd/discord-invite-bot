const client = global.client;

/**
 * @param {Invite} invite
 * @returns {Promise<void>}
 */
module.exports = async (invite) => {
  const gi = client.invites.get(invite.guild.id);
  if (!gi) return;
  gi.delete(invite.code);
  client.invites.delete(invite.guild.id, gi);
};

module.exports.conf = {
  name: "inviteDelete",
};
