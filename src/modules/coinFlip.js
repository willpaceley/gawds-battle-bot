const { MessageActionRow } = require('discord.js');
const { getCoinFlipButtons } = require('./buttons');
const { getButtonClicked } = require('./buttonCollector');

async function getUserResponse(battle) {
  const buttons = getCoinFlipButtons();
  const row = new MessageActionRow().addComponents(buttons);

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
