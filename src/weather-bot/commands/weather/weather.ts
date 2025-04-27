import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { translateWeather } from '../../generateWeather';
import { getWeather } from '../../weatherManager';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('weather')
    .setDescription('Replies with the current weather'),
  async execute(interaction: ChatInputCommandInteraction) {
    interaction.reply(translateWeather(getWeather()));
  },
};
