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
  options: [{
    name: "type",
    description: "The New Name",
    type: 3,
    required: true,
    choices: [
      { name: 'Online', value: 'online' },
      { name: 'Offline', value: 'offline' },
      { name: 'Auto', value: 'auto' }]
  },
  {
    name: "count",
    description: "< count > / all",
    type: 3,
    required: true,
  }],
  async execute(client, interaction) {

    if (interaction.guild && interaction.guild.id !== config.serverID) return interaction.reply({ content: `**The Bot Privet To NightStar**`, ephemeral: true })
    if (!config.owners.includes(interaction.user.id)) return interaction.reply({ content: `**You Not Owner**`, ephemeral: true })

    let oonnline_on = interaction.options.getString("type")
    let countss = interaction.options.getString("count")

    if (interaction.user.bot) return
    //// Online Code
    if ((oonnline_on == "online")) {
      if (!countss) return interaction.reply({ content: "Please, Type the new token price ." })
      if (isNaN(countss)) return interaction.reply({ content: "Please, Enter a Valid number!" })
      online.findOne({ guildId: interaction.guild.id }, async (err, data) => {
        if (!data) {
          new online({
            guildId: interaction.guild.id,
            price: countss
          }).save()
        } else {
          data.price = countss
          data.save()
        }
      })
      interaction.reply({ embeds: [MessageEmbedon("#3bfc40", `**The online tokens price has been changed to \`${countss}\`**`)] })
      return
    }
    //// Offlien Code
    if ((oonnline_on == "offline")) {
      if (!countss) return interaction.reply({ content: "Please, Type the new token price ." })
      if (isNaN(countss)) return interaction.reply({ content: "Please, Enter a Valid number!" })
      offline.findOne({ guildId: interaction.guild.id }, async (err, data) => {
        if (!data) {
          new offline({
            guildId: interaction.guild.id,
            price: countss
          }).save()
        } else {
          data.price = countss
          data.save()
        }
      })
      interaction.reply({ embeds: [MessageEmbedon("#5b5b5b", `**The offline tokens price has been changed to \`${countss}\`**`)] })

      return
    }
    //// Auto Code
    if ((oonnline_on == "auto")) {
      if (!countss) return interaction.reply({ content: "Please, Type the new token price ." })
      if (isNaN(countss)) return interaction.reply({ content: "Please, Enter a Valid number!" })
      auto.findOne({ guildId: interaction.guild.id }, async (err, data) => {
        if (!data) {
          new auto({
            guildId: interaction.guild.id,
            price: countss
          }).save()
        } else {
          data.price = countss
          data.save()
        }
      })
      interaction.reply({ embeds: [MessageEmbedon("#660000", `**The auto tokens price has been changed to \`${countss}\`**`)] })
      return
    }

    interaction.reply(`**يرجي تحديد نوع التوكنات (offline / online / auto)**`)
  }
}