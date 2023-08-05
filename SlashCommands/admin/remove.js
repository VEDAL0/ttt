const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const DiscordOauth2 = require("discordouth3");
const db = require("pro.db")
const black = require("../../data/blacklist")
const config = require('../../json/config.js');


function MessageEmbedon(color, description) {
  const embed = new Discord.MessageEmbed()
    .setColor(color)
    .setDescription(description)
  return embed
}

module.exports = {
  name: "remove",
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
    name: "serverid",
    description: "serverID",
    type: 3,
    required: true,
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



    const blacklist = await black.findOne({ userId: interaction.user.id }).exec();
    if (blacklist) return interaction.reply({ embeds: [MessageEmbedon("BLUE", `:red_circle: \`|\` You are on the blacklist, please contact the owners to solve your problem !`)] })

    let oonnline_on = interaction.options.getString("type")
    let guildId = interaction.options.getString("serverid")
    let count = interaction.options.getString("count")


    if (!oonnline_on) return interaction.reply(`**يرجي تحديد نوع التوكنات (offline / online / auto)**`)


    if (interaction.user.bot) return
    //// Online Code
    if ((oonnline_on == "online")) {
      const Users = require("../../data/offline");
      const oauth = new DiscordOauth2();
      let guild = client.guilds.cache.get(guildId)
      if (!guildId || !guild) return interaction.reply({ content: `I'm not in this guild .` })
      if (!count || (isNaN(count) && count !== 'all')) return interaction.reply({ content: `You should specify a vaild amount of tokens <amount / all> .` })
      const users = await Users.find();
      if (count !== 'all') {
        let members = await guild.members.fetch()
        let xx = users.filter(e => members.find(ee => ee.user.id === e.userId));
        let not = users.length - xx.length
        if (xx.length < count) {
          interaction?.reply({ content: `There is only **${xx.length}** token in **${guild.name}**` })
          return;
        }
        let i = 0
        let r = 0
        let timeout;
        interaction?.reply({ content: `Tried to remove **${count} Token**\n\nRemoved: **${i}**\nFailed: **${r}**` }).then(m => {
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
              botToken: client.token,
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
          interaction?.reply({ content: `There is no tokens in **${guild.name}**, nothing to remove .` })
          return;
        }
        let not = users.length - xx.length
        let i = 0
        let r = 0
        let timeout
        await interaction.reply({ content: `Tried to remove **${users.length} Members**\n\nRemoved : **${i}**\nFailed: **${r}**` }).then(() => {
          timeout = setInterval(async () => {
            await interaction.editReply({ content: `Tried to remove **${users.length} Members**\n\nRemoved: **${i}**\nFailed: **${r}**` })
          }, 5000)
        }).then(() => {
          if (i + r == users.length) return clearInterval(timeout)
        })
        for (let x = 0; x < xx.length; x++) {
          let user = xx[x]
          if (user.accessToken) {
            oauth.removeMember({
              guildId: guildId,
              botToken: client.token,
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
      let guild = client.guilds.cache.get(guildId)
      if (!guildId || !guild) return interaction.reply({ content: `I'm not in this guild .` })
      if (!count || (isNaN(count) && count !== 'all')) return interaction.reply({ content: `You should specify a vaild amount of tokens <amount / all> .` })
      const users = await Users.find();
      if (count !== 'all') {
        let members = await guild.members.fetch()
        let xx = users.filter(e => members.find(ee => ee.user.id === e.userId));
        let not = users.length - xx.length
        if (xx.length < count) {
          interaction?.reply({ content: `There is only **${xx.length}** token in **${guild.name}**` })
          return;
        }
        let i = 0
        let r = 0
        let timeout
        await interaction.reply({ content: `Tried to remove **${users.length} Members**\n\nRemoved : **${i}**\nFailed: **${r}**` }).then(() => {
          timeout = setInterval(async () => {
            await interaction.editReply({ content: `Tried to remove **${users.length} Members**\n\nRemoved : **${i}**\nFailed: **${r}**` })
          }, 5000)
        }).then(() => {
          if (i + r == users.length) return clearInterval(timeout)
        })
        for (let x = 0; x < count; x++) {
          let user = xx[x]
          if (user.accessToken) {
            oauth.removeMember({
              guildId: guildId,
              botToken: client.token,
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
          interaction?.reply({ content: `There is no tokens in **${guild.name}**, nothing to remove .` })
          return;
        }
        let not = users.length - xx.length
        let i = 0
        let r = 0
        let timeout;
        interaction?.reply({ content: `Tried to remove **${xx.length} Token**\n\nRemoved: **${i}**\nFailed: **${r}**` }).then(m => {
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
              botToken: client.token,
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
      let guild = client.guilds.cache.get(guildId)
      if (!guildId || !guild) return interaction.reply({ content: `I'm not in this guild .` })
      if (!count || (isNaN(count) && count !== 'all')) return interaction.reply({ content: `You should specify a vaild amount of tokens <amount / all> .` })
      const users = await Users.find();
      if (count !== 'all') {
        let members = await guild.members.fetch()
        let xx = users.filter(e => members.find(ee => ee.user.id === e.userId));
        let not = users.length - xx.length
        if (xx.length < count) {
          interaction?.reply({ content: `There is only **${xx.length}** token in **${guild.name}**` })
          return;
        }
        let i = 0
        let r = 0
        let timeout
        await interaction.reply({ content: `Tried to remove **${users.length} Members**\n\nRemoved : **${i}**\nFailed: **${r}**` }).then(() => {
          timeout = setInterval(async () => {
            await interaction.editReply({ content: `Tried to remove **${users.length} Members**\n\nRemoved : **${i}**\nFailed: **${r}**` })
          }, 5000)
        }).then(() => {
          if (i + r == users.length) return clearInterval(timeout)
        })
        for (let x = 0; x < count; x++) {
          let user = xx[x]
          if (user.accessToken) {
            oauth.removeMember({
              guildId: guildId,
              botToken: client.token,
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
          interaction?.reply({ content: `There is no tokens in **${guild.name}**, nothing to remove .` })
          return;
        }
        let not = users.length - xx.length
        let i = 0
        let r = 0
        let timeout;
        interaction?.reply({ content: `Tried to remove **${xx.length} Token**\n\nRemoved: **${i}**\nFailed: **${r}**` }).then(m => {
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
              botToken: client.token,
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
    interaction.reply(`**يرجي تحديد نوع التوكنات (offline / online / auto)**`)
  }
}