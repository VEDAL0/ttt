const express = require('express');
const app = express();

app.listen(3000, () => {
  console.log(('Express is ready.').blue.bold)
});

const { Client, Intents, Collection, MessageActionRow, MessageEmbed, MessageButton } = require('discord.js');

const config = require("./json/config.js");
const { glob } = require("glob");
const { promisify } = require("util");
const { joinVoiceChannel } = require('@discordjs/voice');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');
const db = require('pro.db');
const colors = require("colors");
const ms = require('ms');
const azkar = require('azkar')

const client = new Client({
  intents: 32767,
  allowedMentions: { repliedUser: false },
});

process.on("unhandledRejection", (reason, promise) => {
  return console.log(reason)
})
process.on("uncaughtException", (err, origin) => {
  return console.log(err)
})
process.on('uncaughtExceptionMonitor', (err, origin) => {
  return console.log(err)
});
process.on('multipleResolves', (type, promise, reason) => {
  return console.log(reason)
});

module.exports = client;
client.commands = new Collection();
client.events = new Collection();
client.slashCommands = new Collection();
['commands', 'events', 'slash'].forEach(handler => {
  require(`./handlers/${handler}`)(client);
})



client.login(config.token || process.env.token).catch((err) => {
  console.log(err.message)
})