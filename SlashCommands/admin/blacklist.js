const Discord = require("discord.js")
const config = require('../../json/config.js');


function MessageEmbed(color, description) {
  const embed = new Discord.MessageEmbed()
    .setColor(color)
    .setDescription(description)
  return embed
}

const blacklist = require("../../data/blacklist")

module.exports = {
  name: "blacklist",
  description: `Test the bots response time.`,
  options: [{
    name: "user",
    description: "user",
    type: 6,
    required: true,
  }],
  async execute(client, interaction) {
    if (interaction.guild && interaction.guild.id !== config.serverID) return interaction.reply({ content: `**The Bot Privet To NightStar**`, ephemeral: true })

    if (!config.owners.includes(interaction.user.id)) return interaction.reply({ content: `**You Not Owner**`, ephemeral: true })

    const user = interaction.options.getUser('user');
    if (!user) return interaction.reply({ content: "Please, Enter a user" })
    blacklist.findOne({ userId: user.id }, async (err, data) => {
      if (!data) {
        new blacklist({
          userId: user.id
        }).save()
        interaction.reply({ embeds: [MessageEmbed("BLUE", `**${user} has been added to the blacklist**`)] })
        user.send({ embeds: [MessageEmbed("BLUE", `You have been added to the blacklist`)] })
      } else {
        interaction.reply({ content: `**${user} is already blacklisted !**` })
      }
    })
  }
};