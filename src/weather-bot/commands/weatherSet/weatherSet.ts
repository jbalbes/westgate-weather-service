import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
} from 'discord.js';
import {
  Precipitation,
  precipitationMap,
  Saturation,
  saturationMap,
  Temperature,
  temperatureMap,
} from '../../generateWeather';
import {
  updatePrecipitation,
  updateSaturation,
  updateTemperature,
} from '../../weatherManager';
import { Channels } from '../../../common/utils';

enum Subcommands {
  precipitation = 'precipitation',
  temperature = 'temperature',
  saturation = 'saturation',
}

const setPrecipitation = new SlashCommandSubcommandGroupBuilder()
  .setName(Subcommands.precipitation)
  .setDescription('Sets the precipitation');
Object.keys(precipitationMap)
  .map((key) => precipitationMap[key])
  .forEach((precipitationLevel) =>
    setPrecipitation.addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName(precipitationLevel)
        .setDescription(precipitationLevel),
    ),
  );

const convertPrecipitationCommand = (
  precipitationCommand: string,
): Precipitation => {
  return parseInt(
    Object.keys(precipitationMap).find(
      (k) => precipitationMap[k] === precipitationCommand,
    ),
    10,
  );
};

const setTemperature = new SlashCommandSubcommandGroupBuilder()
  .setName(Subcommands.temperature)
  .setDescription('Sets the temperature');
Object.keys(temperatureMap)
  // Leave of the specific degrees for command
  .map((key) => temperatureMap[key].split(' ')[0])
  .forEach((temperatureLevel) =>
    setTemperature.addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName(temperatureLevel)
        .setDescription(temperatureLevel),
    ),
  );

const convertTemperatureCommand = (temperatureCommand: string): Temperature => {
  return parseInt(
    Object.keys(temperatureMap).find((k) =>
      temperatureMap[k].includes(temperatureCommand),
    ),
    10,
  );
};

const setSaturation = new SlashCommandSubcommandGroupBuilder()
  .setName(Subcommands.saturation)
  .setDescription('Sets the saturation');
Object.keys(saturationMap)
  .map((key) => saturationMap[key].split(' ').join('-'))
  .forEach((saturationLevel) =>
    setSaturation.addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName(saturationLevel)
        .setDescription(saturationLevel),
    ),
  );

const convertSaturationCommand = (saturationCommand: string): Saturation => {
  return parseInt(
    Object.keys(saturationMap).find(
      (k) => saturationMap[k] === saturationCommand.split('-').join(' '),
    ),
    10,
  );
};

const commandBuilder = new SlashCommandBuilder()
  .setName('weatherset')
  .setDescription('Sets the weather to a specific value');
commandBuilder.addSubcommandGroup(setPrecipitation);
commandBuilder.addSubcommandGroup(setTemperature);
commandBuilder.addSubcommandGroup(setSaturation);

module.exports = {
  data: commandBuilder,
  async execute(interaction: ChatInputCommandInteraction) {
    if (interaction.channel.name === Channels.DMs) {
      const updateTarget = interaction.options.getSubcommandGroup();
      const updateValue = interaction.options.getSubcommand();
      switch (updateTarget) {
        case Subcommands.precipitation:
          updatePrecipitation(convertPrecipitationCommand(updateValue));
          break;
        case Subcommands.temperature:
          updateTemperature(convertTemperatureCommand(updateValue));
          break;
        case Subcommands.saturation:
          updateSaturation(convertSaturationCommand(updateValue));
          break;
      }
      interaction.reply({
        content: 'Weather updated',
        flags: MessageFlags.Ephemeral,
      });
    } else {
      interaction.reply({
        content: 'This command must be used in the dms channel',
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
