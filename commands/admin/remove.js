const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const DiscordOauth2 = require("discordouth3");
const db = require("pro.db")
const black = require("../../data/blacklist")
const config = require('../../json/config.js');
const Discord = require("discord.js")

function MessageEmbedon(color, description) {
  const embed = new Discord.MessageEmbed()
    .setColor(color)
    .setDescription(description)
  return embed
}

module.exports = {
  name: "remove",
  description: `Test the bots response time.`,
  aliases: [],
  async execute(client, message) {

    if (message.guild && message.guild.id !== config.serverID) return;
    if (!config.owners.includes(message.author.id)) return;

    const blacklist = await black.findOne({ userId: message.author.id }).exec();
    if (blacklist) return message.reply({ embeds: [MessageEmbedon("BLUE", `:red_circle: \`|\` You are on the blacklist, please contact the owners to solve your problem !`)] })
    let args = message.content.trim().split(/ +/g);
    let oonnline_on = args[1]
    let guildId = args[2]
    let countss = args[3]


    if (!oonnline_on) return message.reply(`**يرجي تحديد نوع التوكنات (offline / online / auto)**`)


    if (message.author.bot) return
    //// Online Code
    if ((oonnline_on == "online")) {
      const Users = require("../../data/offline");
      const oauth = new DiscordOauth2();
      let count = countss
      let guild = client.guilds.cache.get(guildId)
      if (!guildId || !guild) return message.reply({ content: `I'm not in this guild .` })
      if (!count || (isNaN(count) && count !== 'all')) return message.reply({ content: `You should specify a vaild amount of tokens <amount / all> .` })
      const users = await Users.find();
      if (count !== 'all') {
        let members = await guild.members.fetch()
        let xx = users.filter(e => members.find(ee => ee.user.id === e.userId));
        let not = users.length - xx.length
        if (xx.length < count) {
          message?.reply({ content: `There is only **${xx.length}** token in **${guild.name}**` })
          return;
        }
        let i = 0
        let r = 0
        let timeout;
        message?.reply({ content: `Tried to remove **${count} Token**\n\nRemoved: **${i}**\nFailed: **${r}**` }).then(m => {
          timeout = setInterval(() => {
            m?.edit({ content: `Tried to remove **${count} Token**\n\nRemoved: **${i}**\nFailed: **${r}**` })
            if (i + r == count) return clearInterval(timeout)
          }, 5000)
        })
        for (let x = 0; x < count; x++) {
          let user = xx[x]
          if (user.accessToken) {
            oauth.removeMember({
              guildId: guildId,
              botToken: process.env.token,
              userId: user.userId,
            }).then(m => {
              i += 1
            }).catch(err => {
              r += 1
            })
          } else {
            r += 1
          }
        }
      } else {
        count = users.length
        let members = await guild.members.fetch()
        let xx = users.filter(e => members.find(ee => ee.user.id === e.userId));
        count = xx.length
        if (count == 0) {
          message?.reply({ content: `There is no tokens in **${guild.name}**, nothing to remove .` })
          return;
        }
        let not = users.length - xx.length
        let i = 0
        let r = 0
        let timeout;
        message?.reply({ content: `Tried to remove **${xx.length} Token**\n\nRemoved: **${i}**\nFailed: **${r}**` }).then(m => {
          timeout = setInterval(() => {
            m?.edit({ content: `Tried to remove **${xx.length} Token**\n\nRemoved: **${i}**\nFailed: **${r}**` })
            if (i + r == count) return clearInterval(timeout)
          }, 5000)
        })
        for (let x = 0; x < xx.length; x++) {
          let user = xx[x]
          if (user.accessToken) {
            oauth.removeMember({
              guildId: guildId,
              botToken: process.env.token,
              userId: user.userId,
            }).then(m => {
              i += 1
            }).catch(err => {
              r += 1
            })
          } else {
            r += 1
          }
        }
      }
      return
    }
    //// Offlien Code
    if ((oonnline_on == "offline")) {
      const Users = require("../../data/offline");
      const oauth = new DiscordOauth2();
      let count = countss
      let guild = client.guilds.cache.get(guildId)
      if (!guildId || !guild) return message.reply({ content: `I'm not in this guild .` })
      if (!count || (isNaN(count) && count !== 'all')) return message.reply({ content: `You should specify a vaild amount of tokens <amount / all> .` })
      const users = await Users.find();
      if (count !== 'all') {
        let members = await guild.members.fetch()
        let xx = users.filter(e => members.find(ee => ee.user.id === e.userId));
        let not = users.length - xx.length
        if (xx.length < count) {
          message?.reply({ content: `There is only **${xx.length}** token in **${guild.name}**` })
          return;
        }
        let i = 0
        let r = 0
        let timeout;
        message?.reply({ content: `Tried to remove **${count} Token**\n\nRemoved: **${i}**\nFailed: **${r}**` }).then(m => {
          timeout = setInterval(() => {
            m?.edit({ content: `Tried to remove **${count} Token**\n\nRemoved: **${i}**\nFailed: **${r}**` })
            if (i + r == count) return clearInterval(timeout)
          }, 5000)
        })
        for (let x = 0; x < count; x++) {
          let user = xx[x]
          if (user.accessToken) {
            oauth.removeMember({
              guildId: guildId,
              botToken: process.env.token,
              userId: user.userId,
            }).then(m => {
              i += 1
            }).catch(err => {
              r += 1
            })
          } else {
            r += 1
          }
        }
      } else {
        count = users.length
        let members = await guild.members.fetch()
        let xx = users.filter(e => members.find(ee => ee.user.id === e.userId));
        count = xx.length
        if (count == 0) {
          message?.reply({ content: `There is no tokens in **${guild.name}**, nothing to remove .` })
          return;
        }
        let not = users.length - xx.length
        let i = 0
        let r = 0
        let timeout;
        message?.reply({ content: `Tried to remove **${xx.length} Token**\n\nRemoved: **${i}**\nFailed: **${r}**` }).then(m => {
          timeout = setInterval(() => {
            m?.edit({ content: `Tried to remove **${xx.length} Token**\n\nRemoved: **${i}**\nFailed: **${r}**` })
            if (i + r == count) return clearInterval(timeout)
          }, 5000)
        })
        for (let x = 0; x < xx.length; x++) {
          let user = xx[x]
          if (user.accessToken) {
            oauth.removeMember({
              guildId: guildId,
              botToken: process.env.token,
              userId: user.userId,
            }).then(m => {
              i += 1
            }).catch(err => {
              r += 1
            })
          } else {
            r += 1
          }
        }
      }
      return
    }
    //// Auto Code
    if ((oonnline_on == "auto")) {
      const Users = require("../../data/auto");
      const oauth = new DiscordOauth2();
      let count = countss
      let guild = client.guilds.cache.get(guildId)
      if (!guildId || !guild) return message.reply({ content: `I'm not in this guild .` })
      if (!count || (isNaN(count) && count !== 'all')) return message.reply({ content: `You should specify a vaild amount of tokens <amount / all> .` })
      const users = await Users.find();
      if (count !== 'all') {
        let members = await guild.members.fetch()
        let xx = users.filter(e => members.find(ee => ee.user.id === e.userId));
        let not = users.length - xx.length
        if (xx.length < count) {
          message?.reply({ content: `There is only **${xx.length}** token in **${guild.name}**` })
          return;
        }
        let i = 0
        let r = 0
        let timeout;
        message?.reply({ content: `Tried to remove **${count} Token**\n\nRemoved: **${i}**\nFailed: **${r}**` }).then(m => {
          timeout = setInterval(() => {
            m?.edit({ content: `Tried to remove **${count} Token**\n\nRemoved: **${i}**\nFailed: **${r}**` })
            if (i + r == count) return clearInterval(timeout)
          }, 5000)
        })
        for (let x = 0; x < count; x++) {
          let user = xx[x]
          if (user.accessToken) {
            oauth.removeMember({
              guildId: guildId,
              botToken: process.env.token,
              userId: user.userId,
            }).then(m => {
              i += 1
            }).catch(err => {
              r += 1
            })
          } else {
            r += 1
          }
        }
      } else {
        count = users.length
        let members = await guild.members.fetch()
        let xx = users.filter(e => members.find(ee => ee.user.id === e.userId));
        count = xx.length
        if (count == 0) {
          message?.reply({ content: `There is no tokens in **${guild.name}**, nothing to remove .` })
          return;
        }
        let not = users.length - xx.length
        let i = 0
        let r = 0
        let timeout;
        message?.reply({ content: `Tried to remove **${xx.length} Token**\n\nRemoved: **${i}**\nFailed: **${r}**` }).then(m => {
          timeout = setInterval(() => {
            m?.edit({ content: `Tried to remove **${xx.length} Token**\n\nRemoved: **${i}**\nFailed: **${r}**` })
            if (i + r == count) return clearInterval(timeout)
          }, 5000)
        })
        for (let x = 0; x < xx.length; x++) {
          let user = xx[x]
          if (user.accessToken) {
            oauth.removeMember({
              guildId: guildId,
              botToken: process.env.token,
              userId: user.userId,
            }).then(m => {
              i += 1
            }).catch(err => {
              r += 1
            })
          } else {
            r += 1
          }
        }
      }
      return
    }
    message.reply(`**يرجي تحديد نوع التوكنات (offline / online / auto)**`)
  }
}