const { Client, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, messageCreate, EmbedBuilder, WebhookClient, ButtonBuilder, ActionRowBuilder, Util } = require("discord.js");
const config = require('../../json/config.js');
const { connect } = require("net");
module.exports = {
  name: "leaves",
  description: 'Feeling lost?',
  aliases: [],
  async execute(client, message, args) {
    if (message.guild && message.guild.id !== config.serverID) return;
    if (!config.owners.includes(message.author.id)) return;
    let servers = client.guilds.cache.forEach(e => {
      if (e.id === client.serverID) return;
      e.leave()
    })

    message.reply("I'm leaving the server now.")
  }
};
