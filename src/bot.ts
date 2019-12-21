import { Client, Channel, TextChannel } from "discord.js";
import { config } from "./auth";
import { messages } from "./messages";
import { generateWeather, Weather, translateWeather } from "./generateWeather";
import { existsSync, writeFileSync, readFileSync } from "fs";

const client = new Client();

enum Channels {
  General = "general-chat",
  DMs = "dms"
}

const isTextChannel = (c: Channel): c is TextChannel => c.type === "text";

function getWeather(): Weather {
  if (!existsSync("./weather.json")) {
    writeFileSync("./weather.json", JSON.stringify(generateWeather()));
  }
  return JSON.parse(readFileSync("./weather.json", "utf8"));
}

function updateWeather(weather: Weather) {
  writeFileSync("./weather.json", JSON.stringify(generateWeather(weather)));
}

function messageChannel(channel: string, msg: string) {
  client.channels
    .filter(c => isTextChannel(c) && c.name === channel)
    .forEach((c: TextChannel) => {
      c.send(msg);
    });
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  messageChannel(Channels.General, messages.thanks);
  messageChannel(Channels.General, messages.help);
  messageChannel(Channels.General, translateWeather(getWeather()));
  messageChannel(Channels.DMs, messages.dmHelp);
});

client.on("message", msg => {
  if (msg.content === "!weather") {
    msg.reply(translateWeather(getWeather()));
  } else if (
    msg.content === "!updateweather" &&
    isTextChannel(msg.channel) &&
    msg.channel.name === Channels.DMs
  ) {
    updateWeather(getWeather());
    msg.reply("Weather updated!");
    messageChannel(
      Channels.General,
      `Weather update: ` + translateWeather(getWeather())
    );
  } else if (msg.content === "!help") {
    const reply =
      messages.help +
      (isTextChannel(msg.channel) && msg.channel.name === Channels.DMs
        ? " " + messages.dmHelp
        : "");
    msg.reply(reply);
  }
});

client.login(config.token);
