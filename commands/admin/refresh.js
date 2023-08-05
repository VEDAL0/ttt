const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { connect } = require("net");
const DiscordOauth2 = require("discordouth3");
const black = require("../../data/blacklist")
const fetch = require("node-fetch");
const config = require('../../json/config.js');
const formData = require("form-data");

function MessageEmbedon(color, description) {
  const embed = new Discord.MessageEmbed()
    .setColor(color)
    .setDescription(description)
  return embed
}

module.exports = {
  name: "refresh",
  description: `Test the bots response time.`,
  aliases: [],
  async execute(client, message) {

    if (message.guild && message.guild.id !== config.serverID) return;
    if (!config.owners.includes(message.author.id)) return;

    const blacklist = await black.findOne({ userId: message.author.id }).exec();
    if (blacklist) return message.reply({ embeds: [MessageEmbedon("BLUE", `:red_circle: \`|\` You are on the blacklist, please contact the owners to solve your problem !`)] })

    let args = message.content.trim().split(/ +/g);

    let oonnline_on = args[1]

    if (!oonnline_on) return message.reply(`**يرجي تحديد نوع التوكنات (offline / online / auto)**`)


    if (message.author.bot) return
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
            message.channel.send(user)

            r++
          })
        } else {
          message.channel.send(user)

          r += 1
        }
      });
      let timeout;
      message?.reply({ content: `Tried to refresh **${users.length} Members**\n\nRefreshed: **${i}**\nFailed: **${r}**` }).then(m => {
        timeout = setInterval(() => {
          m?.edit({ content: `Tried to refresh **${users.length} Members**\n\nRefreshed: **${i}**\nFailed: **${r}**` })
          if (i + r == users.length) return clearInterval(timeout)
        }, 5000)
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
            message.channel.send(user)
            r++
          })
        } else {
          message.channel.send(user)
          r += 1
        }
      });
      let timeout;
      message?.reply({ content: `Tried to refresh **${users.length} Members**\n\nRefreshed: **${i}**\nFailed: **${r}**` }).then(m => {
        timeout = setInterval(() => {
          m?.edit({ content: `Tried to refresh **${users.length} Members**\n\nRefreshed: **${i}**\nFailed: **${r}**` })
          if (i + r == users.length) return clearInterval(timeout)
        }, 5000)
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
            message.channel.send(user)

            r++
          })
        } else {
          message.channel.send(user)

          r += 1
        }
      });
      let timeout;
      message?.reply({ content: `Tried to refresh **${users.length} Members**\n\nRefreshed: **${i}**\nFailed: **${r}**` }).then(m => {
        timeout = setInterval(() => {
          m?.edit({ content: `Tried to refresh **${users.length} Members**\n\nRefreshed: **${i}**\nFailed: **${r}**` })
          if (i + r == users.length) return clearInterval(timeout)
        }, 5000)
      })
      return
    }
    message.reply(`**يرجي تحديد نوع التوكنات (offline / online / auto)**`)
  }
}