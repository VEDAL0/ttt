const Discord = require("discord.js");
const DiscordOauth2 = require("discordouth3");
const Users = require("../../data/offline");
const Online = require("../../data/online");
const Auto = require("../../data/auto");

const { Client, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Intents, messageCreate, EmbedBuilder, WebhookClient } = require("discord.js");
const black = require("../../data/blacklist")
const offline = require("../../data/price/offline")
const online = require("../../data/price/online")
const autoo = require("../../data/price/auto")
const emoji = require("../../json/emoji")
function MessageEmbedon(color, description) {
  const embed = new MessageEmbed()
    .setColor(color)
    .setDescription(description)
  return embed
}

module.exports = {
  name: "stock",
  description: `Test the bots response time.`,
  aliases: [],
  async execute(client, message, args) {
    //balcklist
    const blacklist = await black.findOne({ userId: message.author.id }).exec();
    if (blacklist) return message.reply({ embeds: [MessageEmbedon("#cc0000", `:red_circle: \`|\` You are on the blacklist, please contact the owners to solve your problem !`)] })

    const Oonline = await online.findOne({ guildId: message.guild.id }).exec();
    if (!Oonline) return message.reply({ embeds: [MessageEmbedon("#5b5b5b", `The owners must make a Onine price first .`)] })

    const offfline = await offline.findOne({ guildId: message.guild.id }).exec();
    if (!offfline) return message.reply({ embeds: [MessageEmbedon("#3bfc40", `The owners must make a Offline price first .`)] })

    const aauto = await autoo.findOne({ guildId: message.guild.id }).exec();
    if (!aauto) return message.reply({ embeds: [MessageEmbedon("#660000", `The owners must make a Auto price first .`)] })

    let users = await Users.find();
    let onlines = await Online.find();
    let auto = await Auto.find();
    const all = onlines.length + users.length + auto.length
    let embed = new MessageEmbed()
      .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
      .setTimestamp()
      .setFooter({text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({dynamic: true})})
      .setDescription(`
**${emoji.offline} Offline** : **${users.length}**
**${emoji.online} Online** : **${onlines.length}**
**${emoji.auto} Auto** : **${auto.length}**

**${emoji.all} All** : **${all}**`)
    message.reply({ embeds: [embed] })
  }
}