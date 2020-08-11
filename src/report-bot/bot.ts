import { Client } from "discord.js";
import { schedule } from "node-cron";
import { isTextChannel, Channels, messageChannel } from "../common/utils";
import { config } from "./auth";
import { getSessions, getOverdueSessions, getPlayers } from "./sheets";

const client = new Client();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

const messages = {
  help: "For information about overdue reports, type !report",
  dmHelp: `
  Commands specific to this channel:
  !reportsay <text>: Reportbot says <text> in general chat
  `,
};

client.on("message", (msg) => {
  if (msg.content === "!help") {
    const reply =
      messages.help +
      (isTextChannel(msg.channel) && msg.channel.name === Channels.DMs
        ? " " + messages.dmHelp
        : "");
    msg.reply(reply);
  } else if (
    msg.content.startsWith("!reportsay ") &&
    isTextChannel(msg.channel) &&
    msg.channel.name === Channels.DMs
  ) {
    const message = msg.content.substr("!reportsay ".length);
    messageChannel(client, Channels.General, message);
  } else if (
    msg.content === "!report" &&
    isTextChannel(msg.channel) &&
    msg.channel.name === Channels.General
  ) {
    shamePlayers();
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
  shamePlayers();
});

async function shamePlayers() {
  const sessions = await getSessions();
  const overdueSessions = getOverdueSessions(sessions);
  const overduePlayers = getPlayers(overdueSessions).sort().join(", ");
  messageChannel(
    client,
    Channels.General,
    `Anansi whispers to me that the following players participated in a session that has an overdue report:
${overduePlayers}
The overdue sessions are:
${overdueSessions
  .map((session) => `${session.date}: ${session.objective}`)
  .join("\n")}
    `
  );
}
