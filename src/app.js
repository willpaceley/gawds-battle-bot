const fs = require('node:fs');
const path = require('node:path');
const { Client, Intents, Collection } = require('discord.js');
// Configure environment variables
require('dotenv').config();
const { DISCORD_TOKEN } = process.env;

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// Add commands Collection as client instance property
client.commands = new Collection();
// Create an array with names of each file in ./commands directory
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith('.js'));
// Create an array with names of each file in ./events directory
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith('.js'));

// Add each file to client commands property
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  // Set a new item in the Collection
  // With the key as the command name and the value as the exported module
  client.commands.set(command.data.name, command);
}

// Listen on the client for every event from ./events
for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

// // When the client is ready, run this code (only once)
// client.once('ready', () => {
//   console.log('Discord bot ready!');
// });

// Respond to slash command interactions
// client.on('interactionCreate', async (interaction) => {
//   // Exit function if interaction is not a command
//   if (!interaction.isCommand()) return;

//   // Search commands Collection for the interaction's command name
//   const command = client.commands.get(interaction.commandName);

//   // Exit function if there was no data for the command in the collection
//   if (!command) return;

//   try {
//     await command.execute(interaction);
//   } catch (error) {
//     console.error(error);
//     await interaction.reply({
//       content: 'There was an error while executing this command!',
//       ephemeral: true,
//     });
//   }
// });

// Login to Discord with your client's token
client.login(DISCORD_TOKEN);
