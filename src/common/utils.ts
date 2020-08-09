import { Channel, TextChannel, Client } from "discord.js";

export interface Config {
  token: string;
}

export enum Channels {
  General = "general-chat",
  DMs = "dms",
}

export const isTextChannel = (c: Channel): c is TextChannel =>
  c.type === "text";

export function messageChannel(client: Client, channel: string, msg: string) {
  client.channels
    .filter((c) => isTextChannel(c) && c.name === channel)
    .forEach((c: TextChannel) => {
      c.send(msg);
    });
}
