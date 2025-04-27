# Westgate Weather Service

This project contains the source code for two discord bots. These bots were used to support a ['West Marches'](https://arsludi.lamemage.com/index.php/78/grand-experiments-west-marches/) style Dungeons and Dragons game with multiple dungeon masters ([DMs](https://en.wikipedia.org/wiki/Dungeon_Master)), named 'Westgate'. This style of game requires close coordination between all players to share information in order to maintain a consistent world, alert each other of newly discovered adventuring opportunities and locations and boast about overcoming previously deadly roadblocks.

## Weather Bot

Although each adventuring session is intended to be completely self contained, consistent weather conditions help maintain verisimilitude. After all, it would not make sense for one adventuring party to be dealing with a blizzard while another is dealing with a scorching drought. To help coordinate this, this bot randomly generated weather each week, based on the previous week's weather. DMs can manual adjust weather if needed, or use the weatherbot to announce unusual meteorlogical phenomena. The weatherbot grew in to a small side character in the narrative, and even aided the player characters in a quest to make the weather warmer overall.

## Report Bot

Because not every player is present during an adventuring session (by design) in a West Marches style game, an important action item after every play session was writting an after action report. This was especially critical for Westgate because of the multiple dungeon master system. Without timely reporting, DMs might accidently create geographic or narrative conflicts without realizing it.

In lieu of manually tabulating all missing session reports, this bot parsed [the sign up sheet](https://docs.google.com/spreadsheets/d/181biXBsTnyfzUyLGvt3C0_kUlF67H_qtRVOvD0nMFPI/edit?gid=423424098#gid=423424098), determined which sessions have an overdue report, which players participated in those session, and then posted the results to the shared discord server.

## Running the Bots

Both bots run in Node, though only weatherbot has been updated to work with the modern discord API. After running `npm install`, the following scripts are included to help run and test the bots

`start`: Builds both bots, deploys slash commands to discord, then runs both bots connected to discord

`build`: Compiles the source code from typescript to javascript

`start-weather`: Runs just the weatherbot, connecting to discord

`test-weather`: Does a simulated run of many weeks of generated weather. Useful for testing without setting up discord integration

`test-report`: Runs the sign up sheet parsing and displays the results locally. Useful for testing without discord

`start-report`: Runs just the report bot, connecting to discord

`deploy-weather`: Deploys updated slash commands for the weatherbot to discord

### Testing with Discord

To connect to discord, you will need to make two config files, both based on `config.example.json`. See [this documentation](https://discordjs.guide/creating-your-bot/command-deployment.html#guild-commands) for more details.

### Testing with Google

Updating this is TBD, but you can see [these](https://developers.google.com/identity/protocols/oauth2) [documents](https://github.com/googleapis/google-api-nodejs-client) for reference. Previously, there was a `credentials.json` that was used to retrieve a token stored in `token.json`. See `report-bot/auth.ts` for more details.
