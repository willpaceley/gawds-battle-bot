const { MessageActionRow, MessageButton } = require('discord.js');
const { getButtonClicked } = require('./buttonCollector');

async function getUserResponse(battle) {
  const headsButton = new MessageButton()
    .setCustomId('heads')
    .setLabel('Heads')
    .setStyle('PRIMARY');

  const tailsButton = new MessageButton()
    .setCustomId('tails')
    .setLabel('Tails')
    .setStyle('PRIMARY');

  const buttons = [headsButton, tailsButton];

  const row = new MessageActionRow().addComponents([headsButton, tailsButton]);

  const coinFlipMessage = await battle.thread.send({
    content: '🪙 Select **Heads** or **Tails**. Winner goes first!',
    components: [row],
  });

  return await getButtonClicked(battle.interaction, coinFlipMessage, buttons);
}

// Return true if user won
function flip() {
  return Math.random() > 0.5 ? 'heads' : 'tails';
}

module.exports.getCoinFlipWinner = async function (battle) {
  const userCalledSide = await getUserResponse(battle);
  await battle.thread.send('*Flipping coin...*');
  const flipResult = flip();
  const userWon = userCalledSide === flipResult ? true : false;
  userWon
    ? await battle.thread.send(
        `🎉 The coin landed on **${flipResult}**. You won!`
      )
    : await battle.thread.send(
        `😔 The coin landed on **${flipResult}**. You lost.`
      );
  return userWon;
};
