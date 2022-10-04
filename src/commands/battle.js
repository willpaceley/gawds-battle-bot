const { SlashCommandBuilder } = require('@discordjs/builders');
const { Gawd } = require('../modules/Gawd');
const { getCoinFlipWinner } = require('../modules/coinFlip');
const gameplay = require('../modules/gameplay');

// Returns a psuedorandom valid Gawd ID
function getRandomId() {
  return Math.floor(Math.random() * 5882 + 1);
}

// Check if user supplied a valid Gawd ID
function isValidId(id) {
  return id > 0 && id < 5883;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('battle')
    .setDescription('Start a battle of the Gawds!')
    .addIntegerOption((option) =>
      option
        .setName('id')
        .setDescription('The ID of the Gawd to battle')
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      // Immediately deferReply() so interaction token doesn't expire during battle
      await interaction.deferReply({ ephemeral: true });
      // Check if user supplied a valid Gawd ID
      const userGawdId = interaction.options.getInteger('id');
      if (!isValidId(userGawdId)) {
        // If ID is not valid, provide user feedback and exit battle
        throw new RangeError(
          'Invalid ID. Start a new battle with an ID between 1 and 5882.'
        );
      }
      // Generate a randomized opponent controlled by the CPU
      // if the random ID is the same as user's ID, generate a new ID
      let cpuGawdId;
      do {
        cpuGawdId = getRandomId();
      } while (cpuGawdId === userGawdId);

      // create user and CPU Gawd objects
      const userGawd = new Gawd(userGawdId);
      const cpuGawd = new Gawd(cpuGawdId, false);
      // Populate Gawd objects by calling Gawds.xyz API
      await userGawd.requestData();
      await cpuGawd.requestData();

      // create the battle thread
      const thread = await gameplay.createThread(interaction, userGawdId);
      // add user to the battle thread
      await thread.members.add(interaction.user);

      const battle = {
        interaction,
        thread,
        userGawd,
        cpuGawd,
        turn: 1,
        userAttacking: false,
      };

      // Send VERSUS intro messages to thread
      await gameplay.sendVersusMessages(battle);

      // Flip a coin to determine who goes first
      const userWon = await getCoinFlipWinner(battle);
      // Set initial state of battle based on winner of coin flip
      gameplay.setInitialState(battle, userWon);

      // loop until user or CPU wins the battle
      while (userGawd.health > 0 && cpuGawd.health > 0) {
        if (battle.userAttacking) {
          cpuGawd.isBlocking = false;
          const power = await gameplay.getUserAttackPower(battle);
          if (cpuGawd.blocks > 0) gameplay.getCpuBlockChoice(battle);
          await gameplay.executeAttack(battle, power);
          battle.userAttacking = false;
        } else {
          const isBlocking = await gameplay.getUserBlockChoice(battle);
          if (isBlocking) battle.userGawd.isBlocking = true;

          const power = gameplay.getCpuPowerChoice(battle);
          await gameplay.executeAttack(battle, power);

          // Reset user isBlocking flag
          if (battle.userGawd.isBlocking) {
            battle.userGawd.blocks--;
            battle.userGawd.isBlocking = false;
          }
          battle.userAttacking = true;
        }
        battle.turn++;
      }
      const userWonBattle = userGawd.health > 0 ? true : false;
      if (userWonBattle) {
        await thread.send('🏆 You won the battle! Congratulations!');
      } else {
        await thread.send('😭 You lost the battle. Feels bad.');
      }
    } catch (error) {
      console.error(error);
      await interaction.editReply(`⚠️ **${error.name}** - ${error.message}`);
      return;
    }
  },
};
