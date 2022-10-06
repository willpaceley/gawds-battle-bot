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

function sortPools(pools, bestToWorst) {
  const attackArray = [];

  if (bestToWorst) {
    if (pools.best.length) {
      attackArray.push(...pools.best);
    } else if (pools.neutral.length) {
      attackArray.push(...pools.neutral);
    } else {
      attackArray.push(...pools.worst);
    }
  } else {
    if (pools.worst.length) {
      attackArray.push(...pools.worst);
    } else if (pools.neutral.length) {
      attackArray.push(...pools.neutral);
    } else {
      attackArray.push(...pools.best);
    }
  }

  return attackArray;
}

function consumePower(power, availablePowers) {
  // Each time a Gawd attacks with a power it becomes unavailable
  // Decrement power count by 1 if there are multiple of same power
  if (power.count > 1) {
    power.count--;
  } else {
    // Remove power from availablePowers array if there is only one
    const removalIndex = availablePowers.indexOf(power);
    availablePowers.splice(removalIndex, 1);
  }
}

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
    battle.cpuGawd.chanceToBlock = 0.2;
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

    consumePower(attackPower, battle.userGawd.availablePowers);

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

    return choice === 'block';
  },
  getCpuBlockChoice: function (battle) {
    // TODO: If user has no dominant power, always block
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
      battle.cpuGawd.chanceToBlock = 0.2;
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
      // Set starting probability on first CPU attacking turn
      if (battle.turn === 1 || battle.turn === 2) {
        const aggressive = Math.random() < 0.2;
        battle.cpuGawd.chanceToDP = aggressive ? 0.5 : 0;
      }

      // Check for possible lethal opportunity
      if (battle.userGawd.health <= 20) battle.cpuGawd.chanceToDP = 1;

      // Roll to decide whether or not to use dominant power
      const roll = Math.random();
      if (roll < battle.cpuGawd.chanceToDP) {
        // reset probability to use dominant power
        battle.cpuGawd.chanceToDP = 0.25;
        consumePower(dominantPower, availablePowers);
        return dominantPower;
      } else {
        // Increase chance to use dominant power if roll unsuccessful
        battle.cpuGawd.chanceToDP += 0.2;
      }
    }

    // sort available powers into pools by efficacy
    const pools = {
      best: [],
      neutral: [],
      worst: [],
    };

    availablePowers.forEach((power) => {
      // if user has blocks remaining, don't put dominant power in pool
      if (userBlocks && dominantPower) {
        if (power.name === dominantPower.name) return;
      }

      // Check how effective the power is against the user's Gawd
      if (userCult.weakAgainst === power.cult.name) {
        pools.best.push(power);
      } else if (userCult.strongAgainst === power.cult.name) {
        pools.worst.push(power);
      } else {
        pools.neutral.push(power);
      }
    });

    // Decide which pool to select a power from
    // If there are no blocks, always use most effective attacks
    // If there are blocks remaining, use worst attacks first unless aggressive
    let attackArray;

    if (!userBlocks) {
      attackArray = sortPools(pools, true);
    } else {
      // Decide if the CPU wants to risk being aggressive
      const aggressive = Math.random() < 0.2;
      attackArray = aggressive
        ? sortPools(pools, true)
        : sortPools(pools, false);
    }

    // Pick a power from the possible attacks chosen by the CPU
    const length = attackArray.length;
    const randomIndex = Math.floor(Math.random() * length);
    const attackPower = attackArray[randomIndex];

    consumePower(attackPower, availablePowers);

    return attackPower;
  },
};
