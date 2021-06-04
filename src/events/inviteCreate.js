const client = global.client;

/**
 * @param {Invite} invite
 * @returns {Promise<void>}
 */
module.exports = async (invite) => {
  const gi = client.invites.get(invite.guild.id);
  gi.set(invite.code, invite);
  client.invites.set(invite.guild.id, gi);
};

module.exports.conf = {
  name: "inviteCreate",
};
