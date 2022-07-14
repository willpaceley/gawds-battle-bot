# Gawds Battle Discord Bot

Gawds Battle is a simple turn-based battle game played from within a Discord server. To win, the player must use a combination of luck and skill to defeat their computer-controlled opponent. Survive the longest to win your battle!

## How to Play

### Start A New Battle

To start a new Gawds Battle, type `/battle` in a Discord server that has integrated the Gawds Battle Bot. After typing `/battle` you will be prompted to input a valid Gawd `ID`, which is an integer between 1 and 5882. You can browse all playable Gawds in the [Gawds Gallery](https://www.gawds.xyz/gallery/).

After starting a new Battle, the bot will create a new Discord Thread and add you to it.

### The Coin Flip

Each Battle starts with a coin flip to determine who will attack first.

## Game Mechanics

### Powers

Each Gawd comes equipped with 4-6 powers. **Powers function as attacks in the Gawds Battle game.** The powers of each Gawd are determined by their randomly generated traits, so some Gawds may have several duplicates of the same power.

Every Power has an associated **Passive**. A Passive is a boost to your combat that is immediately applied to the damage calculations when you attack with a given Power. There are six different Passives, and all three cults have access to the same six Passives. See table below for reference.

| Icon | Power      | Cult       | Passive              |
| ---- | ---------- | ---------- | -------------------- |
| ✧    | Divine     | 🩸 Arcane  | Heal +5 HP           |
| ⦲    | Chaos      | 🩸 Arcane  | +2.5% Hit Chance     |
| ☾    | Mystic     | 🩸 Arcane  | +2.5% Crit Chance    |
| ❍    | Dark       | 🩸 Arcane  | -2.5% Opponent Dodge |
| ⧂    | Spirit     | 🩸 Arcane  | +2.5 Damage          |
| ⨙    | Oblivion   | 🩸 Arcane  | Random Passive       |
| ⩀    | Corporeal  | 🌙 Terrene | Heal +5 HP           |
| ⧰    | Creature   | 🌙 Terrene | +2.5% Hit Chance     |
| ❖    | Verdure    | 🌙 Terrene | +2.5% Crit Chance    |
| ⦵    | Toxic      | 🌙 Terrene | -2.5% Opponent Dodge |
| ⬙    | Mundane    | 🌙 Terrene | +2.5 Damage          |
| ⏆    | Aqueous    | 🌙 Terrene | Random Passive       |
| ✶    | Cosmos     | ✨ Astral  | Heal +5 HP           |
| ◊    | Inferno    | ✨ Astral  | +2.5% Hit Chance     |
| ◍    | Geological | ✨ Astral  | +2.5% Crit Chance    |
| ⬡    | Automoton  | ✨ Astral  | -2.5% Opponent Dodge |
| ☉    | Numerary   | ✨ Astral  | +2.5 Damage          |
| ⦓    | Alchemy    | ✨ Astral  | Random Passive       |
