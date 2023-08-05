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
  options: [{
    name: "serverid",
    description: "serverID",
    type: 3,
    required: true,
  }],
  async execute(client, interaction) {
    interaction.reply(`Please Wait...`).then(async () => {
      setTimeout(async () => {
        if (interaction.guild && interaction.guild.id !== config.serverID) return interaction.reply({ content: `**The Bot Privet To NightStar**`, ephemeral: true })

        if (!config.owners.includes(interaction.user.id)) return interaction.reply({ content: `**You Not Owner**`, ephemeral: true })

        let guildId = interaction.options.getString('serverid')
        let guild = client.guilds.cache.get(guildId)
        if (!guild) return await interaction.editReply({ content: `I'm not in this guild .` })
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
        await interaction.editReply({ content: `${guild.name}`, embeds: [embed] })
      }, 1000)
    })
  }
};