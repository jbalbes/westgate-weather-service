import { Client, Channel, TextChannel } from "discord.js";
import { config } from "./auth";
import { messages } from "./messages";
import { generateWeather, Weather, translateWeather } from "./generateWeather";
import { existsSync, writeFileSync, readFileSync } from "fs";

const client = new Client();

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

function messageGeneral(msg: string) {
  client.channels
    .filter(c => isTextChannel(c) && c.name === "general-chat")
    .forEach((c: TextChannel) => {
      c.send(msg);
    });
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  messageGeneral(messages.greeting);
  messageGeneral(messages.help);
  messageGeneral(translateWeather(getWeather()));
});

client.on("message", msg => {
  if (msg.content === "!weather") {
    msg.reply(translateWeather(getWeather()));
  } else if (
    msg.content === "!updateweather" &&
    isTextChannel(msg.channel) &&
    msg.channel.name === "dms"
  ) {
    updateWeather(getWeather());
    messageGeneral(`Weather update: ` + translateWeather(getWeather()));
  }
});

client.login(config.token);
