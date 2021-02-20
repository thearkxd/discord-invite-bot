const db = require("../schemas/inviter");

module.exports = {
  conf: {
    aliases: ["invtop", "invite-top", "davet-top", "davettop"],
    name: "top"
  },

  run: async (client, message, args, embed) => {
    let data = await db.find({ guildID: message.guild.id }).sort({ total: -1 });
    if (!data.length)return message.channel.send(embed.setDescription("Herhangi bir invite verisi bulunamadı!"));
    let arr = [];
    data.forEach((x) => arr.push({ id: x.userID, total: x.total }));
    let index = arr.findIndex((x) => x.id == message.author.id) + 1;

    let list = data
      .filter((x) => message.guild.members.cache.has(x.userID))
      .splice(0, 10)
      .map((x, index) => `${x.userID === message.author.id ? `**${index + 1}. <@${x.userID}> - Toplam ${x.total} davet (${x.regular} gerçek, ${x.bonus} bonus, ${x.fake} fake, ${x.leave} ayrılmış)**` : `**${index + 1}.** <@${x.userID}> - Toplam **${x.total}** davet \`(${x.regular} gerçek, ${x.bonus} bonus, ${x.fake} fake, ${x.leave} ayrılmış)\``}`)
      .join("\n");

    const veri = await db.findOne({ guildID: message.guild.id, userID: message.author.id });
    if (index < 10) {
      embed.setTitle("Leaderboard");
      embed.setDescription(list);
      message.channel.send(embed);
    } else {
      embed.setTitle("Leaderboard");
      embed.setDescription( `${list} \n... \n**${index}. ${message.author} Toplam ${veri.total} davet (${veri.regular} gerçek, ${veri.bonus} bonus, ${veri.fake} fake, ${veri.leave} ayrılmış)**`);
      message.channel.send(embed);
    }
  }
};
