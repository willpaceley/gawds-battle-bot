const passives = require('../data/passives');

const baseValues = {
  hit: 0.9,
  dodge: 0.15,
  minDamage: 10,
  maxDamage: 15,
};

function getRandomType() {
  const passiveTypes = ['heal', 'hit', 'crit', 'dodge', 'damage'];
  const randomIndex = Math.floor(Math.random() * 5);
  return passiveTypes[randomIndex];
}

function getBaseDamage(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

module.exports.calculateDamage = async function (battle, power) {
  const attacker = battle.userAttacking ? battle.userGawd : battle.cpuGawd;
  const defender = battle.userAttacking ? battle.cpuGawd : battle.userGawd;
  // TEST 1: Check if the defender is blocking
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
      `🎲 **${power.name}** aquired a random passive: ${passive.description}`
    );
  }

  // TEST 2: Determine if the attack hit
  const hitChance =
    passive.type === 'hit' ? baseValues.hit + passive.value : baseValues.hit;
  if (Math.random() > hitChance) {
    await battle.thread.send('💨 The attack **missed**!');
    return 0;
  }

  // TEST 3: Determine if defender dodged the attack
  const dodgeChance =
    passive.type === 'dodge'
      ? baseValues.dodge - passive.value
      : baseValues.dodge;
  if (Math.random() < dodgeChance) {
    await battle.thread.send('🤸 The attack was **dodged**!');
    return 0;
  }

  // TEST 4: Determine base damage value
  const damage = getBaseDamage(baseValues.minDamage, baseValues.maxDamage);

  return damage;
};
