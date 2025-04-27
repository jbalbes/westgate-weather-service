import { Collection, SlashCommandBuilder } from 'discord.js';
const weather = require('./commands/weather/weather');
const updateWeather = require('./commands/updateWeather/updateWeather');
const weatherHelp = require('./commands/weatherHelp/weatherHelp');
const weatherSay = require('./commands/weatherSay/weatherSay');
const weatherAnnounce = require('./commands/weatherAnnounce/weatherAnnounce');
const weatherSet = require('./commands/weatherSet/weatherSet');

export interface Command {
  data: SlashCommandBuilder;
  execute: (ChatInputCommandInteraction) => Promise<void>;
}

export const commands = new Collection<string, Command>();

const commandArray = [
  weather,
  updateWeather,
  weatherHelp,
  weatherSay,
  weatherAnnounce,
  weatherSet,
];

commandArray.forEach((command) => commands.set(command.data.name, command));
