# Gawds Battle Discord Bot

Gawds Battle is a simple turn-based battle game played from within a Discord server. To win, the player must use a combination of luck and skill to defeat their computer-controlled opponent. Survive the longest to win your battle!

## How to Play

### Start A New Battle

To start a new Gawds Battle, type `/battle` in a Discord server that has integrated the Gawds Battle Bot. After typing `/battle` you will be prompted to input a valid Gawd `ID`, which is an integer between 1 and 5882. You can browse all playable Gawds in the [Gawds Gallery](https://www.gawds.xyz/gallery/).

After starting a new Battle, the bot will create a new Discord Thread and add you to it.

### The Coin Flip

Each Battle starts with a coin flip to determine who will attack first.

### Attacking

When it is your turn to attack, the bot will display an embed with relevant information about your opponent's Gawd. You will also see additional information about which powers are available for you to attack with, including the passive boosts associated with each attack.

To attack, click on the button beneath the embed that corresponds with the Power you wish to choose. For your convenience and reference, each button also displays the icon of the cult associated with each Power.

After attacking, the bot will display a combat log detailing the results of attacking with the selected power.

### Defending

When it is your turn to defend, you will the option to either **Block** or **Pass**. Blocking negates 100% of the damage inflicted by your opponents attack.

You and your opponent only get 2 blocks per battle. Choose when you block wisely!

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

Every Power has an associated **Passive**. A Passive is a boost to your combat that is immediately applied to the damage calculations when you attack with a given Power. There are six different Passives, and all three cults have access to the same six Passives.

| Icon | Power      | Cult       | Passive              |
| ---- | ---------- | ---------- | -------------------- |
| ✧    | Divine     | 🩸 Arcane  | Heal +5 HP           |
| ⦲    | Chaos      | 🩸 Arcane  | +10% Hit Chance      |
| ☾    | Mystic     | 🩸 Arcane  | +2.5% Crit Chance    |
| ❍    | Dark       | 🩸 Arcane  | -2.5% Opponent Dodge |
| ⧂    | Spirit     | 🩸 Arcane  | +2.5 Damage          |
| ⨙    | Oblivion   | 🩸 Arcane  | Random Passive       |
| ⩀    | Corporeal  | 🌙 Terrene | Heal +5 HP           |
| ⧰    | Creature   | 🌙 Terrene | +10% Hit Chance      |
| ❖    | Verdure    | 🌙 Terrene | +2.5% Crit Chance    |
| ⦵    | Toxic      | 🌙 Terrene | -2.5% Opponent Dodge |
| ⬙    | Mundane    | 🌙 Terrene | +2.5 Damage          |
| ⏆    | Aqueous    | 🌙 Terrene | Random Passive       |
| ✶    | Cosmos     | ✨ Astral  | Heal +5 HP           |
| ◊    | Inferno    | ✨ Astral  | +10% Hit Chance      |
| ◍    | Geological | ✨ Astral  | +2.5% Crit Chance    |
| ⬡    | Automoton  | ✨ Astral  | -2.5% Opponent Dodge |
| ☉    | Numerary   | ✨ Astral  | +2.5 Damage          |
| ⦓    | Alchemy    | ✨ Astral  | Random Passive       |

### Dominant Power

Each Gawd is assigned a **Dominant Power**. The cult of your Dominant Power determines the cult leanings of your Gawd.

**Attacks with a Dominant Power can not be blocked by the opposing Gawd.** Use strategy to determine the best times to use your block and plan your attacks around your opponent's available blocks.

### Damage Calculations

Every attack goes through the following steps to calculate the final damage to apply to the opposing Gawd each turn.

| Step | Type               | Base Value      | Result                                 |
| ---- | ------------------ | --------------- | -------------------------------------- |
| 1    | Block              | Yes or No       | 100% damage mitigation                 |
| 2    | Hit                | 90% Chance      | If missed, no damage applied           |
| 3    | Dodge              | 15% Chance      | If dodged, no damage applied           |
| 4    | Damage             | 10 Min - 15 Max | Base Damage used for next steps        |
| 5    | Dominant Power     | Yes or No       | Base Damage increased by 10%           |
| 6    | Critical Hit       | 20% Chance      | Damage increased by 15%                |
| 7    | Cult Vulnerability | +/- 10% Damage  | Final Damage boosted or reduced by 10% |
