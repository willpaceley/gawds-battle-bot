const { MessageEmbed } = require('discord.js');

function getPowerEmbedFields(gawd) {
  // Create an array of EmbedFields
  return gawd.availablePowers.map((power) => {
    return {
      name: `${power.cult.icon} ${power.name}${
        power.name === gawd.dominantPower.name ? ' *' : ''
      }`,
      value: power.passive.description,
    };
  });
}

module.exports.getAttackEmbed = function (battle) {
  const userPowerEmbedFields = getPowerEmbedFields(battle.userGawd);

  return new MessageEmbed()
    .setColor('#22C55E')
    .setTitle(`Turn #${battle.turn} - Attacking`)
    .setDescription(
      'Click on a button below to attack with one of your Powers.'
    )
    .setThumbnail(battle.userGawd.image)
    .addFields(
      {
        name: 'CPU Health',
        value: `❤️ ${battle.cpuGawd.health}`,
        inline: true,
      },
      {
        name: 'CPU Cult',
        value: battle.cpuGawd.cult.label,
        inline: true,
      },
      {
        name: 'CPU Blocks',
        value: `${battle.cpuGawd.blocks}`,
        inline: true,
      },
      { name: '\u200B', value: '**Your Available Powers**' },
      userPowerEmbedFields
    );
};

module.exports.getVersusEmbed = function (gawd) {
  const color = gawd.isUser ? '#22C55E' : '#D0034C';
  return new MessageEmbed()
    .setColor(color)
    .setTitle(gawd.name)
    .setURL(`https://www.gawds.xyz/gallery/${gawd.id}`)
    .addFields(
      { name: 'ID', value: String(gawd.id), inline: true },
      {
        name: 'Cult',
        value: gawd.cult.label,
        inline: true,
      },
      {
        name: 'Dominant Power',
        value: gawd.dominantPower.label,
        inline: true,
      }
    )
    .setImage(gawd.image);
};

module.exports.getDefenseEmbed = function (battle) {
  return new MessageEmbed()
    .setColor('#D0034C')
    .setTitle(`Turn #${battle.turn} - Defending`)
    .setDescription(
      'Your opponent is about to attack! Click on a button below to either Block or Pass.'
    )
    .setThumbnail(battle.cpuGawd.image)
    .addFields(
      {
        name: 'Your Health',
        value: `❤️ ${battle.userGawd.health}`,
        inline: true,
      },
      {
        name: 'Your Cult',
        value: battle.userGawd.cult.label,
        inline: true,
      },
      {
        name: 'Your Blocks',
        value: `${battle.userGawd.blocks}`,
        inline: true,
      },
      { name: '\u200B', value: "**Opponent's Available Powers**" },
      getPowerEmbedFields(battle.cpuGawd)
    );
};
