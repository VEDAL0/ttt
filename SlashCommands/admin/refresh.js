const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { connect } = require("net");
const DiscordOauth2 = require("discordouth3");
const black = require("../../data/blacklist")
const fetch = require("node-fetch");
const config = require('../../json/config.js');
// const wait = require('node:timers/promises').setInterval;

function MessageEmbedon(color, description) {
  const embed = new Discord.MessageEmbed()
    .setColor(color)
    .setDescription(description)
  return embed
}

module.exports = {
  name: "refresh",
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
  }],
  async execute(client, interaction) {

    if (interaction.guild && interaction.guild.id !== config.serverID) return interaction.reply({ content: `**The Bot Privet To NightStar**`, ephemeral: true })

    if (!config.owners.includes(interaction.user.id)) return interaction.reply({ content: `**You Not Owner**`, ephemeral: true })


    const blacklist = await black.findOne({ userId: interaction.user.id }).exec();
    if (blacklist) return interaction.reply({ embeds: [MessageEmbedon("BLUE", `:red_circle: \`|\` You are on the blacklist, please contact the owners to solve your problem !`)] })

    const oonnline_on = interaction.options.getString("type")


    if (interaction.user.bot) return
    //// Online Code
    if ((oonnline_on == "online")) {

      const Users = require("../../data/online");
      const oauth2Data = {
        clientId: client.user.id,
        clientSecret: config.secret,
        redirectUri: config.check,
      };
      const oauth = new DiscordOauth2(oauth2Data);
      let i = 0
      let r = 0
      let users = await Users.find();
      users.forEach(async (user) => {
        if (user.refreshToken) {
          oauth.tokenRequest({
            scope: ["identify", "guilds.join"],
            refreshToken: user.refreshToken,
            grantType: "refresh_token",
          }).then(async (userData) => {
            await Users.findOneAndUpdate(
              {
                userId: user.userId,
              },
              {
                userId: user.userId,
                discordTag: user.discordTag,
                accessToken: userData.access_token,
                refreshToken: userData.refresh_token,
              },
              {
                upsert: true,
              }
            );
            i++
          }).catch(err => {
            r++
          })
        } else {
          r += 1
        }
      });
      let timeout
      await interaction.reply({ content: `Tried to refresh **${users.length} Members**\n\nRefreshed: **${i}**\nFailed: **${r}**` }).then(() => {
        timeout = setInterval(async () => {
          await interaction.editReply({ content: `Tried to refresh **${users.length} Members**\n\nRefreshed: **${i}**\nFailed: **${r}**` })
        }, 5000)
      }).then(() => {
        if (i + r == users.length) return clearInterval(timeout)
      })
      return
    }
    //// Offlien Code
    if ((oonnline_on == "offline")) {

      const Users = require("../../data/offline");

      const oauth2Data = {
        clientId: client.user.id,
        clientSecret: config.secret,
        redirectUri: config.check,
      };
      const oauth = new DiscordOauth2(oauth2Data);
      let i = 0
      let r = 0
      let users = await Users.find();
      users.forEach(async (user) => {

        if (user.refreshToken) {
          oauth.tokenRequest({
            scope: ["identify", "guilds.join"],
            refreshToken: user.refreshToken,
            grantType: "refresh_token",
          }).then(async (userData) => {
            await Users.findOneAndUpdate(
              {
                userId: user.userId,
              },
              {
                userId: user.userId,
                discordTag: user.discordTag,
                accessToken: userData.access_token,
                refreshToken: userData.refresh_token,
              },
              {
                upsert: true,
              }
            );
            i++
          }).catch(err => {
            r++
          })
        } else {
          r += 1
        }
      });
      let timeout
      await interaction.reply({ content: `Tried to refresh **${users.length} Members**\n\nRefreshed: **${i}**\nFailed: **${r}**` }).then(() => {
        timeout = setInterval(async () => {
          await interaction.editReply({ content: `Tried to refresh **${users.length} Members**\n\nRefreshed: **${i}**\nFailed: **${r}**` })
        }, 5000)
      }).then(() => {
        if (i + r == users.length) return clearInterval(timeout)
      })
      return
    }
    //// Auto Code
    if ((oonnline_on == "auto")) {
      const Users = require("../../data/auto");
      const oauth2Data = {
        clientId: client.user.id,
        clientSecret: config.secret,
        redirectUri: config.check,
      };
      const oauth = new DiscordOauth2(oauth2Data);
      let i = 0
      let r = 0
      let users = await Users.find();
      users.forEach(async (user) => {
        if (user.refreshToken) {
          oauth.tokenRequest({
            scope: ["identify", "guilds.join"],
            refreshToken: user.refreshToken,
            grantType: "refresh_token",
          }).then(async (userData) => {
            await Users.findOneAndUpdate(
              {
                userId: user.userId,
              },
              {
                userId: user.userId,
                discordTag: user.discordTag,
                accessToken: userData.access_token,
                refreshToken: userData.refresh_token,
              },
              {
                upsert: true,
              }
            );
            i++
          }).catch(err => {
            r++
          })
        } else {
          r += 1
        }
      });
      let timeout
      await interaction.reply({ content: `Tried to refresh **${users.length} Members**\n\nRefreshed: **${i}**\nFailed: **${r}**` }).then(() => {
        timeout = setInterval(async () => {
          await interaction.editReply({ content: `Tried to refresh **${users.length} Members**\n\nRefreshed: **${i}**\nFailed: **${r}**` })
        }, 5000)
      }).then(() => {
        if (i + r == users.length) return clearInterval(timeout)
      })
      return
    }
    interaction.reply(`**يرجي تحديد نوع التوكنات (offline / online / auto)**`)
  }
}