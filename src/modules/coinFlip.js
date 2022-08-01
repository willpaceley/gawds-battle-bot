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
  const flipResult = flip();
  const userWon = userCalledSide === flipResult ? true : false;
  const loser = userWon ? "your opponent's Gawd" : 'your Gawd';
  let message = userWon
    ? `🎉 The coin landed on **${flipResult}**. You won!`
    : `😔 The coin landed on **${flipResult}**. You lost.`;
  message += `\nAdding ❤️ **10 health** to ${loser} to offset winner's advantage.`;
  await battle.thread.send(message);
  return userWon;
};
