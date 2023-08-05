const { MessageButton, MessageActionRow, MessageEmbed, Client, MessageSelectMenu } = require("discord.js");
const config = require('../../json/config.js');
const emoji = require('../../json/emoji.js');

module.exports = {
  name: "setup",
  description: `Test the bots response time.`,
  aliases: [],
  async execute(client, message, args) {
    if (message.guild && message.guild.id !== config.serverID) return;
    if (!config.owners.includes(message.author.id)) return;
    let button = new MessageButton()
      .setCustomId(`ticket`)
      .setEmoji(`${emoji.ticket}`)
      .setLabel(`Create Ticket`)
      .setStyle(`SECONDARY`)

    let row = new MessageActionRow()
      .addComponents(button)

    let embed = new MessageEmbed()
      .setTitle(`**Ticket Panel**`)
      .setDescription(`
**\_\_Online = 350 ${emoji.probot}\_\_** 

**\_\_Offline = 250 ${emoji.probot}\_\_**

**\_\_Auto = 1500 ${emoji.probot}\_\_** 

  **Click the button ${emoji.ticket} to create ticket**`)

    message.delete()
    message.channel.send({ embeds: [embed], components: [row] })
  }
};
