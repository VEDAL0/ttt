const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const probot = require('probot-tax');
const Users = require('../../data/online');
const DiscordOauth2 = require('discordouth3');
const db = require('pro.db');
const config = require('../../json/config.js');
const black = require('../../data/blacklist');
const online = require('../../data/price/online');
const Discord = require('discord.js')
function MessageEmbedon(color, description) {
  const embed = new Discord.MessageEmbed()
    .setColor(color)
    .setDescription(description);
  return embed;
}

module.exports = {
  name: "price",
  description: `Test the bots response time.`,
  aliases: [],
  async execute(client, message) {
    
    const blacklist = await black.findOne({ userId: message.author.id }).exec();
    if (blacklist) return message.reply({
      embeds: [MessageEmbedon('BLUE', `:red_circle: \`|\` You are on the blacklist, please contact the owners to solve your problem !`)]
    });
    let ticket_1 = await db.get(`ticket_${message.channel.id}`);
    let ticket = await db.get(`ticket_${message.author.id}`);
    const online_users = await Users.find();
    const user_count_on = online_users.length;
    let args = message.content.trim().split(/ +/g);
    let oonnline_on = args[1]
    let countss = args[2];
    if (!oonnline_on) return message.reply(`**يرجي تحديد نوع التوكنات (offline / online / auto)**`);
    if (message.author.bot) return;


    //// Online Code
    if (oonnline_on == 'online') {
      if (!countss) return message.reply(`**يرجي كتبه رقم**`);
      const onnline = await online
        .findOne({ guildId: message.guild.id })
        .exec();
      if (!onnline)
        return message.reply({
          embeds: [
            MessageEmbedon('BLUE', `The owners must make a price first .`)
          ]
        });
      let wait = await db.get(`waiting_${message.author.id}`)
      if (wait) return message.reply(`You already have a purchase`)
      setTimeout(() => {
        if (db.has(`waiting_${message.author.id}`)) {
          db.delete(`waiting_${message.author.id}`)
        }
      }, 60000)
      let price = onnline.price

      let number = Math.floor(price * countss);
      if (isNaN(countss))
        return message.reply(`**عمليه خطاا يجب عليك ادخل رقم**`);
      if (countss < 20)
        return message.reply({
          content: `الحد الادني لشراء التوكنات **20** توكنات .`
        });
      if (countss > user_count_on)
        return message.reply({
          content: `لاء يوجد هذي الكميه في المخزون`,
          ephemeral: true
        });
      if (!ticket_1) {
        message.reply({
          content: `
${price}  × ${countss} = **${number}**
ـــــــــــــــــــــــــــــــــــــــــــــ
${countss} Online Tokens
Price: **${price} Credits**

Go <#${config.ChannelBuy}> to buy .`
        });
        return;
      }
      let tax = Math.floor((number * 20) / 19 + 1);
      let owner = config.transferId;
      let guildId = ticket.guildID;
      let guild = client.guilds.cache.get(guildId);
      if (!guildId || !guild)
        return message.reply({
          content: `
يرجي ادخل البوت الي الخادم الخاص بك ثم اعاده المحوله
${price}  × ${countss} = **${number}**
ـــــــــــــــــــــــــــــــــــــــــــــ
${countss} Online Tokens
Price: **${price} Credits**
\`\`\`
#credit ${owner} ${tax}
\`\`\`
        `});
      let count = countss;
      if (count) {
        let members = await guild.members.fetch();
        let xx = online_users.filter(e =>
          members.find(ee => ee.user.id === e.userId)
        );
        let not = online_users.filter(
          e => !members.find(ee => ee.user.id === e.userId)
        );
        if (not.length < count) {
          message?.reply({
            content: `There is already **${xx.length}** token in **${
              guild.name
              }**\nYou can only add **${not.length}**`
          });
          return;
        }
        message.reply({
          content: `
${price}  × ${countss} = **${number}**
ـــــــــــــــــــــــــــــــــــــــــــــ
${countss} Online Tokens
Price: **${price} Credits**`
        });
        message.channel.send({
          content: `
\`\`\`
#credit ${owner} ${tax}
\`\`\`
يرجي الالتزام بالتحويل داخل التكت
عند التحويل سيتم ادخال الاعضاء تلقائياً لخادمك
**${
            config.prefix
            }price <type> <count>** اذا اردت تغيير نوع التوكنات يرجي استخدام امر`
        });
        db.set(`waiting_${message.author.id}`, true)
        const filter = response =>
          response.content.startsWith(
            `**:moneybag: | ${message.author.username}, has transferred `
          ) &&
          response.content.includes(`${owner}`) &&
          response.author.id === config.probotId &&
          response.content.includes(Number(number));
        message.channel
          .awaitMessages({
            filter,
            max: 1,
            time: 60000,
            errors: ['time']
          })
          .then(async collected => {
            const oauth = new DiscordOauth2();
            let guildId = ticket.guildID;
            let count = countss;
            let guild = client.guilds.cache.get(guildId);
            const users = await Users.find();
            if (count) {
              let members = await guild.members.fetch();
              let xx = users.filter(e =>
                members.find(ee => ee.user.id === e.userId)
              );
              let not = users.filter(
                e => !members.find(ee => ee.user.id === e.userId)
              );
              if (not.length < count) {
                message?.reply({
                  content: `There is already **${xx.length}** token in **${
                    guild.name
                    }**\nYou can only add **${not.length}**`
                });
                return;
              }
              let i = 0;
              let r = 0;
              let btn = new MessageButton()
                .setCustomId('leavee')
                .setLabel('حذف التذكره و الخروج من السرفر')
                .setStyle('DANGER');
              const buttons = new MessageActionRow().addComponents(btn);
              let chennal = await message.guild.channels.cache.get(ticket_1.id);

              message?.guild.channels.cache
                .get(config.ProofChannel)
                .send({
                  content: `**${
                    message.author.username
                    }, Buy ${countss} Online Token **`
                });
              message.channel.send(`تمت عمليه شراء ${count} اونلاين
جاري اكمال عمليه الشراء , يرجي الانتظار لحين انتهاء الادخال`)
              message?.author
                .send(
                  `add __${count} Token__\nDone: **${i}**\nFailed: **${r}**`
                )
                .then(async m => {
                  var timeout = setInterval(() => {
                    m.edit(
                      `add __${count} Token__\nDone: **${i}**\nFailed: **${r}**`
                    ).then(async m => {
                      if (i + r == count) {
                        const role = message.guild.roles.cache.get(config.roleClient)
                        const member = message.author.id
                        let members = message.guild.members.cache.get(member)
                        members.roles.add(role.id).catch(err => 0)
                        message.guild.roles.cache.get(args[1])
                        await m.channel.send({
                          content: `**Thank you for choosing NightStar team Don't forget your opinion on <#${config.feedbackChannelID}>*`
                        });
                        chennal.send({
                          content: `
<@${message.author.id}> تم الانتهاء من هذا الكود ، سيتم اغلاق التذكرة تلقائيا خلال 12 ساعة من عدم التفاعل ،
في حال اكتمل طلبك يرجي الضغط علي زر حذف التذكرة ادناه ,
يمكنك اخبارنا برأيك في الخدمة هنا <#${config.feedbackChannelID}> .`,
                          components: [buttons]
                        });
                      }
                    });
                    if (i + r == count) clearInterval(timeout);
                  }, 2000);
                });
              message.channel.send(`
لقد تم استخدام هذا الرابط بنجاح الى السيرفر **${guild.name}** (\`ID: ${
                guild.id
                }\`)
- 0 توكن اوفلاين
- ${count} توكن اونلاين
- 0 توكن اوتو
ــــــــــــــــــــــــــــــــــــــــــــــــــ`);
              for (let x = 0; x < count; x++) {
                let user = not[x];
                if (user.accessToken) {
                  oauth
                    .addMember({
                      accessToken: user.accessToken,
                      guildId: guildId,
                      botToken: client.token,
                      userId: user.userId
                    })
                    .then(m => {
                      i += 1;
                    })
                    .catch(err => {
                      r += 1;
                    });
                } else {
                  r += 1;
                }
              }
            } else {
              count = online_users.length;
              let members = await guild.members.fetch();
              let xx = online_users.filter(e =>
                members.find(ee => ee.user.id === e.userId)
              );
              let not = online_users.filter(
                e => !members.find(ee => ee.user.id === e.userId)
              );
              if (not.length < count) {
                message?.reply(
                  `There is already **${xx.length}** token in **${
                  guild.name
                  }**\nYou can only add **${not.length}**`
                );
                return;
              }
              let i = 0;
              let r = 0;
              let timeout;
              message
                ?.reply(
                  `Tried to add **${count} Token**\n\nAdded: **${i}**\nFailed: **${r}**`
                )
                .then(m => {
                  timeout = setInterval(() => {
                    m?.edit(
                      `Tried to add **${count} Token**\n\nAdded: **${i}**\nFailed: **${r}**`
                    ).catch(err => 0);
                    if (i + r == count) return clearInterval(timeout);
                  }, 5000);
                })
                .catch(err => 0);
              for (let x = 0; x < count; x++) {
                let user = not[x];
                if (user.accessToken) {
                  oauth
                    .addMember({
                      accessToken: user.accessToken,
                      guildId: guildId,
                      botToken: client.token,
                      userId: user.userId
                    })
                    .then(m => {
                      i += 1;
                    })
                    .catch(err => {
                      r += 1;
                    });
                } else {
                  r += 1;
                }
              }
            }
          })
          .catch(err => {
            message.reply('**تـم ألـغـاء الـعـمـليـه**');
          });
      }
      return;
    }
    //// Offlien Code
    if (oonnline_on == 'offline') {


      if (!countss) return message.reply(`**يرجي كتبه رقم**`);

      const probot = require('probot-tax');
      const Users = require('../../data/offline');
      const DiscordOauth2 = require('discordouth3');
      const db = require('pro.db');
      const online = require('../../data/price/offline');
      const blacklist = await black
        .findOne({ userId: message.author.id })
        .exec();
      if (blacklist)
        return message.reply({
          embeds: [
            MessageEmbedon(
              'BLUE',
              `:red_circle: \`|\` You are on the blacklist, please contact the owners to solve your problem !`
            )
          ]
        });
      const one = await online.findOne({ guildId: message.guild.id }).exec();
      if (!one)
        return message.reply({
          embeds: [
            MessageEmbedon('BLUE', `The owners must make a price first .`)
          ]
        });
      let wait = await db.get(`waiting_${message.author.id}`)
      if (wait) return message.reply(`You already have a purchase`)
      setTimeout(() => {
        if (db.has(`waiting_${message.author.id}`)) {
          db.delete(`waiting_${message.author.id}`)
        }
      }, 60000)
      const price = one.price;

      const users = await Users.find();
      const user_count = users.length;
      let number = Math.floor(price * countss);
      if (!countss) return message.reply(`يرجي كتبه رقم`);
      if (isNaN(countss))
        return message.reply(`**عمليه خطاا يجب عليك ادخل رقم**`);
      if (countss < 20)
        return message.reply({
          content: `الحد الادني لشراء التوكنات **20** توكنات .`
        });
      if (countss > user_count)
        return message.reply({
          content: `لاء يوجد هذي الكميه في المخزون`,
          ephemeral: true
        });
      if (!ticket_1) {
        message.reply({
          content: `
${price}  × ${countss} = **${number}**
ـــــــــــــــــــــــــــــــــــــــــــــ
${countss} Offline Tokens
Price: **${price} Credits**

Go <#${config.ChannelBuy}> to buy .`
        });
        return;
      }
      let tax = Math.floor((number * 20) / 19 + 1);
      let owner = config.transferId;
      let guildId = ticket.guildID;
      let guild = client.guilds.cache.get(guildId);
      if (!guildId || !guild)
        return message.reply({
          content: `
يرجي ادخل البوت الي الخادم الخاص بك ثم اعاده المحوله
${price}  × ${countss} = **${number}**
ـــــــــــــــــــــــــــــــــــــــــــــ
${countss} Offline Tokens
Price: **${price} Credits**
\`\`\`
#credit ${owner} ${tax}
\`\`\`
`
        });

      let count = countss;
      if (count) {
        let members = await guild.members.fetch();
        let xx = users.filter(e => members.find(ee => ee.user.id === e.userId));
        let not = users.filter(
          e => !members.find(ee => ee.user.id === e.userId)
        );
        if (not.length < count) {
          message?.reply({
            content: `There is already **${xx.length}** token in **${
              guild.name
              }**\nYou can only add **${not.length}**`
          });
          return;
        }
        message.reply({
          content: `
${price}  × ${countss} = **${number}**
ـــــــــــــــــــــــــــــــــــــــــــــ
${countss} Offline Tokens
Price: **${price} Credits**`
        });
        message.channel.send({
          content: `
\`\`\`
#credit ${owner} ${tax}
\`\`\`
يرجي الالتزام بالتحويل داخل التكت
عند التحويل سيتم ادخال الاعضاء تلقائياً لخادمك
**${config.prefix}price <type> <count>** اذا اردت تغيير نوع التوكنات يرجي استخدام امر`
        });
        db.set(`waiting_${message.author.id}`, true)
        const filter = response =>
          response.content.startsWith(
            `**:moneybag: | ${message.author.username}, has transferred `
          ) &&
          response.content.includes(`${owner}`) &&
          response.author.id === config.probotId &&
          response.content.includes(Number(number));
        message.channel
          .awaitMessages({
            filter,
            max: 1,
            time: 60000,
            errors: ['time']
          })
          .then(async collected => {
            const oauth = new DiscordOauth2();
            let guildId = ticket.guildID;
            let count = countss;
            let guild = client.guilds.cache.get(guildId);
            const users = await Users.find();
            if (count) {
              let members = await guild.members.fetch();
              let xx = users.filter(e =>
                members.find(ee => ee.user.id === e.userId)
              );
              let not = users.filter(
                e => !members.find(ee => ee.user.id === e.userId)
              );
              if (not.length < count) {
                message?.reply({
                  content: `There is already **${xx.length}** token in **${
                    guild.name
                    }**\nYou can only add **${not.length}**`
                });
                return;
              }
              let i = 0;
              let r = 0;
              let btn = new MessageButton()
                .setCustomId('leavee')
                .setLabel('حذف التذكره و الخروج من السرفر')
                .setStyle('DANGER');
              const buttons = new MessageActionRow().addComponents(btn);
              let chennal = await message.guild.channels.cache.get(ticket_1.id);

              message?.guild.channels.cache
                .get(config.ProofChannel)
                .send({
                  content: `**${
                    message.author.username
                    }, Buy ${countss} Offline Token **`
                });
              message.channel.send(`تمت عمليه شراء ${count} اونلاين
جاري اكمال عمليه الشراء , يرجي الانتظار لحين انتهاء الادخال`)
              message?.author
                .send(
                  `add __${count} Token__\nDone: **${i}**\nFailed: **${r}**`
                )
                .then(async m => {
                  var timeout = setInterval(() => {
                    m.edit(
                      `add __${count} Token__\nDone: **${i}**\nFailed: **${r}**`
                    ).then(async m => {
                      if (i + r == count) {
                        const role = message.guild.roles.cache.get(config.roleClient)
                        const member = message.author.id
                        let members = message.guild.members.cache.get(member)
                        members.roles.add(role.id).catch(err => 0)
                        await m.channel.send({
                          content: `**Thank you for choosing NightStar team Don't forget your opinion on <#${config.feedbackChannelID}>*`
                        });
                        chennal.send({
                          content: `
<@${message.author.id}> تم الانتهاء من هذا الكود ، سيتم اغلاق التذكرة تلقائيا خلال 12 ساعة من عدم التفاعل ،
في حال اكتمل طلبك يرجي الضغط علي زر حذف التذكرة ادناه ,
يمكنك اخبارنا برأيك في الخدمة هنا <#${config.feedbackChannelID}> .`,
                          components: [buttons]
                        });
                      }
                    });
                    if (i + r == count) clearInterval(timeout);
                  }, 2000);
                });
              message.channel.send(`
لقد تم استخدام هذا الرابط بنجاح الى السيرفر **${guild.name}** (\`ID: ${
                guild.id
                }\`)
- ${count}  توكن اوفلاين
- 0 توكن اونلاين
- 0 توكن اوتو
ــــــــــــــــــــــــــــــــــــــــــــــــــ`);
              for (let x = 0; x < count; x++) {
                let user = not[x];
                if (user.accessToken) {
                  oauth
                    .addMember({
                      accessToken: user.accessToken,
                      guildId: guildId,
                      botToken: client.token,
                      userId: user.userId
                    })
                    .then(m => {
                      i += 1;
                    })
                    .catch(err => {
                      r += 1;
                    });
                } else {
                  r += 1;
                }
              }
            } else {
              count = users.length;
              let members = await guild.members.fetch();
              let xx = users.filter(e =>
                members.find(ee => ee.user.id === e.userId)
              );
              let not = users.filter(
                e => !members.find(ee => ee.user.id === e.userId)
              );
              if (not.length < count) {
                message?.reply(
                  `There is already **${xx.length}** token in **${
                  guild.name
                  }**\nYou can only add **${not.length}**`
                );
                return;
              }
              let i = 0;
              let r = 0;
              let timeout;
              message
                ?.reply(
                  `Tried to add **${count} Token**\n\nAdded: **${i}**\nFailed: **${r}**`
                )
                .then(m => {
                  timeout = setInterval(() => {
                    m?.edit(
                      `Tried to add **${count} Token**\n\nAdded: **${i}**\nFailed: **${r}**`
                    ).catch(err => 0);
                    if (i + r == count) return clearInterval(timeout);
                  }, 5000);
                })
                .catch(err => 0);
              for (let x = 0; x < count; x++) {
                let user = not[x];
                if (user.accessToken) {
                  oauth
                    .addMember({
                      accessToken: user.accessToken,
                      guildId: guildId,
                      botToken: client.token,
                      userId: user.userId
                    })
                    .then(m => {
                      i += 1;
                    })
                    .catch(err => {
                      r += 1;
                    });
                } else {
                  r += 1;
                }
              }
            }
          })
          .catch(err => {
            message.reply('**تـم ألـغـاء الـعـمـليـه**');
          });
      }
      return;
    }
    //// Auto Code
    if (oonnline_on == 'auto') {
      const Users = require('../../data/auto');
      const DiscordOauth2 = require('discordouth3');
      const db = require('pro.db');
      const black = require('../../data/blacklist');
      const online = require('../../data/price/auto');
      const blacklist = await black
        .findOne({ userId: message.author.id })
        .exec();
      if (blacklist)
        return message.reply({
          embeds: [
            MessageEmbedon(
              'BLUE',
              `:red_circle: \`|\` You are on the blacklist, please contact the owners to solve your problem !`
            )
          ]
        });
      const one = await online.findOne({ guildId: message.guild.id }).exec();
      if (!one)
        return message.reply({
          embeds: [
            MessageEmbedon('BLUE', `The owners must make a price first .`)
          ]
        });
      let wait = await db.get(`waiting_${message.author.id}`)
      if (wait) return message.reply(`You already have a purchase`)
      setTimeout(() => {
        if (db.has(`waiting_${message.author.id}`)) {
          db.delete(`waiting_${message.author.id}`)
        }
      }, 60000)
      const price = one.price;
      const users = await Users.find();
      const user_count = users.length;
      let number = Math.floor(price * countss);
      if (!countss) return message.reply(`يرجي كتبه رقم`);
      if (isNaN(countss))
        return message.reply(`**عمليه خطاا يجب عليك ادخل رقم**`);
      if (countss < 20)
        return message.reply({
          content: `الحد الادني لشراء التوكنات **20** توكنات .`
        });
      if (countss > user_count)
        return message.reply({
          content: `لاء يوجد هذي الكميه في المخزون`,
          ephemeral: true
        });
      if (!ticket_1) {
        message.reply({
          content: `
${price}  × ${countss} = **${number}**
ـــــــــــــــــــــــــــــــــــــــــــــ
${countss} Auto Tokens
Price: **${price} Credits**

Go <#${config.ChannelBuy}> to buy .`
        });
        return;
      }
      let tax = Math.floor((number * 20) / 19 + 1);
      let owner = config.transferId;
      let guildId = ticket.guildID;
      let guild = client.guilds.cache.get(guildId);
      if (!guildId || !guild)
        return message.reply({
          content: `
يرجي ادخل البوت الي الخادم الخاص بك ثم اعاده المحوله
${price}  × ${countss} = **${number}**
ـــــــــــــــــــــــــــــــــــــــــــــ
${countss} Auto Tokens
Price: **${price} Credits**
\`\`\`
#credit ${owner} ${tax}
\`\`\`
`
        });

      let count = countss;
      if (count) {
        let members = await guild.members.fetch();
        let xx = users.filter(e => members.find(ee => ee.user.id === e.userId));
        let not = users.filter(
          e => !members.find(ee => ee.user.id === e.userId)
        );
        if (not.length < count) {
          message?.reply({
            content: `There is already **${xx.length}** token in **${
              guild.name
              }**\nYou can only add **${not.length}**`
          });
          return;
        }
        message.reply({
          content: `
${price}  × ${countss} = **${number}**
ـــــــــــــــــــــــــــــــــــــــــــــ
${countss} Atuo Tokens
Price: **${price} Credits**`
        });
        message.channel.send({
          content: `
\`\`\`
#credit ${owner} ${tax}
\`\`\`
يرجي الالتزام بالتحويل داخل التكت
عند التحويل سيتم ادخال الاعضاء تلقائياً لخادمك
**${
            config.prefix
            }price <type> <count>** اذا اردت تغيير نوع التوكنات يرجي استخدام امر`
        });
        db.set(`waiting_${message.author.id}`, true)
        const filter = response =>
          response.content.startsWith(
            `**:moneybag: | ${message.author.username}, has transferred `
          ) &&
          response.content.includes(`${owner}`) &&
          response.author.id === config.probotId &&
          response.content.includes(Number(number));
        message.channel
          .awaitMessages({
            filter,
            max: 1,
            time: 60000,
            errors: ['time']
          })
          .then(async collected => {
            const oauth = new DiscordOauth2();
            let guildId = ticket.guildID;
            let count = countss;
            let guild = client.guilds.cache.get(guildId);
            const users = await Users.find();
            if (count) {
              let members = await guild.members.fetch();
              let xx = users.filter(e =>
                members.find(ee => ee.user.id === e.userId)
              );
              let not = users.filter(
                e => !members.find(ee => ee.user.id === e.userId)
              );
              if (not.length < count) {
                message?.reply({
                  content: `There is already **${xx.length}** token in **${
                    guild.name
                    }**\nYou can only add **${not.length}**`
                });
                return;
              }
              let i = 0;
              let r = 0;
              let btn = new MessageButton()
                .setCustomId('leavee')
                .setLabel('حذف التذكره و الخروج من السرفر')
                .setStyle('DANGER');
              const buttons = new MessageActionRow().addComponents(btn);
              let chennal = await message.guild.channels.cache.get(ticket_1.id);

              message?.guild.channels.cache
                .get(config.ProofChannel)
                .send({
                  content: `**${
                    message.author.username
                    }, Buy ${countss} Auto Token **`
                });
              message.channel.send(`تمت عمليه شراء ${count} اوتو
جاري اكمال عمليه الشراء , يرجي الانتظار لحين انتهاء الادخال`)
              message?.author
                .send(
                  `add __${count} Token__\nDone: **${i}**\nFailed: **${r}**`
                )
                .then(async m => {
                  var timeout = setInterval(() => {
                    m.edit(
                      `add __${count} Token__\nDone: **${i}**\nFailed: **${r}**`
                    ).then(async m => {
                      if (i + r == count) {
                        const role = message.guild.roles.cache.get(config.roleClient)
                        const member = message.author.id
                        let members = message.guild.members.cache.get(member)
                        members.roles.add(role.id).catch(err => 0)
                        await m.channel.send({
                          content: `**Thank you for choosing NightStar team Don't forget your opinion on <#${config.feedbackChannelID}>*`
                        });
                        chennal.send({
                          content: `
<@${message.author.id}> تم الانتهاء من هذا الكود ، سيتم اغلاق التذكرة تلقائيا خلال 12 ساعة من عدم التفاعل ،
في حال اكتمل طلبك يرجي الضغط علي زر حذف التذكرة ادناه ,
يمكنك اخبارنا برأيك في الخدمة هنا <#${config.feedbackChannelID}> .`,
                          components: [buttons]
                        });
                      }
                    });
                    if (i + r == count) clearInterval(timeout);
                  }, 2000);
                });
              message.channel.send(`
لقد تم استخدام هذا الرابط بنجاح الى السيرفر **${guild.name}** (\`ID: ${
                guild.id
                }\`)
- 0 توكن اوفلاين
- 0 توكن اونلاين
- ${count} توكن اوتو
ــــــــــــــــــــــــــــــــــــــــــــــــــ`);
              for (let x = 0; x < count; x++) {
                let user = not[x];
                if (user.accessToken) {
                  oauth
                    .addMember({
                      accessToken: user.accessToken,
                      guildId: guildId,
                      botToken: client.token,
                      userId: user.userId
                    })
                    .then(m => {
                      i += 1;
                    })
                    .catch(err => {
                      r += 1;
                    });
                } else {
                  r += 1;
                }
              }
            } else {
              count = users.length;
              let members = await guild.members.fetch();
              let xx = users.filter(e =>
                members.find(ee => ee.user.id === e.userId)
              );
              let not = users.filter(
                e => !members.find(ee => ee.user.id === e.userId)
              );
              if (not.length < count) {
                message?.reply(
                  `There is already **${xx.length}** token in **${
                  guild.name
                  }**\nYou can only add **${not.length}**`
                );
                return;
              }
              let i = 0;
              let r = 0;
              let timeout;
              message
                ?.reply(
                  `Tried to add **${count} Token**\n\nAdded: **${i}**\nFailed: **${r}**`
                )
                .then(m => {
                  timeout = setInterval(() => {
                    m?.edit(
                      `Tried to add **${count} Token**\n\nAdded: **${i}**\nFailed: **${r}**`
                    ).catch(err => 0);
                    if (i + r == count) return clearInterval(timeout);
                  }, 5000);
                })
                .catch(err => 0);
              for (let x = 0; x < count; x++) {
                let user = not[x];
                if (user.accessToken) {
                  oauth
                    .addMember({
                      accessToken: user.accessToken,
                      guildId: guildId,
                      botToken: client.token,
                      userId: user.userId
                    })
                    .then(m => {
                      i += 1;
                    })
                    .catch(err => {
                      r += 1;
                    });
                } else {
                  r += 1;
                }
              }
            }
          })
          .catch(err => {
            message.reply('**تـم ألـغـاء الـعـمـليـه**');
          });
        return;
      }
    }

    message.reply(`**يرجي تحديد نوع التوكنات (offline / online / auto)**`);
  }
};
