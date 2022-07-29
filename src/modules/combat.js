const passives = require('../data/passives');

function getRandomType() {
  const passiveTypes = ['heal', 'hit', 'crit', 'dodge', 'damage'];
  const randomIndex = Math.floor(Math.random() * 5);
  return passiveTypes[randomIndex];
}

module.exports.calculateDamage = async function (battle, power) {
  const attacker = battle.userAttacking ? battle.userGawd : battle.cpuGawd;
  const defender = battle.userAttacking ? battle.cpuGawd : battle.userGawd;
  // Check if the defender is blocking
  if (defender.isBlocking) {
    // Check if the attacker used their Dominant Power
    if (attacker.dominantPower.name === power.name) {
      await battle.thread.send(
        `⛔ The **${power.name}** Dominant Power negated an attempt to **block**!`
      );
    } else {
      await battle.thread.send('🛡️ The attack was **blocked**!');
      return 0;
    }
  }

  // Get the power's passive ability
  let passive = power.passive;
  // If the passive is random, generate a new one for this turn
  if (passive.type === 'random') {
    passive = passives[getRandomType()];
    await battle.thread.send(
      `🔀 **${power.name}** aquired a random passive: ${passive.description}`
    );
  }

  // Determine if the attack hit
  const baseHit = 0.9;
  const hitChance = passive.type === 'hit' ? baseHit + passive.value : baseHit;
  if (Math.random() > hitChance) {
    await battle.thread.send('💨 The attack **missed**!');
    return 0;
  }

  // TODO: Temporary hard coded value, will return calculated damage
  return 25;
};
