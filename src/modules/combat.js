const passives = require('../data/passives');

const baseValues = {
  hit: 0.9,
  dodge: 0.1,
  crit: 0.2,
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

  // Start the combat log message. combatLog will sent at end of function
  let combatLog = `⚔️ ${
    attacker.isUser ? 'You' : 'The computer'
  } attacked with **${power.name}** power`;

  // Get the power's passive ability
  let passive = power.passive;
  // If the passive is random, generate a new one for this turn
  if (passive.type === 'random') {
    passive = passives[getRandomType()];
    combatLog += `\n🎲 **${power.name}** aquired a random passive: ${passive.description}`;
  }

  // Check for health passive, add 5 health if present
  if (passive.type === 'health') {
    attacker.health += passive.value;
    combatLog += `\n💉 **+${passive.value} Health** added to *${attacker.name}*`;
  }

  // TEST 1: Check if the defender is blocking
  if (defender.isBlocking) {
    // Check if the attacker used their Dominant Power
    if (attacker.dominantPower.name === power.name) {
      combatLog += `\n⛔ The **${power.name}** Dominant Power negated an attempt to **block**!`;
    } else {
      combatLog += '\n🛡️ The attack was **blocked**!';
      await battle.thread.send(combatLog);
      return 0;
    }
  }

  // TEST 2: Determine if the attack hit
  const hitChance =
    passive.type === 'hit' ? baseValues.hit + passive.value : baseValues.hit;
  if (Math.random() > hitChance) {
    combatLog += '\n💨 The attack **missed**!';
    await battle.thread.send(combatLog);
    return 0;
  }

  // TEST 3: Determine if defender dodged the attack
  const dodgeChance =
    passive.type === 'dodge'
      ? baseValues.dodge - passive.value
      : baseValues.dodge;
  if (Math.random() < dodgeChance) {
    combatLog += '\n🤸 The attack was **dodged**!';
    await battle.thread.send(combatLog);
    return 0;
  }

  // TEST 4: Determine base damage value
  // Check for passive damage boost, apply if present
  const passiveDamage = passive.type === 'damage' ? passive.value : 0;
  if (passiveDamage) {
    combatLog += `\n🔺 The attack's **base damage** was boosted by ${passiveDamage}`;
  }
  let damage = getBaseDamage(
    baseValues.minDamage,
    baseValues.maxDamage,
    passiveDamage
  );

  // TEST 5: Determine cult vulnerability modifiers
  if (power.cult.strongAgainst === defender.cult.name) {
    // Apply 20% damage boost
    damage = Math.round(damage * 1.2);
    combatLog += `\nThe **${power.cult.label}** power is strong against the **${defender.cult.label}** Gawd`;
    // combatLog += '\n📈 Total damage **boosted by 20%**';
  } else if (power.cult.weakAgainst === defender.cult.name) {
    // Apply 20% damage reduction
    damage = Math.round(damage * 0.8);
    combatLog += `\nThe **${power.cult.label}** power is weak against the **${defender.cult.label}** Gawd`;
    // combatLog += '\n📉 Total damage **reduced by 20%**';
  }

  // TEST 6: Determine is attack is a Critical Strike
  const critChance =
    passive.type === 'crit' ? baseValues.crit + passive.value : baseValues.crit;
  if (Math.random() < critChance) {
    combatLog += `\n🔪 CRITICAL STRIKE! **100% bonus damage**`;
    damage *= 2;
  }

  // Add final calculated damage to the combat log
  if (damage > 0) {
    const health = defender.health - damage < 0 ? 0 : defender.health - damage;
    combatLog += `\n**${damage} damage** was applied to ${
      defender.isUser ? 'your' : "the computer's"
    } Gawd`;
    combatLog += `\n*${defender.name}* now has ❤️ **${health} health**`;
  }

  await battle.thread.send(combatLog);
  return damage;
};
