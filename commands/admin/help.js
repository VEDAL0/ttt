const { MessageButton, MessageActionRow, MessageEmbed, Client } = require("discord.js");
const { glob } = require("glob");
const { promisify } = require("util");
const { prefix } = require('../../json/config.js');

module.exports = {
    name: "help",
    description: 'Feeling lost?',
    aliases: [],
      async execute(client, message, args) {
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
        
message.reply({embeds: [embed], content: `⚔ **Commands: [ ${client.slashCommands.size} ] **` }).catch((err) => {
      console.log(`i couldn't reply to the message: ` + err.message)})
    },
};