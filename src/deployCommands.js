// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

// Configure environment variables
require('dotenv').config();
const { DISCORD_TOKEN, CLIENT_ID, GUILD_ID } = process.env;

// Create an array with names of each file in commands directory
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith('.js'));

const commands = [];

// Add JSON data for each file to commands array
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(DISCORD_TOKEN);

rest
  .put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);
