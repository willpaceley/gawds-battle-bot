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

function getBaseDamage(min, max, passive) {
  const base = Math.random() * (max - min) + min;
  return Math.round(base + passive);
}

module.exports.calculateDamage = async function (battle, power) {
  const attacker = battle.userAttacking ? battle.userGawd : battle.cpuGawd;
  const defender = battle.userAttacking ? battle.cpuGawd : battle.userGawd;
  // Get the power's passive ability
  let passive = power.passive;
  // If the passive is random, generate a new one for this turn
  if (passive.type === 'random') {
    passive = passives[getRandomType()];
    await battle.thread.send(
      `🎲 **${power.name}** aquired a random passive: ${passive.description}`
    );
  }

  // Check for health passive, add 5 health if present
  if (passive.type === 'health') {
    attacker.health += passive.value;
    await battle.thread.send(
      `💉 **+${passive.value} Health** added to *${attacker.name}*`
    );
  }

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
  // Check for passive damage boost, apply if present
  const passiveDamage = passive.type === 'damage' ? passive.value : 0;
  if (passiveDamage) {
    await battle.thread.send(
      `🔺 The attack's **base damage** was boosted by ${passiveDamage}`
    );
  }
  const damage = getBaseDamage(
    baseValues.minDamage,
    baseValues.maxDamage,
    passiveDamage
  );

  return damage;
};
