import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
  TextChannel,
} from 'discord.js';
import { Channels } from '../../../common/utils';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('weathersay')
    .setDescription(
      'Causes weatherbot to say the provided text in general chat',
    )
    .addStringOption((option) =>
      option
        .setName('text')
        .setDescription('The text for weatherbot to say')
        .setRequired(true),
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    if (interaction.channel.name === Channels.DMs) {
      const text = interaction.options.getString('text');
      await (
        interaction.guild.channels.cache.find(
          (channel) => channel.name === Channels.General,
        ) as TextChannel
      ).send(text);
      interaction.followUp({
        content: 'Text posted',
      });
    } else {
      interaction.followUp({
        content: 'This command must be used in the dms channel',
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
