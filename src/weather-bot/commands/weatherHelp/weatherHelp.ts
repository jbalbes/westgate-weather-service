import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { messages } from '../../messages';
import { Channels } from '../../../common/utils';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('weatherhelp')
    .setDescription('Replies with instructions on how to use this bot'),
  async execute(interaction: ChatInputCommandInteraction) {
    if (interaction.channel.name === Channels.DMs) {
      interaction.reply(messages.help + messages.dmHelp);
    } else {
      interaction.reply(messages.help);
    }
  },
};
