const { MessageEmbed } = require('discord.js');
const cults = require('../data/cults');

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

function getCultEmbedFields(powersArray) {
  const embedFields = [];
  const cultCounts = {
    Arcane: 0,
    Astral: 0,
    Terrene: 0,
  };
  powersArray.forEach((power) => (cultCounts[power.cult.name] += power.count));
  for (const cult in cultCounts) {
    embedFields.push({
      name: cults[cult].label,
      value: String(cultCounts[cult]),
      inline: true,
    });
  }
  return embedFields;
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
      {
        name: 'CPU Blocks',
        value: `${battle.cpuGawd.blocks}`,
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
      getCultEmbedFields(battle.cpuGawd.availablePowers)
    );
};
