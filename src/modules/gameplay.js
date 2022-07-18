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
    await thread.send('Flipping coin...');
    const flipResult = coinFlip.flip();
    const userWon = userCalledSide === flipResult ? true : false;
    userWon
      ? await thread.send(`🎉 The coin landed on **${flipResult}**. You won!`)
      : await thread.send(`😔 The coin landed on **${flipResult}**. You lost.`);
    return userWon;
  },
};
