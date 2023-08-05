const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { connect } = require("net");
const DiscordOauth2 = require("discordouth3");
const db = require("pro.db")
const black = require("../../data/blacklist")
const Discord = require("discord.js")
const auto = require("../../data/price/auto")
const online = require("../../data/price/online")
const config = require('../../json/config.js');
const offline = require("../../data/price/offline");

function MessageEmbedon(color, description) {
  const embed = new Discord.MessageEmbed()
    .setColor(color)
    .setDescription(description)
  return embed
}

module.exports = {
  name: "set-price",
  description: `Test the bots response time.`,
  aliases: [],
  async execute(client, message) {

    if (message.guild && message.guild.id !== config.serverID) return;
    if (!config.owners.includes(message.author.id)) return;


    let args = message.content.trim().split(/ +/g);

    let oonnline_on = args[1]
    let countss = args[2]


    if (!oonnline_on) return message.reply(`**يرجي تحديد نوع التوكنات (offline / online / auto)**`)


    if (message.author.bot) return
    //// Online Code
    if ((oonnline_on == "online")) {
      if (!countss) return message.reply({ content: "Please, Type the new token price ." })
      if (isNaN(countss)) return message.reply({ content: "Please, Enter a Valid number!" })
      online.findOne({ guildId: message.guild.id }, async (err, data) => {
        if (!data) {
          new online({
            guildId: message.guild.id,
            price: countss
          }).save()
        } else {
          data.price = countss
          data.save()
        }
      })
      message.reply({ embeds: [MessageEmbedon("#3bfc40", `**The online tokens price has been changed to \`${countss}\`**`)] })
      return
    }
    //// Offlien Code
    if ((oonnline_on == "offline")) {
      if (!countss) return message.reply({ content: "Please, Type the new token price ." })
      if (isNaN(countss)) return message.reply({ content: "Please, Enter a Valid number!" })
      offline.findOne({ guildId: message.guild.id }, async (err, data) => {
        if (!data) {
          new offline({
            guildId: message.guild.id,
            price: countss
          }).save()
        } else {
          data.price = countss
          data.save()
        }
      })
      message.reply({ embeds: [MessageEmbedon("#5b5b5b", `**The offline tokens price has been changed to \`${countss}\`**`)] })

      return
    }
    //// Auto Code
    if ((oonnline_on == "auto")) {
      if (!countss) return message.reply({ content: "Please, Type the new token price ." })
      if (isNaN(countss)) return message.reply({ content: "Please, Enter a Valid number!" })
      auto.findOne({ guildId: message.guild.id }, async (err, data) => {
        if (!data) {
          new auto({
            guildId: message.guild.id,
            price: countss
          }).save()
        } else {
          data.price = countss
          data.save()
        }
      })
      message.reply({ embeds: [MessageEmbedon("#660000", `**The auto tokens price has been changed to \`${countss}\`**`)] })
      return
    }

    message.reply(`**يرجي تحديد نوع التوكنات (offline / online / auto)**`)
  }
}