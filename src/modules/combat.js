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
  return 25;
};
