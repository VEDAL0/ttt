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
  aliases: [],
  async execute(client, message, args) {

    if (message.guild && message.guild.id !== config.serverID) return;
    if (!config.owners.includes(message.author.id)) return;
    const user = message.mentions.users.first() || message.guild.members.cache.get(args[0])
    if (!user) return message.reply({ content: "Please, Enter a user" })
    const data = await blacklist.findOne({ userId: user.id }).exec();
    if (!data) return message.reply({ content: "This person is not blacklisted !" })
    await blacklist.findOne({ userId: user.id }).deleteOne().exec();
    message.reply({ embeds: [MessageEmbed("BLUE", `**${user} has been removed from the blacklist !**`)] })
    user.send({ embeds: [MessageEmbed("BLUE", `You have been removed from the blacklist`)] })
  }
};
