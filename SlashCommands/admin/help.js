const { MessageButton, MessageActionRow, MessageEmbed, Client, CommandInteraction } = require("discord.js");
const { glob } = require("glob");
const { promisify } = require("util");
const prefix = `/`

module.exports = {
    name: "help",
    description: 'Feeling lost?',
  async execute(client, interaction) {
        const globPromise = promisify(glob);
        const commandFiles = await globPromise(`${process.cwd()}/commands/admin/**/*.js`);
    
        let embed = new MessageEmbed()
          
      .setColor('2f3136')

    .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
    commandFiles.map((value) => {
        const file = require(value);
        const splitted = value.split("/");
        const directory = splitted[splitted.length - 2];

        if (file.name) {
            const properties = { directory, ...file };
 embed.addField(`${prefix}${properties.name}`, `${properties.description}`, false)
        }
    });
    
 interaction.reply({embeds: [embed], content: `⚔ **Commands: [ ${client.commands.size} ]**`})
    },
};