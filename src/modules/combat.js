module.exports.calculateDamage = async function (battle) {
  // const attacker = battle.userAttacking ? battle.userGawd : battle.cpuGawd;
  const defender = battle.userAttacking ? battle.cpuGawd : battle.userGawd;
  // Check if the defender is blocking
  if (defender.isBlocking) {
    console.log('defender is blocking');
    await battle.thread.send('🛡️ The attack was **blocked**!');
    return 0;
  }
  return 25;
};
