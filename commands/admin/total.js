const { connect } = require("net");
const Discord = require("discord.js");
const DiscordOauth2 = require("discordouth3");
const Users = require("../../data/offline");
const Online = require("../../data/online");
const Auto = require("../../data/auto");
const config = require('../../json/config.js');
const { Client, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Intents, messageCreate, EmbedBuilder, WebhookClient } = require("discord.js");


module.exports = {
  name: "total",
  description: `Test the bots response time.`,
  aliases: [],
  async execute(client, message, args) {

    if (message.guild && message.guild.id !== config.serverID) return;
    if (!config.owners.includes(message.author.id)) return;
    let users = await Users.find();
    let onlines = await Online.find();
    let auto = await Auto.find();
    let all = users.length + onlines.length + auto.length
    message.reply({ content: `**Total Members in database is \`${all}\`**` })
  }
};