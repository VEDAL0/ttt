const { Client, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, messageCreate, EmbedBuilder, WebhookClient, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const config = require('../../json/config.js');
const { connect } = require("net");
module.exports = {
    name: "invite",
    description: 'Feeling lost?',
    aliases: [],
      async execute(client, message, args) {
    if (message.guild && message.guild.id !== config.serverID) return;
    if (!config.owners.includes(message.author.id)) return;
    let btn = new MessageButton()
      .setStyle("LINK")
      .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8193&scope=bot`)
      .setLabel("Invite");

    let row = new MessageActionRow()
      .addComponents(btn);
    let embed = new MessageEmbed()
      .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
      .setTimestamp()
      .setDescription(`
    **يــجــب عــلــيــك ادخــل الــبــوت ســرفــرك اولا لــيــنــك الــبــوت**`)
    message.reply({ embeds: [embed], components: [row] })
  }
};