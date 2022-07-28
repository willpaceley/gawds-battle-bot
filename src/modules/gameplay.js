const { MessageActionRow } = require('discord.js');
const { getAttackEmbed, getVersusEmbed, getDefenseEmbed } = require('./embeds');
const {
  getPowersButtons,
  getPowersRow,
  getBlockButtons,
} = require('./buttons');
const { getButtonClicked } = require('./buttonCollector');
const { calculateDamage } = require('./combat');

// TODO: Call random func from damage calculations during runtime
// If power.passive === 'random' return powers[getRandomType()] from ./modules/powers

// function getRandomType() {
//   const passiveTypes = ['heal', 'hit', 'crit', 'dodge', 'damage'];
//   const randomIndex = Math.floor(Math.random() * 5);
//   return passiveTypes[randomIndex];
// }

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
    await battle.thread.send(
      `You selected *${battle.userGawd.name}* as your fighter!`
    );
    await battle.thread.send({ embeds: [getVersusEmbed(battle.userGawd)] });
    await battle.thread.send('**VERSUS**');
    await battle.thread.send({ embeds: [getVersusEmbed(battle.cpuGawd)] });
    await battle.thread.send(
      `The computer selected *${battle.cpuGawd.name}* as your opponent!`
    );
  },
  setInitialState: async function (battle, userWon) {
    // Add 10 HP to losing Gawd to offset winner's advantage
    userWon ? (battle.cpuGawd.health += 10) : (battle.userGawd.health += 10);
    const loser = userWon ? "your opponent's Gawd" : 'your Gawd';
    await battle.thread.send(
      `Adding 10 HP to ${loser} to offset winner's advantage.`
    );
    // Set winner to be the attacker for the first turn
    userWon ? (battle.userAttacking = true) : (battle.userAttacking = false);
  },
  getUserAttackPower: async function (battle) {
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
      await battle.thread.send(`⚔️ You attacked with **${power.name}** power!`);
      const damage = await calculateDamage(battle);
      await await battle.thread.send(
        `*${battle.cpuGawd.name}* was hit with ${damage} damage`
      );
      battle.cpuGawd.health -= damage;
    }
  },
  getUserBlockChoice: async function (battle) {
    const buttons = getBlockButtons(battle.userGawd);
    const row = new MessageActionRow().addComponents(buttons);

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
    battle.cpuGawd.isBlocking = Math.random() > 0.5;
    if (battle.cpuGawd.isBlocking) battle.cpuGawd.blocks--;
  },
};
