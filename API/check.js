const config = require('../json/config.js');
const emoji = require('../json/emoji.js');
const User = require("../data/online");
module.exports = (client) => {
  const express = require('express');
  const app = express();
  const passport = require("passport");
  const db = require("pro.db")
  const { Router } = require("express");
  const router = Router();
  const {
    Strategy
  } = require("passport-discord");
  const bodyParser = require('body-parser');
  const expressSession = require('express-session');

  app.use(bodyParser.urlencoded({
    extended: true
  }));


  passport.serializeUser((user, done) => {
    done(null, user);
  });
  
  passport.deserializeUser(async (userId, done) => {
    const user = await User.findOne({ userId:userId.userId });
    return done(null, user);
  });

  let strategy = new Strategy({
    clientID: client.user.id,
    clientSecret: config.secret,
    callbackURL: config.check,
    scope: ["identify", "guilds.join"]
  }, (accessToken, refreshToken, profile, done) => {
    profile.refreshToken = refreshToken;
              const userData = {
                userId: profile.id,
                discordTag: `${profile.username}#${profile.discriminator}`,
                accessToken,
                refreshToken,
              };
    process.nextTick(() => done(null, profile));
     User.findOneAndUpdate(
                {
                  userId: userData.userId,
                },
                userData,
                {
                  upsert: true,
                }
              )
    
  })

  const sessionMiddleware = expressSession({
    secret: config.secret,
    resave: false,
    saveUninitialized: false
  });




  passport.use(strategy);
  app.use(sessionMiddleware);
  app.use(passport.initialize());
  app.use(passport.session());

  app.get("/error", (req, res) => {
    res.render('Invalid.ejs')
  })
  app.get("/errors", (req, res) => {
    res.render('Invalids.ejs')
  })
  app.get("/invte", passport.authenticate("discord", {
    scope: ["identify", "bot"]
  }));
  app.engine('html', require('ejs').renderFile);
  app.get("/check", passport.authenticate("discord", {
    failureRedirect: "/"
  }), async (req, res) => {
    let find = db.has(`done_${req.user.id}`)
    if (find) return res.redirect('/error')
    let ticdata = db.get(`ticket_${req.user.id}`)
    if (!ticdata) return res.redirect('/error')
    ticdata.guildID = `${req.query.guild_id}`
    db.set(`ticket_${req.user.id}`, ticdata)
    let ticket = db.get(`ticket_${req.user.id}`)
    const channel = client.channels.cache.get(ticket.id)
    let guild = config.serverID
    let guilds = client.guilds.cache.get(req.query.guild_id)
    const Online = require("../data/online");
    const Offline = require("../data/offline");
    const Auto = require("../data/auto");
    const online = await Online.find();
    const offline = await Offline.find();
    const auto = await Auto.find();
    let members = await guilds.members.fetch()
    let onlines = online.filter(e => members.find(ee => ee.user.id === e.userId));
    let offlines = offline.filter(e => members.find(ee => ee.user.id === e.userId));
    let autos = auto.filter(e => members.find(ee => ee.user.id === e.userId));
    let onlines_not = online.length - onlines.length
    let offlines_not = offline.length - offlines.length
    let autos_not = auto.length - autos.length
    let can = autos.length + offlines.length + onlines.length;

    channel.send({
      content: `
(\`${guilds.name}\`) **تم التعرف علي سيرفرك بنجاح**

${emoji.offline} **التوكنات الاوفلاين اللتي يمكن اضافتها : ${offlines_not} **
${emoji.online}** التوكنات الاونلاين اللتي يمكن اضافتها : ${onlines_not}** 
${emoji.auto} **التوكنات الاوتو اللتي يمكن اضافتها : ${autos_not} **


**لبدئ عملية ادخال التوكنات لخادمك , يرجي استخدام الامر التالي :**
**${config.prefix}price <type> <amount>**

Ex :
**${config.prefix}price online ${onlines_not}**
**${config.prefix}price offline ${offlines_not}**
**${config.prefix}price auto ${autos_not}**

التوكنات اللتي تم اضافتها لخادمك من قبل : **${can}** .
    ` })

    db.set(`done_${req.user.id}`, true)

    try {
      res.render("check.ejs", {
        link: "https://discord.com/channels/" + guild + "/" + channel
      })
    } catch (err) {
      res.redirect("/")
    }

  })
  const PORT = 5555;
  app.listen(PORT, () => console.log(`Checker on ${PORT}`));
}