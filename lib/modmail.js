const Discord = require('discord.js');
const utils = require('./utils.js');
const embeds = require('./embeds.js');
const ticketModel = require('./models.js').ticket;


async function generalTicket(message, bot) {
  return new Promise(async function (resolve) {
    const channel = await utils.modmail.create(message.author, "general", "659480481406124043", bot);
    await message.channel.send(embeds.modmail.createSuccess());//for user
    channel.send("<@&643093622094430217>").then(m => m.delete()); //staff notify
    channel.send(embeds.modmail.createInfo(message, "General help"));
    resolve();
  });
}

async function reportTicket(message, bot) {
  return new Promise(async function (resolve, reject) {
    await message.author.send("Do not send fake reports, there **WILL** be consequences if you do!")
    await utils.sleep(1500);
    await message.author.send("You are going to be asked for proof later. If you do not have any form of image/video proof, or witnesses, please do not progress forward.")
    await utils.sleep(3000);
    await message.author.send("You are **NOT** going to be notified about the progress and/or consenquences regarding this case, as of to keep enough privacy.")
    await utils.sleep(3500)
    const agreeMessage = await message.author.send("Do you agree with all of the above? (Use reactions to answer.)");
    const agreeEmoji = await utils.askReactions(agreeMessage, ["👍", "🛑"], bot, 10500)
        .catch(err => {
          if (err === "timeout") {reject(new Error("Agreement timeout. Session terminated."))}
          else console.log(err);
        })
    if (!agreeEmoji) return;
    if (agreeEmoji !== "👍") return reject(new Error("Did not accept rules. Session terminated."));

    await message.author.send("What user are you reporting? Reply with an **User ID** or the **username#tag** in this format.")

    async function searchForUser() {
      return new Promise(async function (resolve, reject) {
        let reported;
        let attempts = 1;
        // 3 attempts
        while (attempts < 4) {
          const search = await utils.askMessage(message.channel, message.author.id, bot, 120000)
              .catch(() => {
                message.author.send("You have not responded within 2 minutes. Session terminated.");
                reject("timeout")
              });
          if (!search) break;
          if (/(.+)#(\d\d\d\d)/g.test(search)) {
              reported = await bot.guilds.first().members.find(m => m.user.tag === search);
            if (!reported) {
              await message.author.send(`Could not find using the provided ID. Please try again (${3 - attempts} attempts left).`);
            } else {
              resolve(reported);
              break;
            }
          } else if (typeof (parseInt(search)) === 'number') {
            reported = await bot.guilds.first().members.get(search);
            if (!reported) {
              await message.author.send(`Could not find using the provided ID. Please try again (${3 - attempts} attempts left).`);
            } else { // regex to check if it's a valid username#discriminator
              resolve(reported);
              break;
            }
          } else {
            await message.author.send(`The provided information is in an incorrect format. Please try again (${3 - attempts} attempts left).`)
          }
          attempts++;
        }
      })
    }

    // Reported user
    const reported = await searchForUser()
        .catch(err => {
          if (err === "timeout") {reject(new Error("User could not be found. Session terminated."))}
          else console.log(err);
        })
    if (!reported) return;
    // Reason / Description
    await message.author.send("Successfuly found the reported user. What are you reporting them for? Try to include as much detail as you can, this is the place for long description. (You will be asked to provide proof later.)");
    const reportDescription = await utils.askMessage(message.channel, message.author.id, bot, 12000).catch(err => {
      if (err === "timeout") {reject(new Error("Reason timeout. Session terminated."))}
      else console.log(err);
    })
    if (!reportDescription) return;
    const proofReqMessage = await message.author.send("Almost done! What type of proof are you going to supply? 📷 for local images, 🎥 for local videos, 🔗 for remote images/videos (imgur.com/streamlabs.com) and 🧍 for witnesses.")
    await utils.askReactions(proofReqMessage, [], bot,30000)
        .then(async emoji => {
            switch (emoji) {
                case "📷":

                case "🎥":

                case "🔗":

                case "🧍":
                    
            }
        })

      const proofMessage = await utils.askMessage(message.channel, message.author.id, bot, 300000) // 5 mins
    let proofAttachments = [];



    // Submission
    //will find a channel with the name "reports"
    const channel = await bot.guilds.first().channels.find(ch => ch.name === "reports");
    await message.channel.send("Your report has been successfuly sent! The staff will review the case as soon as possible.");
    channel.send("<@&533618768073457665>").then(m => m.delete()); //staff notify
    const reportMessage = await channel.send(`author: ${message.author.tag}\nreported user: ${reported.user.tag} (${reported.user.id})\nreported for: \`\`\`${reportDescription}\`\`\``);

    await utils.askReactions(reportMessage, ["🛑", "🤛", "🔨", "⚙"], bot, false, "679423393766047776").then(async (emoji, collected) => {
      const user = collected.users.first();
      if (emoji === "🛑") {
        const reasonMessage = await user.send("Please provide a reason for your report denial.")
        const reason = await utils.askMessage(reasonMessage.channel, user.id, bot)
        await message.author.send(`denied. reason: ${reason}`)
      } else if (emoji === "🤛") {
        await reported.kick(`Based on report by ${message.author.tag}.`);
      } else if (emoji === "🔨") {
        await reported.ban({
          days: 0.5,
          reason: `Based on report by ${message.author.tag}.`
        });
      }
      await reportMessage.reactions.removeAll();
      await reportMessage.edit(`reported user: ${reported.user.tag}\nhandled by: <@${user.id}>`)
      await reportMessage.react("👍");
    })
  });
}

