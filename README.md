# Gawds Battle Discord Bot

Gawds Battle is a simple turn-based battle game played from within a Discord server. To win, the player must use a combination of luck and skill to defeat their computer-controlled opponent. Survive the longest to win your battle!

**Table of Contents**

- [Gawds Battle Discord Bot](#gawds-battle-discord-bot)
  - [How to Play](#how-to-play)
    - [Start A New Battle](#start-a-new-battle)
    - [The Coin Flip](#the-coin-flip)
    - [Attacking](#attacking)
    - [Defending](#defending)
  - [Game Mechanics](#game-mechanics)
    - [Cult Vulnerabilities](#cult-vulnerabilities)
    - [Powers](#powers)
    - [Dominant Power](#dominant-power)
    - [Damage Calculations](#damage-calculations)
  - [Set up the Bot](#set-up-the-bot)
    - [Create a Discord Bot Application](#create-a-discord-bot-application)
    - [Inviting Your Bot to a Server](#inviting-your-bot-to-a-server)
    - [Set up your .env file](#set-up-your-env-file)
    - [Launching the Bot](#launching-the-bot)

## How to Play

### Start A New Battle

To start a new Gawds Battle, type `/battle` in a Discord server that has integrated the Gawds Battle Bot. After typing `/battle` you will be prompted to input a valid Gawd `ID`, which is an integer between 1 and 5882. You can browse all playable Gawds in the [Gawds Gallery](https://www.gawds.xyz/gallery/).

After starting a new Battle, the bot will create a new Discord Thread and add you to it.

### The Coin Flip

Each Battle starts with a coin flip to determine who will attack first. The losing Gawd is granted 10 additional health to offset the winner's advantage.

### Attacking

When it is your turn to attack, the bot will display an embed with relevant information about your opponent's Gawd. You will also see additional information about which powers are available for you to attack with, including the Augment associated with each attack.

To attack, click on the button beneath the embed that corresponds with the Power you wish to choose.

After attacking, the bot will display a combat log detailing the results of attacking with the selected power.

### Defending

When it is your turn to defend, you will the option to either **Block** or **Pass**. Blocking prevents 100% of the damage inflicted by your opponents attack.

A block can be negated if the attacker uses their **Dominant Power**.

You and your opponent only get 2 blocks per battle. Choose when you block carefully!

## Game Mechanics

### Cult Vulnerabilities

The Gawds universe is divided up amongst three different cults: 🩸 Arcane, 🌙 Terrene, and ✨ Astral. **Gawds Battles features a rock-paper-scissors vulnerability mechanic where each cult is strong against one cult but weak against the other.**

| Cult       | Strong Against | Weak Against |
| ---------- | -------------- | ------------ |
| 🩸 Arcane  | ✨ Astral      | 🌙 Terrene   |
| 🌙 Terrene | 🩸 Arcane      | ✨ Astral    |
| ✨ Astral  | 🌙 Terrene     | 🩸 Arcane    |

If you attack with a Power that is strong against your opponent's cult, it will boost your damage. Conversely, if you attack with a Power that is weak against your opponent your damage will be reduced.

Each Power (attack) and every Gawd is associated with a cult. It's important to consider the cult of your opponent when selecting which Power to use. For example:

> Your opponent's Gawd is ✨ Astral. If you attack using a Power that is 🌙 Terrene, you get a boost to your damage. If you attack using a Power that is 🩸 Arcane, your damage will be reduced.

### Powers

Each Gawd comes equipped with 4-6 powers. **Powers function as attacks in the Gawds Battle game.** The powers of each Gawd are determined by their randomly generated traits, so some Gawds may have several duplicates of the same power.

Every Power has an associated **Augment**. A Augment is a boost to your combat that is immediately applied to the damage calculations when you attack with a given Power. There are six different Augments, and all three cults have access to the same six Augments.

| Icon | Power      | Cult       | Augment             |
| ---- | ---------- | ---------- | ------------------- |
| ✧    | Divine     | 🩸 Arcane  | +5 Health           |
| ⦲    | Chaos      | 🩸 Arcane  | +10% Hit Chance     |
| ☾    | Mystic     | 🩸 Arcane  | +5% Crit Chance     |
| ❍    | Dark       | 🩸 Arcane  | -10% Opponent Dodge |
| ⧂    | Spirit     | 🩸 Arcane  | +2.5 Damage         |
| ⨙    | Oblivion   | 🩸 Arcane  | Random Augment      |
| ⩀    | Corporeal  | 🌙 Terrene | +5 Health           |
| ⧰    | Creature   | 🌙 Terrene | +10% Hit Chance     |
| ❖    | Verdure    | 🌙 Terrene | +5% Crit Chance     |
| ⦵    | Toxic      | 🌙 Terrene | -10% Opponent Dodge |
| ⬙    | Mundane    | 🌙 Terrene | +2.5 Damage         |
| ⏆    | Aqueous    | 🌙 Terrene | Random Augment      |
| ✶    | Cosmos     | ✨ Astral  | +5 Health           |
| ◊    | Inferno    | ✨ Astral  | +10% Hit Chance     |
| ◍    | Geological | ✨ Astral  | +5% Crit Chance     |
| ⬡    | Automoton  | ✨ Astral  | -10% Opponent Dodge |
| ☉    | Numerary   | ✨ Astral  | +2.5 Damage         |
| ⦓    | Alchemy    | ✨ Astral  | Random Augment      |

### Dominant Power

Each Gawd is assigned a **Dominant Power**. The cult of your Dominant Power determines the cult leanings of your Gawd.

**Attacks with a Dominant Power can not be blocked by the opposing Gawd.** Use strategy to determine the best times to use your block and plan your attacks around your opponent's available blocks.

### Damage Calculations

Every attack goes through the following steps to calculate the final damage to apply to the opposing Gawd each turn.

| Step | Type               | Base Value      | Result                             |
| ---- | ------------------ | --------------- | ---------------------------------- |
| 1    | Block              | Yes or No       | If blocked, no damage applied      |
| 2    | Hit                | 90% Chance      | If missed, no damage applied       |
| 3    | Dodge              | 10% Chance      | If dodged, no damage applied       |
| 4    | Damage             | 10 Min - 15 Max | Base Damage used for next steps    |
| 5    | Critical Hit       | 20% Chance      | 100% bonus damage                  |
| 6    | Cult Vulnerability | +/- 20% Damage  | Damage increased or reduced by 20% |

## Set up the Bot

Want to set up your own instance of the Gawds Battle Discord bot? Terrific! Start by cloning this repo and run `npm install` to download the necessary dependencies. The setup process is relatively simple and should only take a few minutes of your time.

### Create a Discord Bot Application

The first step to launching the bot on your own is to create a Discord bot application via the official Discord developer portal.

The discord.js guide has a [terrific walkthrough](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot) on how to create a Discord bot application.

After creating your application, double check that you also added a new bot under the "Bot" section of the Discord developer portal.

### Inviting Your Bot to a Server

Now that you set up the bot application in the step above, next you will need to generate an OAuth2 URL to prompt yourself to invite the bot to a server.

1. Navigate to your [Discord Developer Portal](https://discord.com/developers/applications) and click on your Gawds Battle application
2. Click on the "OAuth2" section on the left-hand navigation panel, then select the "URL Generator" underneath where you just clicked. Generate a new URL with `bot` and `application.commands` scopes and the `Create Public Threads` and `Send Messages in Threads` bot permissions.
3. Copy the generated URL, paste it in your browser, then follow the prompts to invite your the bot to a server where you have administrator privileges.

### Set up your .env file

The application uses the [dotenv](https://www.npmjs.com/package/dotenv) NPM package to load environment variables from a `.env` file. This file will store sensitive information, like your bot's token, so keep it safe.

Open the `.env.sample` file in the root directory. There are three environment variables that you need to populate before the bot will configure properly. Follow the instructions below to find the proper values for the necessary variables, and be sure to paste them between the `""`.

- `DISCORD_TOKEN` - Go to your Discord Developer Portal, select "Bot" on the left-hand nav bar, press the "Reset Token" button.
- `CLIENT_ID` - Go to your Discord Developer Portal, select "General Information" on the left-hand nav bar, press the "Copy" button under `Application ID`
- `GUILD_ID` - Go the Discord server you will run the bot in, right click on the server name in the top-left corner and select "Copy ID"

To find `GUILD_ID` You may need to enable "Developer Mode" in the Advanced settings section of your Discord client.

Once all three environment variables have been input, rename the `.env.sample` file to `.env`.

### Launching the Bot

Before running your bot for the first time in a Discord server, you need to register the `/battle` slash command before it will be available for use.

To register slash commands, run `npm run config` in the root directory.

Now you should be ready to take your bot online!

To run a local development environment, you can run the bot with [nodemon](https://www.npmjs.com/package/nodemon) by using the `npm run dev` script on your local machine.

To manage the bot in a production environment, I use the process manager [pm2](https://www.npmjs.com/package/pm2), which you can run with `npm run start`.
