import { Client } from "discord.js";
import { config } from "./auth";
import { messages } from "./messages";
import {
  generateWeather,
  Weather,
  translateWeather,
  Temperature,
  Precipitation,
  Saturation,
} from "./generateWeather";
import { existsSync, writeFileSync, readFileSync } from "fs";
import { schedule } from "node-cron";
import { isTextChannel, Channels, messageChannel } from "../common/utils";

const client = new Client();

function getWeather(): Weather {
  if (!existsSync("./weather.json")) {
    writeFileSync("./weather.json", JSON.stringify(generateWeather()));
  }
  return JSON.parse(readFileSync("./weather.json", "utf8"));
}

function updateWeather(weather: Weather) {
  saveWeather(generateWeather(weather));
}

function saveWeather(weather: Weather) {
  writeFileSync("./weather.json", JSON.stringify(weather));
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", (msg) => {
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
      client,
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
  } else if (
    msg.content.startsWith("!weathersay ") &&
    isTextChannel(msg.channel) &&
    msg.channel.name === Channels.DMs
  ) {
    const message = msg.content.substr("!weathersay ".length);
    messageChannel(client, Channels.General, message);
  } else if (
    msg.content === "!weatherannounce" &&
    isTextChannel(msg.channel) &&
    msg.channel.name === Channels.DMs
  ) {
    messageChannel(
      client,
      Channels.General,
      `Weather update: ` + translateWeather(getWeather())
    );
  } else if (
    msg.content.startsWith("!weatherset ") &&
    isTextChannel(msg.channel) &&
    msg.channel.name === Channels.DMs
  ) {
    const newWeather = msg.content.substr("!weatherset ".length).split(" ");
    if (newWeather.length != 2) {
      msg.reply("Must supply weather condition and new value");
      return;
    }
    if (newWeather[0] === "precipitation") {
      const newPrecip = Precipitation[newWeather[1].toUpperCase()];
      if (newPrecip !== undefined) {
        saveWeather({
          ...getWeather(),
          precipitation: newPrecip,
        });
      } else {
        msg.reply(
          `Unknown option ${newWeather[1]}, options are ${Object.keys(
            Precipitation
          )
            .filter((v) => isNaN(parseInt(v, 10)))
            .map((v) => v.toLowerCase())}`
        );
        return;
      }
    } else if (newWeather[0] === "temperature") {
      const newTemp = Temperature[newWeather[1].toUpperCase()];
      if (newTemp !== undefined) {
        saveWeather({
          ...getWeather(),
          temperature: newTemp,
        });
      } else {
        msg.reply(
          `Unknown option ${newWeather[1]}, options are ${Object.keys(
            Temperature
          )
            .filter((v) => isNaN(parseInt(v, 10)))
            .map((v) => v.toLowerCase())}`
        );
        return;
      }
    } else if (newWeather[0] === "saturation") {
      const newSat = Saturation[newWeather[1].toUpperCase()];
      if (newSat !== undefined) {
        saveWeather({
          ...getWeather(),
          saturation: newSat,
        });
      } else {
        msg.reply(
          `Unknown option ${newWeather[1]}, options are ${Object.keys(
            Saturation
          )
            .filter((v) => isNaN(parseInt(v, 10)))
            .map((v) => v.toLowerCase())}`
        );
        return;
      }
    } else {
      msg.reply(
        `Unknown option '${newWeather[0]}', options are precipitation,temperature,saturation`
      );
      return;
    }
  }
});

client.on("reconnecting", () => {
  console.log("Attempting reconnect");
});

client.on("error", (e) => {
  console.log(e.message);
});

client.login(config.token);

schedule("0 2 * * 2", function () {
  updateWeather(getWeather());
  messageChannel(
    client,
    Channels.General,
    `Weather update: ` + translateWeather(getWeather())
  );
});
