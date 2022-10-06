const augments = require('../data/augments');

const baseValues = {
  hit: 0.9,
  dodge: 0.1,
  crit: 0.2,
  minDamage: 17,
  maxDamage: 22,
};

function getRandomType() {
  const augmentTypes = ['heal', 'hit', 'crit', 'dodge', 'damage'];
  const randomIndex = Math.floor(Math.random() * 5);
  return augmentTypes[randomIndex];
}

function getBaseDamage(min, max, augment) {
  const base = Math.random() * (max - min) + min;
  return Math.round(base + augment);
}

module.exports.calculateDamage = async function (battle, power) {
  const attacker = battle.userAttacking ? battle.userGawd : battle.cpuGawd;
  const defender = battle.userAttacking ? battle.cpuGawd : battle.userGawd;

  // Start the combat log message. combatLog will sent at end of function
  let combatLog = `⚔️ ${
    attacker.isUser ? 'You' : 'The computer'
  } attacked with **${power.name}** power\n`;

  // Get the power's augment
  let augment = power.augment;
  // If the augment is random, generate a new one for this turn
  if (augment.type === 'random') {
    augment = augments[getRandomType()];
    combatLog += `\n🎲 **${power.name}** acquired a random augment: ${augment.description}`;
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

  // Check for health augment, add 5 health if present
  if (augment.type === 'health') {
    attacker.health += augment.value;
    combatLog += `\n💉 **+${augment.value} Health** added to *${attacker.name}*`;
  }

  // TEST 2: Determine if the attack hit
  const hitChance =
    augment.type === 'hit' ? baseValues.hit + augment.value : baseValues.hit;
  if (Math.random() > hitChance) {
    combatLog += '\n💨 The attack **missed**!';
    await battle.thread.send(combatLog);
    return 0;
  }

  // TEST 3: Determine if defender dodged the attack
  const dodgeChance =
    augment.type === 'dodge'
      ? baseValues.dodge - augment.value
      : baseValues.dodge;
  if (Math.random() < dodgeChance) {
    combatLog += '\n🤸 The attack was **dodged**!';
    await battle.thread.send(combatLog);
    return 0;
  }

  // TEST 4: Determine base damage value
  // Check for augment damage boost, apply if present
  const augmentDamage = augment.type === 'damage' ? augment.value : 0;
  if (augmentDamage) {
    combatLog += `\n🔺 The attack's **base damage** was boosted by ${augmentDamage}`;
  }
  let damage = getBaseDamage(
    baseValues.minDamage,
    baseValues.maxDamage,
    augmentDamage
  );

  // TEST 5: Determine is attack is a Critical Strike
  const critChance =
    augment.type === 'crit' ? baseValues.crit + augment.value : baseValues.crit;
  if (Math.random() < critChance) {
    combatLog += `\n🔪 **CRITICAL STRIKE!** +50% bonus damage`;
    damage *= 1.5;
  }

  // TEST 6: Determine cult vulnerability modifiers
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

  // Add final calculated damage to the combat log
  if (damage > 0) {
    const health = defender.health - damage < 0 ? 0 : defender.health - damage;
    combatLog += `\n**${damage} damage** was applied to *${defender.name}*`;
    combatLog += `\n\n${
      defender.isUser ? 'Your' : "The computer's"
    } Gawd now has ❤️ **${health} health**`;
  }

  await battle.thread.send(combatLog);
  return damage;
};
