import { Client, Channel, TextChannel } from "discord.js";
import { config } from "./auth";
import { messages } from "./messages";
import { generateWeather, Weather, translateWeather } from "./generateWeather";
import { existsSync, writeFileSync, readFileSync } from "fs";
import { schedule } from "node-cron";

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

client.on("reconnecting", () => {
  console.log("Attempting reconnect");
});

client.on("error", e => {
  console.log(e.message);
});

client.login(config.token);

schedule("0 2 * * 2", function() {
  updateWeather(getWeather());
  messageChannel(
    Channels.General,
    `Weather update: ` + translateWeather(getWeather())
  );
});
