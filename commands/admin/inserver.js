const Discord = require("discord.js");
const DiscordOauth2 = require("discordouth3");
const Users = require("../../data/offline");
const Users1 = require("../../data/online");
const Users2 = require("../../data/auto");
const config = require('../../json/config.js');

const { Client, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, messageCreate, EmbedBuilder, WebhookClient, ButtonBuilder, ActionRowBuilder } = require("discord.js");


module.exports = {
  name: "inserver",
  description: `Test the bots response time.`,
  aliases: [],
  async execute(client, message, args) {

    if (message.guild && message.guild.id !== config.serverID) return;
    if (!config.owners.includes(message.author.id)) return;
    let guild = client.guilds.cache.get(args[0])
    if (!guild) return message.reply({ content: `I'm not in this guild .` })
    const users = await Users.find();
    const users1 = await Users1.find();
    const users2 = await Users2.find();
    const all = users.length + users1.length + users2.length

    let members = await guild.members.fetch()
    let xx = users.filter(e => members.find(ee => ee.user.id === e.userId));
    let xx1 = users1.filter(e => members.find(ee => ee.user.id === e.userId));
    let xx2 = users2.filter(e => members.find(ee => ee.user.id === e.userId));
    let not = users.length - xx.length
    let not1 = users1.length - xx1.length
    let not2 = users2.length - xx2.length
    let embed = new MessageEmbed()
      .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
      .setTitle(`${guild.name}`)
      .addFields(
        { name: "ّ", value: "**InServer**", inline: false },
        { name: 'Online', value: `**${xx1.length}**`, inline: true },
        { name: 'Offline', value: `**${xx.length}**`, inline: true },
        { name: 'Auto', value: `**${xx2.length}**`, inline: true },
        { name: "ّ", value: '**OutServer**', inline: false },
        { name: "Online", value: `**${not1}**`, inline: true },
        { name: "Offline", value: `**${not}**`, inline: true },
        { name: "Auto", value: `**${not2}**`, inline: true },
      )
    message.reply({ embeds: [embed] })
  }
};