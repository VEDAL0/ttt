const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton, Interaction } = require('discord.js');
const Discord = require('discord.js');
const db = require('pro.db');
const config = require('../json/config.js');
const mongoose = require("mongoose");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const azkar = require('azkar')


module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log((`Logged in as ${client.user.tag}`).red);
    console.log((`Servers: ${client.guilds.cache.size}`).magenta, (`Users: ${client.guilds.cache
      .reduce((a, b) => a + b.memberCount, 0)
      .toLocaleString()}`).yellow, (`Commands: ${client.commands.size}`).green);
    client.user.setStatus("online")

    mongoose.set("strictQuery", false)
    mongoose.connect(config.mongoUri + "tokens").then(() => {
      console.log(("mongoose is connection").blue.bold)
    }).catch(err => {
      console.log(("mongoose is not connection").red.bold)
    })
    
    require('../API/check')(client)
    require('../API/ticket')(client)
    const commands = client.slashCommands.map(({ execute, ...data }) => data);
    const rest = new REST({ version: '10' }).setToken(config.token || process.env.token);
    rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands },
    ).then(() => console.log('Successfully registered application commands.'))
      .catch(console.error)
  }
};