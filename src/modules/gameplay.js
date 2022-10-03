const { MessageActionRow } = require('discord.js');
const { getAttackEmbed, getVersusEmbed, getDefenseEmbed } = require('./embeds');
const {
  getPowersButtons,
  getPowersRow,
  getBlockButtons,
} = require('./buttons');
const { getButtonClicked } = require('./buttonCollector');
const { calculateDamage } = require('./combat');
const { getAvailablePowers } = require('./Gawd');

module.exports = {
  createThread: async function (interaction, id) {
    const battleName = `${interaction.user.username}'s Battle - Gawd ${id}`;
    await interaction.editReply(`🧵 Creating new thread: ${battleName}`);
    return await interaction.channel.threads.create({
      name: battleName,
      autoArchiveDuration: 60,
      reason: 'Time to battle!',
    });
  },
  sendVersusMessages: async function (battle) {
    await battle.thread.send({
      content: `You selected *${battle.userGawd.name}* as your fighter!`,
      embeds: [getVersusEmbed(battle.userGawd)],
    });
    await battle.thread.send({
      content: `The computer selected *${battle.cpuGawd.name}* as your opponent!`,
      embeds: [getVersusEmbed(battle.cpuGawd)],
    });
  },
  setInitialState: function (battle, userWon) {
    // Add 10 HP to losing Gawd to offset winner's advantage
    userWon ? (battle.cpuGawd.health += 10) : (battle.userGawd.health += 10);
    // Set winner to be the attacker for the first turn
    userWon ? (battle.userAttacking = true) : (battle.userAttacking = false);
    // Set flag to indicate if CPU defends on even or odd turns
    battle.cpuGawd.evenOrOdd = userWon ? 1 : 0;
    // Set initial CPU chance to block
    battle.cpuGawd.chanceToBlock = 0.25;
  },
  getUserAttackPower: async function (battle) {
    // if user has no availablePowers, repopulate
    if (battle.userGawd.availablePowers.length === 0) {
      battle.userGawd.availablePowers = getAvailablePowers(
        battle.userGawd.powers
      );
    }
    // Make the buttons to apply to the embed message
    const buttons = getPowersButtons(battle.userGawd);
    const rowArray = getPowersRow(buttons);
    // Make the user attack combat Embed
    const attackEmbed = getAttackEmbed(battle);

    const attackMessage = await battle.thread.send({
      embeds: [attackEmbed],
      components: rowArray,
    });

    /* --- COLLECTOR --- */
    const attackPowerName = await getButtonClicked(
      battle.interaction,
      attackMessage,
      buttons
    );

    const indexOfPower = battle.userGawd.availablePowers.findIndex(
      (power) => power.name === attackPowerName
    );
    const attackPower = battle.userGawd.availablePowers[indexOfPower];

    // Each time user attacks with a power it becomes unavailable
    // Decrement power count by 1 if there are multiple of same power
    if (attackPower.count > 1) {
      attackPower.count--;
    } else {
      // Remove power from availablePowers array if there is only one
      battle.userGawd.availablePowers.splice(indexOfPower, 1);
    }

    return attackPower;
  },
  executeAttack: async function (battle, power) {
    if (battle.userAttacking) {
      const damage = await calculateDamage(battle, power);
      battle.cpuGawd.health -= damage;
    } else {
      const damage = await calculateDamage(battle, power);
      battle.userGawd.health -= damage;
    }
  },
  getUserBlockChoice: async function (battle) {
    const buttons = getBlockButtons(battle.userGawd);
    const row = new MessageActionRow().addComponents(buttons);

    // if CPU has no availablePowers, repopulate
    if (battle.cpuGawd.availablePowers.length === 0) {
      battle.cpuGawd.availablePowers = getAvailablePowers(
        battle.cpuGawd.powers
      );
    }

    const defenseEmbed = getDefenseEmbed(battle);

    const blockMessage = await battle.thread.send({
      embeds: [defenseEmbed],
      components: [row],
    });

    const choice = await getButtonClicked(
      battle.interaction,
      blockMessage,
      buttons
    );
    if (choice === 'block') {
      battle.userGawd.blocks--;
      battle.userGawd.isBlocking = true;
    } else {
      battle.userGawd.isBlocking = false;
    }
  },
  getCpuBlockChoice: function (battle) {
    // Increment chance to block by 10% after the opening turns
    if (battle.turn % 2 === battle.cpuGawd.evenOrOdd && battle.turn > 2) {
      battle.cpuGawd.chanceToBlock += 0.1;
    }
    // Force computer to block if health gets too low
    if (battle.cpuGawd.health <= 50 && battle.cpuGawd.blocks === 2) {
      battle.cpuGawd.chanceToBlock = 1;
    } else if (battle.cpuGawd.health <= 25) {
      battle.cpuGawd.chanceToBlock = 1;
    }
    // Roll to determine block status, Set isBlocking flag
    battle.cpuGawd.isBlocking = Math.random() < battle.cpuGawd.chanceToBlock;
    // If computer rolled a block, reduce block count and reset block chance
    if (battle.cpuGawd.isBlocking) {
      battle.cpuGawd.blocks--;
      battle.cpuGawd.chanceToBlock = 0.25;
    }
  },
  getCpuPowerChoice: function (battle) {
    const availablePowers = battle.cpuGawd.availablePowers;
    const userBlocks = battle.userGawd.blocks;
    const userCult = battle.userGawd.cult;

    // determine if dominant power is available
    const dominantPower = availablePowers.find(
      (power) => power.name === battle.cpuGawd.dominantPower.name
    );

    // decide whether or not to use dominant power this turn
    if (dominantPower && userBlocks) {
      const dpIndex = availablePowers.indexOf(dominantPower);

      // Set starting probability on first CPU attacking turn
      if (battle.turn === 1 || battle.turn === 2) {
        const aggressive = Math.random() > 0.5;
        battle.cpuGawd.chanceToDP = aggressive ? 0.5 : 0.25;
      }

      console.log(
        `Current chance to use DP: ${battle.cpuGawd.chanceToDP * 100}%`
      );

      // Roll to decide whether or not to use dominant power
      const roll = Math.random();
      if (roll < battle.cpuGawd.chanceToDP) {
        console.log('attacking with DP');
        // If more than one attack stored
        if (dominantPower.count > 1) {
          // Decrement count by 1 if there are multiple of same power
          dominantPower.count--;
        } else {
          // Remove power from availablePowers array if there is only one
          availablePowers.splice(dpIndex, 1);
        }
        // reset probability to use dominant power
        battle.cpuGawd.chanceToDP = 0.25;
        return dominantPower;
      } else {
        console.log('increasing chance to DP by 20%');
        // Increase chance to use dominant power if roll unsuccessful
        battle.cpuGawd.chanceToDP += 0.2;
      }
    }

    // sort available powers depending on efficacy
    const best = [];
    const neutral = [];
    const worst = [];

    availablePowers.forEach((power) => {
      // Check how effective the power is against the user's Gawd
      if (userCult.weakAgainst === power.cult.name) {
        best.push(power);
      } else if (userCult.strongAgainst === power.cult.name) {
        worst.push(power);
      } else {
        neutral.push(power);
      }
    });

    // Randomly pick an available power to use
    const length = availablePowers.length;
    const randomIndex = Math.floor(Math.random() * length);
    const attackPower = availablePowers[randomIndex];

    // Each time a Gawd attacks with a power it becomes unavailable
    // Decrement power count by 1 if there are multiple of same power
    if (attackPower.count > 1) {
      attackPower.count--;
    } else {
      // Remove power from availablePowers array if there is only one
      battle.cpuGawd.availablePowers.splice(randomIndex, 1);
    }

    return attackPower;
  },
};
