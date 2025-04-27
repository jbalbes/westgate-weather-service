import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
  TextChannel,
} from 'discord.js';
import { translateWeather } from '../../generateWeather';
import { getWeather, updateWeather } from '../../weatherManager';
import { Channels } from '../../../common/utils';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('updateweather')
    .setDescription('Generates new weather based on the current weather'),
  async execute(interaction: ChatInputCommandInteraction) {
    if (interaction.channel.name === Channels.DMs) {
      updateWeather(getWeather());
      interaction.reply('Weather updated!');
      (
        interaction.guild.channels.cache.find(
          (channel) => channel.name === Channels.General,
        ) as TextChannel
      ).send('Weather update: ' + translateWeather(getWeather()));
    } else {
      interaction.followUp({
        content: 'This command must be used in the dms channel',
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
