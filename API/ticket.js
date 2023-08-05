const { Client, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, messageCreate, EmbedBuilder, WebhookClient, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const config = require('../json/config.js');
const db = require('pro.db');
const { createTranscript } = require('discord-html-transcripts');

const black = require("../data/blacklist")

function MessageEmbedon(color, description) {
  const embed = new MessageEmbed()
    .setColor(color)
    .setDescription(description)
  return embed
}

module.exports = (client) => {
  client.on('interactionCreate', async i => {
    if (i.customId === 'ticket') {
      let find = db.get(`done_${i.user.id}`)
      if (find) db.delete(`done_${i.user.id}`)
      await i.deferReply({ ephemeral: true });

      const blacklist = await black.findOne({ userId: i.user.id }).exec();
      if (blacklist) return i.editReply({ embeds: [MessageEmbedon("BLUE", `:red_circle: \`|\` You are on the blacklist, please contact the owners to solve your problem !`)], ephemeral: true })
      if (!i.guild.me.permissions.has("MANAGE_CHANNELS")) return i.editReply({ content: `**[BOT] Missing Permissions**` })

      let channelsCount = [];
      let category = client.guilds.cache.get(`${i.guild.id}`).channels.cache.find(category => category.id == `${config.cat}`);
      if (!category) return;
      client.guilds.cache.get(`${i.guild.id}`).channels.cache.forEach(channel => {
        if (channel.parentId == category.id) return channelsCount.push(channel.id);
      });
      if (channelsCount.length == 50) {
        i.editReply({ content: `**Maximum number of channels in category reached (50)**` })
        return;
      }
      if (db.get(`tic_${i.user.id}_${i.guild.id}`) == true) return i.editReply({ content: `> **You have a ticket, you can't open another ticket**` });

      if (db.get(`Tickets-${i.guild.id}`)) {
        db.add(`Tickets-${i.guild.id}`, 1)
      } else {
        db.set(`Tickets-${i.guild.id}`, 2)
      }
      let u = db.get(`Tickets-${i.guild.id}`) || 1
      let ticketname = `Tickets-${u}`
      if (u.toString().length == `1`) { ticketname = `Tickets-000${u}` }
      else if (u.toString().length == `2`) { ticketname = `Tickets-00${u}` }
      else if (u.toString().length == `3`) { ticketname = `Tickets-0${u}` }
      else if (u.toString().length == `4`) { ticketname = `Tickets-${u}` }

      i.guild.channels.create(ticketname,{
      type: 'GUILD_TEXT',
        permissionOverwrites: [
          {
            id: i.guild.roles.everyone,
            deny: ['VIEW_CHANNEL']
          },
          {
            id: i.user.id,
            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ATTACH_FILES'],
          },
          {
            id: `${config
                .supprt}`,
            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ATTACH_FILES'],
          }
        ], parent: `${config
                  .cat}`
      }).then(async ch => {
        if (!db.has('Tickets')) {
          db.set(`Tickets`, [{ guild: i.guild.id, ticketID: ch.id, ticketName: ch.name, userID: [i.user.id] }])
        } else {
          db.push(`Tickets`, { guild: i.guild.id, ticketID: ch.id, ticketName: ch.name, userID: [i.user.id] })
        }
        i.editReply({ content: `**Done Create Ticket ${ch}**`, ephemeral: true })
        let close = new MessageActionRow()
          .addComponents(
            new MessageButton()
              .setCustomId(`close`)
              .setLabel(`Close Ticket`)
              .setEmoji(`🔒`)
              .setStyle(`SECONDARY`),
          )
        const crypto = require('crypto')
        const DiscordOauth2 = require("discord-oauth2");
        const oauth = new DiscordOauth2({
          clientId: client.user.id,
          clientSecret: config.secret,
          redirectUri: config.check,
        });

        const url = oauth.generateAuthUrl({
          scope: ["identify", "bot", "applications.commands"],
          state: crypto.randomBytes(20).toString("hex"),
          permissions: 1
        });
        let closeembed = `

**: في حال قمت بشراء توكنات من خادمنا هذا يعني انك توافق علي شروط الخدمة التالية**

. التوكنات المباعة لا ترد ولا تستبدل الا في حال عدم استلامها بشكل سليم وكامل -
. نحن غير مسؤولين في حال قمت بأخراج التوكنات من خادمك عن طريق الخطأ -
. في حال تم اكتشاف اي محاولة لتخريب البوت او الحصول علي توكنات بشكل مجاني سيتم حظرك من الخادم للابد -
. نحن غير مسؤولين في حال قمت بتحويل الاموال لشخص اخر عن طريق الخطأ -
. نحن غير مسؤولين في حال قمت بالتحويل خارج التكت الخاصة بك ، ولم يتم احتساب التحويل -
. يرجي العلم ان حظر احد التوكنات هذا يعني انك حظرت الخادم الخاص بنا ولن يتمكن من ادخال التوكنات لخادمك مرة اخري -

**-**

: ( **'Create Invite' البوت لا يحتاج الا صلاحية **) للبدء يرجي ادخال البوت لخادمك عن طريق الرابط التالي
${url}`
        ch.send({ content: `Hey ${i.user}, Welcome to ${i.guild.name} `, components: [close],
                embeds: [MessageEmbedon("BLUE", `${closeembed}`)]
                })

        let uu = db.get(`Tickets-${i.guild.id}`)

        db.set(`ticket_${ch.id}`, {
          id: `${ch.id}`,
          owner: `${i.user.id}`,
          count: uu,
        })
        db.set(`ticket_${i.user.id}`, {
          guildID: null,
          id: `${ch.id}`
        })
        db.set(`tic_${i.user.id}_${i.guild.id}`, true)
        let log = i.guild.channels.cache.get(`${config.logs}`)
        let e = new MessageEmbed()
          .setAuthor({ name: `Create Ticket!`, iconURL: `${i.guild.iconURL({ dynamic: true, size: 512 })}` })
          .setColor(`#232b52`)
          .setFields(
            { name: `Action By`, value: `${i.user}` },
            { name: `Action Time`, value: `<t:${parseInt(Date.now() / 1000)}:R>` },
            { name: `Ticket`, value: `${ch}` },
          )
          .setThumbnail(`${i.guild.iconURL({ dynamic: true, size: 512 })}`)
          .setFooter({ text: `iPay Members.`, iconURL: `${i.guild.iconURL({ dynamic: true, size: 512 })}` })
        if (log) {
          log.send({ embeds: [e] })
        }
      })
    }
  })

  client.on('interactionCreate', async i => {
    if (i.customId === 'close') {
      if (!i.guild.me.permissions.has("MANAGE_CHANNELS")) return i.reply({ content: `**[BOT] Missing Permissions**` });
      let ticketclosebut = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId(`yes`)
            .setLabel(`Confirm`)
            .setStyle(`DANGER`),
          new MessageButton()
            .setCustomId(`no`)
            .setLabel(`Cancel`)
            .setStyle(`SECONDARY`)
        )

      i.reply({ content: `Are you sure you would like to close this ticket?`, components: [ticketclosebut] })
    }
  })

  client.on(`interactionCreate`, async interaction => {
    if (interaction.customId == `yes`) {
      let ticket = await db.get(`ticket_${interaction.channel.id}`)
      let owner = await ticket.owner
      if (!interaction.guild.me.permissions.has("MANAGE_CHANNELS")) return interaction.channel.send({ content: `**[BOT] Missing Permissions**` });
      let log = interaction.guild.channels.cache.get(`${config.logs}`)
      interaction.deferUpdate()
      //////////////////////////////////////////////////
      const attachment = await createTranscript(interaction.channel, {
        limit: -1,
        returnBuffer: false,
        fileName: `${interaction.channel.name}.html`
      })
      let usersInTicket = []
      let tickets = db.get(`Tickets`)
      let gg = tickets.filter(t => t.ticketID == interaction.channel.id).map(e => e)
      let messages = await interaction.channel.messages.fetch()
      messages.forEach(mesg => {
        if (usersInTicket.includes(mesg.author.id)) return;
        usersInTicket.push(mesg.author.id)
      })
      let em = new MessageEmbed()
        .setColor("RED")
        .setTitle("Ticket Close")
        .setAuthor({ name: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL({ dynamic: true })}` })
        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
        .setFooter({ text: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL({ dynamic: true })}` })
        .addFields(
          { name: "**Ticket**", value: `${interaction.channel.name}` },
          { name: `**Action by**`, value: `${interaction.user}` }
        )
      await log.send({
        embeds: [em],
        files: [attachment]
      })
      //////////////////////////////////////////////////
      let mmm = new MessageEmbed()
        .setDescription(` Ticket Closed by <@${interaction.user.id}> `)
      await interaction.channel.send({ embeds: [mmm] }).then(() => {
        interaction.channel.send({
          embeds: [new MessageEmbed().setDescription(`Transcript saved`).setColor('GREEN')]
        })
      })
      let u = ticket.count || 1
      let ticketname = `Close-${u}`
      if (u.toString().length == `1`) { ticketname = `Close-000${u}` }
      else if (u.toString().length == `2`) { ticketname = `Close-00${u}` }
      else if (u.toString().length == `3`) { ticketname = `Close-0${u}` }
      else if (u.toString().length == `4`) { ticketname = `Close-${u}` }
      setTimeout(async () => {
        interaction.message.delete()
        try {
          await db.delete(`tic_${owner}_${interaction.guild.id}`)
        } catch (e) {
          return interaction.reply({ content: `> Warning: ticket already closed`, ephemeral: true })
          interaction.channel.send({ embeds: [mm], components: [close_rr] })
          interaction.channel.edit({
            name: ticketname,
            permissionOverwrites: [
              {
                id: interaction.guild.roles.everyone,
                deny: ['VIEW_CHANNEL']
              },
              {
                id: interaction.user.id,
                deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ATTACH_FILES'],
              },
              {
                id: `${config.supprt}`,
                allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ATTACH_FILES'],
              }
            ], parent: `1057263217145020498`
          })
        }
        let mm = new MessageEmbed()
          .setDescription(` \`\`\`Support team ticket controls\`\`\` `)


        let close_rr = new MessageActionRow()
          .addComponents(
            new MessageButton()
              .setCustomId(`delete_ticket`)
              .setLabel(`Delete`)
              .setEmoji(`⛔`)
              .setStyle(`SECONDARY`),
            new MessageButton()
              .setCustomId(`transcript-ticket`)
              .setLabel(`Transcript`)
              .setEmoji(`📑`)
              .setStyle(`SECONDARY`),
          )

        interaction.channel.send({ embeds: [mm], components: [close_rr] })
        interaction.channel.edit({
          name: ticketname,
          permissionOverwrites: [
            {
              id: interaction.guild.roles.everyone,
              deny: ['VIEW_CHANNEL']
            },
            {
              id: interaction.user.id,
              deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ATTACH_FILES'],
            },
            {
              id: `${config.supprt}`,
              allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ATTACH_FILES'],
            }
          ], parent: `1057263217145020498`
        })
      }, 500)
    }
    if (interaction.customId == 'transcript-ticket') {
      await interaction.deferReply()
      await interaction.deleteReply()
      const attachment = await createTranscript(interaction.channel, {
        limit: -1,
        returnBuffer: false,
        fileName: `${interaction.channel.name}.html`
      })
      let usersInTicket = []
      let tickets = db.get(`Tickets`)
      let gg = tickets.filter(t => t.ticketID == interaction.channel.id).map(e => e)
      let owner = gg[0].userID;
      let messages = await interaction.channel.messages.fetch()
      messages.forEach(mesg => {
        if (usersInTicket.includes(mesg.author.id)) return;
        usersInTicket.push(mesg.author.id)
      })
      let em1 = new MessageEmbed()
        .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL({ dynamic: true }))
        .addField(`Ticket Owner`, `${interaction.guild.members.cache.find(e => e.id == owner)}`, true)
        .addField(`Ticket Name`, interaction.channel.name, true)
        .setColor('GREEN')
      if (usersInTicket[0]) {
        let us = usersInTicket.map(e => `${client.users.cache.get(e)} - ${client.users.cache.get(e).tag}`).join('\n')
        em1.addField(`Users in transcript`, us, true)
      }
      interaction.guild.channels.cache.get(config.logs).send({
        files: [attachment],
        embeds: [em1]
      }).then(() => {
        interaction.guild.members.cache.find(e => e.id == owner).send({
          files: [attachment],
          embeds: [em1]
        })
        let em = new MessageEmbed()
          .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL({ dynamic: true }))
          .addField(`Logged Info`, `Ticket: ${interaction.channel.name}\nAction: Transcript Saved`)
          .setColor('GREEN')
        interaction.guild.channels.cache.get(config.logs).send({
          embeds: [em]
        })
        interaction.channel.send({
          embeds: [new MessageEmbed().setDescription(`Transcript saved to ${interaction.guild.channels.cache.get(config.logs)}`).setColor('GREEN')]
        })
        interaction.channel.send({
          files: [attachment]
        })
      })
    }
  })

  client.on(`interactionCreate`, async interaction => {
    if (interaction.customId == `no`) {
      interaction.deferUpdate()
      interaction.message.delete()
    }
  })

  client.on('interactionCreate', async interaction => {
    if (interaction.customId === 'delete_ticket') {
      let embed = new MessageEmbed()
        .setColor("RED")
        .setDescription("**Ticket will be deleted in a few seconds**")
      interaction.channel.send({ embeds: [embed] })
      setTimeout(async () => {
        await interaction.channel.delete()
      }, 5000)
    }
  })

  client.on('guildCreate', async (guild) => {
    let btn = new MessageButton()
      .setCustomId("leave")
      .setLabel("Leave Server")
      .setStyle("SUCCESS")
    let btn1 = new MessageButton()
      .setStyle("LINK")
      .setLabel("Server");
    const buttons = new MessageActionRow()
      .addComponents(btn, btn1)
    let join = new MessageEmbed()
      .setTitle(`I'm Join New Server`)
      .setFields(
        { name: `**Server name :**`, value: `**${guild.name}**` },
        { name: `**Server ID :**`, value: `**\`${guild.id}\`**` },
      )
      .setTimestamp()
    if (guild.me.permissions.has("CREATE_INSTANT_INVITE")) {
      const channels = guild.channels.cache.filter(
        (channel) => channel.type === "GUILD_TEXT"
      );
      const invite = await channels.first().createInvite({
        maxAge: 0,
        reason: "I joined the server",
      });
      btn1.setURL("https://discord.gg/" + invite.code)
    }

    const chaneel = client.channels.cache.get("1069602614427263107")


    const msg = await chaneel.send({ embeds: [join], components: [buttons] })

    const collector = msg.channel.createMessageComponentCollector({
      componentType: "BUTTON"
    })

    collector.on("collect", async (message) => {

      if (message.customId === "leave") {

        let btn = new MessageButton()
          .setCustomId("leave")
          .setLabel("Leave Server")
          .setStyle("DANGER")
          .setDisabled(true)

        let btn1 = new MessageButton()
          .setStyle("LINK")
          .setLabel("Server");
        const buttons = new MessageActionRow()
          .addComponents(btn, btn1)
        let join = new MessageEmbed()
          .setTitle(`I'm leave Server`)
          .setFields(
            { name: `**Server name :**`, value: `**${guild.name}**` },
            { name: `**Server ID :**`, value: `**\`${guild.id}\`**` }
          )

          .setTimestamp()
        try {
          if (guild.me.permissions.has("CREATE_INSTANT_INVITE")) {
            const channels = guild.channels.cache.filter(
              (channel) => channel.type === "GUILD_TEXT"
            );

            const invite = await channels.first().createInvite({
              maxAge: 0,
              reason: "I joined the server",
            });
            btn1.setURL("https://discord.gg/" + invite.code)
          }
        } catch (e) { return }
        await msg.edit({ embeds: [join], components: [buttons] })

        message.reply({ content: `success leave ${guild.name}`, ephemeral: true })
        guild.leave()
      }
    })
  });


  client.on('interactionCreate', async interaction => {
    if (interaction.customId === 'leavee') {
      interaction.reply({ content: `سيتم حذف التذكرة خلال 5 ثواني`, ephemeral: true })
      let ticket = await db.get(`ticket_${interaction.channel.id}`)
      let ticket1 = await db.get(`ticket_${interaction.user.id}`)
      let guildId = ticket.guildID
      let guild = client.guilds.cache.get(guildId)
      let guildId1 = ticket1.guildID
      let guild1 = client.guilds.cache.get(guildId1)
      try {
        try {
          guild.leave()
        } catch (e) {
          guild1.leave()
        }
      } catch (e) {
        interaction.channel.delete()
      }
      let log = interaction.guild.channels.cache.get(`${config.logs}`)

      let member = client.users.cache.get(ticket.owner)
      let em = new MessageEmbed()
        .setColor("RED")
        .setTitle("Ticket Close")
        .setAuthor({ name: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL({ dynamic: true })}` })
        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
        .setFooter({ text: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL({ dynamic: true })}` })
        .addFields(
          { name: "**Ticket**", value: `${interaction.channel.name}` },
          { name: `**Ticket Owner**`, value: `${member}` },
          { name: `**Action by**`, value: `${interaction.user}` }
        )
      await log.send({ embeds: [em] })
      setTimeout(async () => {
        try {
          await db.delete(`tic_${ticket.owner}_${interaction.guild.id}`)
          if (!`ticket_${interaction.user.id}`) {
            return await db.delete(`ticket_${interaction.channel.id}`)
            await interaction.channel.delete()
          }
          await db.delete(`ticket_${interaction.user.id}`)
          await db.delete(`ticket_${interaction.channel.id}`)
        } catch (e) {
          interaction.channel.delete()
        }
        await interaction.channel.delete()
      }, 5000)
    }
  })
}