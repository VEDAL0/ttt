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
  name: "unblacklist",
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
    const data = await blacklist.findOne({ userId: user.id }).exec();
    if (!data) return interaction.reply({ content: "This person is not blacklisted !" })
    await blacklist.findOne({ userId: user.id }).deleteOne().exec();
    interaction.reply({ embeds: [MessageEmbed("BLUE", `**${user} has been removed from the blacklist !**`)] })
    user.send({ embeds: [MessageEmbed("BLUE", `You have been removed from the blacklist`)] })
  }
};