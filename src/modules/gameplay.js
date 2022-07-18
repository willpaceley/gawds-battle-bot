const coinFlip = require('../modules/coinFlip');

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
  sendVersusMessages: async function (thread, userGawd, cpuGawd) {
    await thread.send(`You selected *${userGawd.name}* as your fighter!`);
    await thread.send({ embeds: [userGawd.versusEmbed] });
    await thread.send('**VERSUS**');
    await thread.send({ embeds: [cpuGawd.versusEmbed] });
    await thread.send(
      `The computer selected *${cpuGawd.name}* as your opponent!`
    );
  },
  getCoinFlipWinner: async function (interaction, thread) {
    const userCalledSide = await coinFlip.getUserResponse(interaction, thread);
    await thread.send('*Flipping coin...*');
    const flipResult = coinFlip.flip();
    const userWon = userCalledSide === flipResult ? true : false;
    userWon
      ? await thread.send(`🎉 The coin landed on **${flipResult}**. You won!`)
      : await thread.send(`😔 The coin landed on **${flipResult}**. You lost.`);
    return userWon;
  },
  setInitialState: async function (thread, userWon, userGawd, cpuGawd) {
    // Add 10 HP to losing Gawd to offset winner's advantage
    userWon ? (cpuGawd.health += 10) : (userGawd.health += 10);
    const loser = userWon ? "your opponent's Gawd" : 'your Gawd';
    await thread.send(`Adding 10 HP to ${loser} to offset winner's advantage.`);
    // Set winner to be the attacker for the first turn
    userWon ? (userGawd.isAttacker = true) : (cpuGawd.isAttacker = true);
  },
};