async function suggestionTicket() {
}


module.exports.handler = async (message, bot) => {
  return new Promise(async function (resolve) {

    const lock = await utils.modmail.lock.fetch(message.author.id);
    if (lock) return resolve(false);
    await utils.modmail.fetch(message.author) // userID, channelID, archived, inquiryType
        .then(async Ticket => {

          if (message.channel.type === "dm") {
            const channel = bot.channels.get(Ticket.channelID); // Channel retrieved using channelID from the Ticket
            // Check for potential error of invalid database entry
            if (!channel) {
              Ticket.deleteOne(Ticket);
              await message.channel.send(embeds.modmail.noChannel());
              return resolve(true);
            }
            if (message.content === ">close") { // No reason
              await utils.modmail.close(message, message.author, true, bot)
            } else if (message.content.startsWith(">close ")) { // Reason provided
              await utils.modmail.close(message, message.author, true, bot, message.content.slice(7))
            }
            // Check for user potentially sending more than one attachment (Error)
            if (message.attachments.size > 1) {
              message.channel.send(embeds.modmail.attachmentLimit());
              return resolve(true);
            }
            // Check if ticket is archived, if such, reopen it and continue
            if (Ticket.archived) {
              channel.messages.fetch({limit: 35}).then(messages => {
                messages.filter(m => m.author.id === bot.user.id).first().reactions.removeAll();
              })
              await message.author.send(embeds.modmail.userReopenedSuccess());
              await channel.send(embeds.modmail.userReopenedInfo(message));
              ticketModel.findOneAndUpdate({userID: message.author.id}, {archived: false}, {useFindAndModify: false}, function (err) {
                if (err) console.log(err);
              })
              await channel.edit({
                name: `${message.author.tag}`,
                permissionOverwrites: utils.modmail.perms(channel.guild, "general", true)
              })
            }


            // Informs the user
            message.channel.send(embeds.modmail.deliveredToStaff(message)).then(m => m.delete({timeout: 3500}))
            // Informs the staff
            channel.send(embeds.modmail.receivedFromUser(message))
            return resolve(true)
          } else {
            if (message.channel.id !== Ticket.channelID) return resolve(false);
            const user = bot.users.get(Ticket.userID);

            if (message.content === ">close") { // No reason
              await utils.modmail.close(message, user, false, bot)
            } else if (message.content.startsWith(">close ")) { // Reason provided
              await utils.modmail.close(message, user, false, bot, message.content.slice(7))
            } else if (message.content.startsWith(">reply ")) { // reply
              message.delete();
              message.channel.send(embeds.modmail.deliveredToUser(message, false))
              user.send(embeds.modmail.receivedFromStaff(message, false))
              return resolve(true);
            } else if (message.content.startsWith(">r ")) { //reply shortcut
              message.delete();
              message.channel.send(embeds.modmail.deliveredToUser(message, true))
              user.send(embeds.modmail.receivedFromStaff(message, true))
              return resolve(true);
            } else {
              return resolve(false);
            }
          }
        })
        .catch(async () => { // No ticket found \\
          //return
          if (message.channel.type === "dm") {
            // Check for user potentially sending more than one attachment (Error)
            if (message.attachments.size > 1) {
              message.channel.send(embeds.modmail.attachmentLimit());
              return resolve(true);
            }
            await utils.modmail.lock.acquire(message.author.id);
            confirmationMessage = await message.channel.send(embeds.modmail.confirmation(message))
            emoji = await utils.askReactions(confirmationMessage, ["🇦", /*"🇧", */"❌"], bot, 35000);
            confirmationMessage.delete();
            switch (emoji) {
              case "🇦":
                await generalTicket(message, bot);
                await utils.modmail.lock.remove(message.author.id);
                resolve(true);
                break;
              case "🇧":
                await reportTicket(message, bot)
                await utils.modmail.lock.remove(message.author.id);
                resolve(true);
                break;
              case "🇨":
                await suggestionTicket();
                await utils.modmail.lock.remove(message.author.id);
                resolve(true);
                break;
              case "❌":
                message.channel.send(embeds.modmail.cancelled())
                await utils.modmail.lock.remove(message.author.id);
                resolve(true)
                break;
              case "timeout":
                message.channel.send(embeds.modmail.timeout35())
                await utils.modmail.lock.remove(message.author.id);
                resolve(true)
                break;
            }
          } else {
            resolve(false)
          }
        });
  });
};
