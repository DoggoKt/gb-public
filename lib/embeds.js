const Discord = require('discord.js');


function modmailConfirmationEmbed(message){
      const embed = new Discord.MessageEmbed()
       .setAuthor("Confirmation")
       .setColor("#fc6200")
       .setTitle("What kind is your problem of?")
       .setDescription(message.content)
       .addBlankField(false)
       .addField(":regional_indicator_a: General help", "Get help with whatever, or just talk around with the staff.", true)
       .addField(":regional_indicator_b: Report a user", "Saw someone break the rules? Report anything bad!", true)
       //.addField(":regional_indicator_c: Make a suggestion", "Know anything we could improve? Share it with us!", true)
       .addBlankField(false)
       .addField(":x: ***Cancel***", "\u200B", false)
       .setFooter("Upon choosing, the text will be submitted to the Admin team to be answered upon.")
       .setTimestamp();
       if (message.attachments.size === 1){
         embed.setImage(message.attachments.first().url)
       }
       return embed;
}
function modmailTimeout35Embed(){
      const embed = new Discord.MessageEmbed()
       .setTitle("**Prompt Cancelled**")
       .setDescription("You have failed to react in 35 seconds.")
       .setColor("#fc0006")
       .setTimestamp();
       return embed;
}
function modmailCancelEmbed(){
      const embed = new Discord.MessageEmbed()
       .setTitle("**Prompt Cancelled**")
       .setDescription("You have cancelled the prompt.")
       .setColor("#fc0006")
       .setTimestamp();
       return embed;
}
function modmailDeliveredToStaffEmbed(message){
      const author = new Discord.MessageAttachment('./res/message_delivered.png', 'message_delivered.png')
      const embed = new Discord.MessageEmbed()
      .setAuthor("Message Sent!", 'attachment://message_delivered.png')
      .setDescription(message.content)
      .setColor("#36393F")
      .setFooter("Your message has been sent successfuly.")
      .attachFiles(author);
      if (message.attachments.size === 1){
        embed.setImage(message.attachments.first().url)
      }
      return embed;
}
function modmailDeliveredToUserEmbed(message, shortcut){
      const embed = new Discord.MessageEmbed()
      .setAuthor(message.author.username, message.author.displayAvatarURL())
      if (shortcut){
      embed.setDescription(message.content.slice(3))
      } else {
      embed.setDescription(message.content.slice(7))
      }
      embed.setColor("#36393F")
      embed.setFooter("Your message has been sent successfuly.")
      if (message.attachments.size === 1){
        embed.setImage(message.attachments.first().url)
      }
      return embed;
}
function modmailReceivedFromUserEmbed(message){
      const embed = new Discord.MessageEmbed()
      .setAuthor("Message Received!", message.author.displayAvatarURL())
      .setDescription(message.content)
      .setColor("#36393F");
      if (message.attachments.size === 1){
        embed.setImage(message.attachments.first().url)
      }
      return embed;
}
function modmailReceivedFromStaffEmbed(message, shortcut){
      const embed = new Discord.MessageEmbed()
      .setColor("#36393F")
      .setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.displayAvatarURL())
      if (shortcut){
      embed.setDescription(message.content.slice(3))
      } else {
      embed.setDescription(message.content.slice(7))
      }
      if (message.attachments.size === 1){
        embed.setImage(message.attachments.first().url)
      }
      return embed;
}
function modmailChannelNotFoundEmbed(){
      const embed = new Discord.MessageEmbed()
      .setAuthor("Error occured!")
      .setTitle("Channel not found!")
      .setDescription("The channel for your ticket was most probably deleted by an admin. Please open a new ticket.")
      .setColor("#fc0006")
      .setTimestamp();
      return embed;
}
function modmailTooManyAttachmentsEmbed(){
      const embed = new Discord.MessageEmbed()
      .setAuthor("Error occured!")
      .setTitle("Too many attachments!")
      .setDescription("You can only send **one** image/file per message.")
      .setColor("#fc0006")
      .setTimestamp();
      return embed;
}
function modmailTicketCreatedSuccessEmbed(){
      const thumbnail = new Discord.MessageAttachment('./res/gb_logo.png', 'gb_logo.png');
      const embed = new Discord.MessageEmbed()
      .setAuthor("Success")
      .setColor("#000000")
      .setTitle("**You have successfuly opened a ticket in the Glorious Believer server.**")
      .setDescription("A staff member from the server will reply as soon as possible. Hang tight.")
      .addField("\u200b", "Send anything you want to be forwarded to the admin team. Images/files **are** supported.")
      .attachFiles(thumbnail)
      .setThumbnail('attachment://gb_logo.png')
      .setTimestamp()
      .setFooter("Use `>close [reason]` to close the ticket, ending the communication.");
      return embed;
}
function modmailTicketCreatedInfoEmbed(message, inquiryType){
      const thumbnail = new Discord.MessageAttachment('./res/modmail.png', 'modmail.png');
      const embed = new Discord.MessageEmbed()
      .attachFiles(thumbnail)
      .setAuthor(message.author.username, message.author.displayAvatarURL())
      .setTitle("New ticket opened!")
      .setColor("#09b6ff")
      .setDescription("\u200b")
      .addField("Username", `${message.author.username}#${message.author.discriminator}`, true)
      .addField("User ID", message.author.id, true)
      .addField("Inquiry type", inquiryType, true)
      .addField("**Message**", message.content, false)
      .setTimestamp()
      .setFooter("Type >reply <message> or >close [reason] respectively")
      .setThumbnail('attachment://modmail.png');
      return embed;
}
function modmailStaffClosedTicketSuccessEmbed(message){
      const embed = new Discord.MessageEmbed()
      .setAuthor(message.author.username, message.author.displayAvatarURL())
      .setTitle("Ticket closed!")
      .setDescription("You have closed the ticket. User has been informed.")
      .setColor("#08a300")
      .setTimestamp()
      .setFooter("React accordingly to delete or reopen the ticket.");
      return embed;
}
function modmailStaffClosedUserInfoEmbed(message, reason){
      const embed = new Discord.MessageEmbed()
      .setTitle("Ticket closed!")
      .setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.displayAvatarURL())
      .setDescription("The staff have closed your ticket. Reply again, to reopen the ticket or create a new one.")
      .setColor("#fc0006")
      .addField("**Reason**", reason, false)
      .setTimestamp();
      return embed;
}
function modmailUserClosedTicketSuccessEmbed(){
      const embed = new Discord.MessageEmbed()
        .setTitle("Ticket closed!")
        .setDescription("You have closed the ticket. Staff have been informed. You are free to create a new ticket.")
        .setColor("#08a300")
        .setTimestamp();
        return embed;
}
function modmailUserClosedStaffInfoEmbed(message, reason){
      const embed = new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.displayAvatarURL())
        .setTitle("Ticket closed!")
        .setDescription("The user has closed the ticket.")
        .setColor("#fc0006")
        .setTimestamp()
        .setFooter("Channel will be deleted or archived upon reaction.")
        .addField("Reason", reason, false)
        .addBlankField(false)
        .addField("🗑️ Delete ticket", "This channel will be gone forever. You won't be able to re-open it later.", true)
        .addField("📤 Re-open ticket", "Open the ticket again, leaving the chat history un-touched.", true);
        return embed;
}
function modmailStaffReopenedTicketSuccessEmbed(message){
      const thumbnail = new Discord.MessageAttachment('./res/modmail.png', 'modmail.png');
      const embed = new Discord.MessageEmbed()
      .attachFiles(thumbnail)
      .setAuthor(message.author.username, message.author.displayAvatarURL())
      .setTitle("Ticket Re-Opened!")
      .setColor("#00ccff")
      .setDescription("You have re-opened the ticket! User has been informed.")
      .setTimestamp()
      .setFooter("Type >reply <message> or >close [reason] respectively")
      .setThumbnail('attachment://modmail.png');
      return embed;
}
function modmailStaffReopenedTicketInfoEmbed(message){
      const thumbnail = new Discord.MessageAttachment('./res/gb_logo.png', 'gb_logo.png');
      const embed = new Discord.MessageEmbed()
      .attachFiles(thumbnail)
      .setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.displayAvatarURL())
      .setTitle("Ticket Re-Opened!")
      .setColor("#028c00")
      .setDescription("The ticket has been re-opened by staff! Conversation may progress further.")
      .setTimestamp()
      .setThumbnail('attachment://gb_logo.png')
      .setFooter("Type >close [reason] to close the ticket again.");
      return embed;
}
function modmailUserReopenedTicketSuccessEmbed(){
      const embed = new Discord.MessageEmbed()
      .setTitle("Ticket Re-opened!")
      .setDescription("Your ticket has been re-opened. Feel free to continue in your previous conversation.")
      .setColor("#028c00")
      .setTimestamp();
      return embed;
}
function modmailUserReopenedTicketInfoEmbed(message){
      const thumbnail = new Discord.MessageAttachment('./res/modmail.png', 'modmail.png');
      const embed = new Discord.MessageEmbed()
      .attachFiles(thumbnail)
      .setAuthor(message.author.username, message.author.displayAvatarURL())
      .setTitle("Ticket Re-Opened!")
      .setColor("#028c00")
      .setDescription("The ticket has been re-opened by the user!")
      .setTimestamp()
      .setThumbnail('attachment://modmail.png');
      return embed;
}

