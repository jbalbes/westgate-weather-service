import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
  TextChannel,
} from 'discord.js';
import { translateWeather } from '../../generateWeather';
import { getWeather } from '../../weatherManager';
import { Channels } from '../../../common/utils';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('weatherannounce')
    .setDescription('Announces the current weather in general chat'),
  async execute(interaction: ChatInputCommandInteraction) {
    if (interaction.channel.name === Channels.DMs) {
      await (
        interaction.guild.channels.cache.find(
          (channel) => channel.name === Channels.General,
        ) as TextChannel
      ).send('Weather update: ' + translateWeather(getWeather()));
      interaction.followUp({
        content: 'Weather announced',
        flags: MessageFlags.Ephemeral,
      });
    } else {
      interaction.followUp({
        content: 'This command must be used in the dms channel',
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
