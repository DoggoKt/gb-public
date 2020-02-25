require('discord.js');
const Ticket = require('./models.js').ticket;
const Lock = require('./models.js').lock;
const embeds = require('./embeds.js');

async function modmailLockFetch(userID){ //returns true/false depending on if existent
  return new Promise(async function(resolve){
      const lock = await Lock.findOne({userID: userID});
      if (!lock) return resolve(false);
      return resolve(true);
  });
}
async function modmailLockAcquire(userID){
  return new Promise(async function(resolve, reject) {
      const exists = await modmailLockFetch(userID);
      if (exists) return reject(new Error("A lock is already present."));
      const lock = new Lock({userID: userID});
      await lock.save().catch(err => reject(err));
      resolve();
  });
}
async function modmailLockRemove(userID){
  return new Promise(async function(resolve, reject) {
      const lock = await Lock.findOne({userID: userID});
      if (!lock) return reject(new Error("No locks have been found for the given ID."));
      await lock.deleteOne(lock).catch(err => {return reject(err)});
      resolve();
  });
}

function getPerms(guild, type, open){
    if (open){
      switch (type) {
        case "general":
          return [{
            id: guild.roles.get("643093622094430217"),
            allow: "VIEW_CHANNEL"
          }, {
            id: guild.roles.everyone,
            deny: "VIEW_CHANNEL"
          }];
        case "suggestion":
          return;
        case "report":
          return;

    }
  } else {
      switch (type) {
        case "general":
          return [{
            id: guild.roles.get("643093622094430217"),
            allow: "VIEW_CHANNEL",
            deny: "SEND_MESSAGES"
          }, {
            id: guild.roles.everyone,
            deny: "VIEW_CHANNEL"
          }];
        case "suggestion":
          return;
        case "report":
          return;

      }
  }
}
async function waitForMessage(channel, authorID, bot, maxTime = false){
  return new Promise(async function(resolve, reject) {
    const filter = m => m.author.id === authorID;
    const options = {}
    options.max = 1;
    if (maxTime) {
      options.time = maxTime;
      options.errors = ['time']
    }
    await channel.awaitMessages(filter, options).then(collected => {
      const message = collected.first();
      return resolve(message.content);
    }).catch(() => {return reject("timeout")})
  });
}
async function waitForReaction(message, emojis, bot, maxTime = false, reqRoleID){
  return new Promise(async function(resolve) {
    let filter;
    if (reqRoleID){
      filter = (reaction, user) => {
        return emojis.includes(reaction.emoji.name) && user.id !== bot.user.id && message.guild.members.get(user.id).roles.get(reqRoleID);
      };
    } else {
      filter = (reaction, user) => {
        return emojis.includes(reaction.emoji.name) && user.id !== bot.user.id;
      };
    }
    emojis.forEach(emoji => {
      message.react(emoji).catch(e => {
	if (e.message === "Unknown Message") return;
	console.log(e);
	});
    });
    const options = {}
    options.max = 1;
    if (maxTime) {
      options.time = maxTime;
      options.errors = ['time']
    }
    await message.awaitReactions(filter, options).then(async collected => {
        const emoji = collected.first().emoji.name;
        return resolve(emoji, collected);
    }).catch(() => {return resolve("timeout")});
  });
}

async function fetchTicket(user){
  return new Promise(async function(resolve, reject) {
    const ticket = await Ticket.findOne({userID: user.id}).catch(err => {
      reject(err);
    })
    if (ticket === null) {return reject(new Error("No tickets were found for the given query."))
  } else {return resolve(ticket);}
  });
}

async function createTicket(user, inquiryType, categoryID, bot){
  return new Promise(async function(resolve){
      const guild = bot.guilds.get("641734603379441685");
      const category = bot.channels.get(categoryID);
      const channel = await guild.channels.create(`${user.username.toLowerCase()}_${user.discriminator}`, {
        parent: category,
        permissionOverwrites: getPerms(guild, "general", true)
      });

      const ticket = new Ticket({
        userID: user.id,
        channelID: channel.id,
        archived: false,
        inquiryType: inquiryType
      })
      ticket.save();
      return resolve(channel);
  });
}



async function closeTicket(message, user, closedByUser, bot, reason = "No reason has been specified."){
  return new Promise(async function(resolve) {
    const ticket = await fetchTicket(user);
    const channel = bot.channels.get(ticket.channelID);

    if (closedByUser) {
      // Staff \\
      await message.channel.send(embeds.modmail.userClosedSuccess())
      const infoMessage = await channel.send(embeds.modmail.userClosedInfo(message, reason));
      await channel.edit({
        name: `📦${channel.name}`,
        permissionOverwrites: getPerms(channel.guild, "general", false)
      })
      Ticket.findOneAndUpdate({userID: user.id}, {archived: true}, { useFindAndModify: false }, function(err){
        if (err) console.log(err);
      })
      await waitForReaction(infoMessage, ["🗑️", "📤"], bot).then(emoji => {
          if (emoji === "🗑️"){
            ticket.deleteOne(ticket);
            channel.delete();
          } else {
            infoMessage.reactions.removeAll();
            channel.send(embeds.modmail.userReopenedSuccess());
            user.send(embeds.modmail.userReopenedInfo(message));
            Ticket.findOneAndUpdate({userID: user.id}, {archived: false}, { useFindAndModify: false }, function(err){
              if (err) console.log(err);
            })
            channel.edit({
              name: `${user.username}#${user.discriminator}`,
              permissionOverwrites: getPerms(channel.guild, "general", true)
            })
          }
      });
    } else {
      // Staff \\
      const infoMessage = await message.channel.send(embeds.modmail.staffClosedSuccess(message));
      user.send(embeds.modmail.staffClosedInfo(message, reason));
      await channel.edit({
        name: `📦${channel.name}`,
        permissionOverwrites: getPerms(channel.guild, "general", false)
      })
      Ticket.findOneAndUpdate({userID: user.id}, {archived: true}, { useFindAndModify: false }, function(err){
        if (err) console.log(err);
      })
      waitForReaction(infoMessage, ["🗑️", "📤"], bot).then(emoji => {
          if (emoji === "🗑️"){
            ticket.deleteOne(ticket);
            channel.delete();
          } else {
            infoMessage.reactions.removeAll();
            channel.send(embeds.modmail.staffReopenedSuccess(message));
            user.send(embeds.modmail.staffReopenedInfo(message));
            Ticket.findOneAndUpdate({userID: user.id}, {archived: false}, { useFindAndModify: false }, function(err){
              if (err) console.log(err);
            })
            channel.edit({
              name: `${user.username}_${user.discriminator}`,
              permissionOverwrites: getPerms(channel.guild, "general", true)
            })
          }
      });
      resolve();
    }

  });
}

module.exports = {
  askReactions: waitForReaction,
  askMessage: waitForMessage,
  modmail: {
    fetch: fetchTicket,
    create: createTicket,
    close: closeTicket,
    perms: getPerms,
    lock: {
      fetch: modmailLockFetch,
      acquire: modmailLockAcquire,
      remove: modmailLockRemove
    }
  }
}
