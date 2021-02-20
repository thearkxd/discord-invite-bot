const inviterSchema = require("../schemas/inviter");
const inviteMemberSchema = require("../schemas/inviteMember");
const moment = require("moment");
moment.locale("tr");

module.exports = {
  conf: {
    aliases: ["davet"],
    name: "invite"
  },

  run: async (client, message, args, embed) => {
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
    if (!member) return message.reply("bir üye belirtmelisin!");

    if (args[0] === "ekle" || args[0] === "add") {
      if (!message.member.hasPermission(8)) return;
      const amount = args[2];
      if (!amount) return message.reply("bir miktar belirtmelisin!");
      const data = await inviterSchema.findOne({ guildID: message.guild.id, userID: member.user.id });

      if (!data) {
        new inviterSchema({
          guildID: message.guild.id,
          userID: member.user.id,
          total: amount,
          regular: 0,
          bonus: amount,
          leave: 0,
          fake: 0,
        }).save();
      } else {
        data.total += amount;
        data.bonus += amount;
        data.save();
      }

      message.channel.send(embed.setDescription(`${member.toString()} üyesine ${amount} adet bonus davet eklendi!`));
    } else if (args[0] === "sil" || args[0] === "delete") {
      if (!message.member.hasPermission(8)) return;
      const amount = args[2];
      if (!amount) return message.reply("bir miktar belirtmelisin!");
      const data = await inviterSchema.findOne({ guildID: message.guild.id, userID: member.user.id });

      if (!data) return message.reply("bu kişinin invite verisi bulunmuyor!");
      else {
        data.total += amount;
        data.bonus += amount;
        data.save();
      }

      message.channel.send(embed.setDescription(`${member.toString()} üyesinden ${amount} adet bonus davet çıkarıldı!`));
    } else if (args[0] === "sorgu" || args[0] === "query") {
      const data = await inviteMemberSchema.findOne({ guildID: message.guild.id, userID: member.user.id });
      if (!data) return message.reply("bu kişiyi kimin davet ettiğini bulamadım!");
      else {
        const inviter = await client.users.fetch(data.inviter);
        embed.setThumbnail(member.user.avatarURL({ dynamic: true }));
        message.channel.send(embed.setDescription(`${member.toString()} üyesi, ${moment(data.date).format("LLL")} tarihinde \`(${inviter.username} - ${inviter.id})\` tarafından davet edilmiş.`));
      }
    }
  },
};
