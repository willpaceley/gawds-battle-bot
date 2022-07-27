const { MessageEmbed } = require('discord.js');

function getPowerEmbedFields(powersArray) {
  // Display powers as inline if there more than 5
  const shouldBeInline = powersArray.length > 5;
  // Create an array of EmbedFields
  return powersArray.map((power) => {
    return {
      name: power.label,
      value: power.passive.description,
      inline: shouldBeInline,
    };
  });
}

module.exports.getAttackEmbed = function (battle) {
  const userPowerEmbedFields = getPowerEmbedFields(
    battle.userGawd.availablePowers
  );

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
      { name: '\u200B', value: '**Available Powers**' },
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
