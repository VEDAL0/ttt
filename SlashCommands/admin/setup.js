const { MessageButton, MessageActionRow, MessageEmbed, Client, MessageSelectMenu } = require("discord.js");
const config = require('../../json/config.js');

module.exports = {
  name: "setup",
  description: `Test the bots response time.`,
  aliases: [],
  async execute(client, interaction) {
    if (interaction.guild && interaction.guild.id !== config.serverID) return interaction.reply({ content: `**The Bot Privet To NightStar**`, ephemeral: true })

    if (!config.owners.includes(interaction.user.id)) return interaction.reply({ content: `**You Not Owner**`, ephemeral: true })

    let button = new MessageButton()
      .setCustomId(`ticket`)
      .setLabel(`Create Ticket`)
      .setStyle(`SECONDARY`)

    let row = new MessageActionRow()
      .addComponents(button)

    let embed = new MessageEmbed()
      .setTitle(`**Ticket Panel**`)
      .setDescription(`**Click the button to create ticket**`)
    interaction.reply({ content: `**Done**`, ephemeral: true })
    interaction.channel.send({ embeds: [embed], components: [row] })
  }
};
