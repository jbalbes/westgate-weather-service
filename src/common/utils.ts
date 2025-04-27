import { Channel, TextChannel, Client, ChannelType } from 'discord.js';

export interface Config {
  token: string;
}

export enum Channels {
  General = 'general-chat',
  DMs = 'dms',
}

export const isTextChannel = (c: Channel): c is TextChannel =>
  c.type === ChannelType.GuildText;

export function messageChannel(client: Client, channelId: string, msg: string) {
  const channel = client.channels.cache.get(channelId);
  if (isTextChannel(channel)) {
    channel.send(msg);
  }
}