module.exports = {
  modmail: {
    confirmation: modmailConfirmationEmbed,
    timeout35: modmailTimeout35Embed,
    cancelled: modmailCancelEmbed,
    deliveredToStaff: modmailDeliveredToStaffEmbed,
    deliveredToUser: modmailDeliveredToUserEmbed,
    receivedFromUser: modmailReceivedFromUserEmbed,
    receivedFromStaff: modmailReceivedFromStaffEmbed,
    noChannel: modmailChannelNotFoundEmbed,
    attachmentLimit: modmailTooManyAttachmentsEmbed,
    createSuccess: modmailTicketCreatedSuccessEmbed,
    createInfo: modmailTicketCreatedInfoEmbed,
    staffClosedSuccess: modmailStaffClosedTicketSuccessEmbed,
    staffClosedInfo: modmailStaffClosedUserInfoEmbed,
    userClosedSuccess: modmailUserClosedTicketSuccessEmbed,
    userClosedInfo:modmailUserClosedStaffInfoEmbed,
    staffReopenedSuccess: modmailStaffReopenedTicketSuccessEmbed,
    staffReopenedInfo: modmailStaffReopenedTicketInfoEmbed,
    userReopenedSuccess: modmailUserReopenedTicketSuccessEmbed,
    userReopenedInfo: modmailUserReopenedTicketInfoEmbed
  }
}
