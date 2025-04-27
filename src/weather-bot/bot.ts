import { Client, Events, GatewayIntentBits, MessageFlags } from 'discord.js';
import { config } from './auth';
import { translateWeather } from './generateWeather';
import { schedule } from 'node-cron';
import { Channels, messageChannel } from '../common/utils';
import { getWeather, updateWeather } from './weatherManager';
import { commands } from './commands';

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.on(Events.ClientReady, () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) {
    return;
  }
  const command = commands.get(interaction.commandName);
  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: 'There was an error while executing this command!',
        flags: MessageFlags.Ephemeral,
      });
    } else {
      await interaction.reply({
        content: 'There was an error while executing this command!',
        flags: MessageFlags.Ephemeral,
      });
    }
  }
});

client.on('reconnecting', () => {
  console.log('Attempting reconnect');
});

client.on('error', (e) => {
  console.log(e.message);
});

client.login(config.token);

schedule('0 2 * * 2', function () {
  updateWeather(getWeather());
  messageChannel(
    client,
    Channels.General,
    `Weather update: ` + translateWeather(getWeather()),
  );
});
