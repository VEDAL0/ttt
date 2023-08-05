const { Client, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, messageCreate, EmbedBuilder, WebhookClient, ButtonBuilder, ActionRowBuilder, Util } = require("discord.js");
const config = require('../../json/config.js');
const { connect } = require("net");
module.exports = {
  name: "servers",
  description: 'Feeling lost?',
  aliases: [],
  async execute(client, message, args) {
    if (message.guild && message.guild.id !== config.serverID) return;
    if (!config.owners.includes(message.author.id)) return;
    let servers = client.guilds.cache.map(e => `**${e.name}** - \`${e.id}\``).join('\n')
    Util.splitMessage(servers).forEach(m => {
      message.reply({ content: m })
    })
  }
};