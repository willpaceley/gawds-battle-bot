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
    battle.cpuGawd.isBlocking = Math.random() > 0.5;
    if (battle.cpuGawd.isBlocking) battle.cpuGawd.blocks--;
  },
  getCpuPowerChoice: function (battle) {
    const length = battle.cpuGawd.availablePowers.length;
    const randomIndex = Math.floor(Math.random() * length);
    const attackPower = battle.cpuGawd.availablePowers[randomIndex];

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
