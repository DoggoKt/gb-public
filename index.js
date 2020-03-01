async function main() {
// Connect to MongoDB (Hosted on mlab.com)
require('./lib/db.js');

    const modmail = require('./lib/modmail.js');

    const Discord = require('discord.js');
    const bot = new Discord.Client();
    const fs = require('fs');

    const confModel = require('./lib/models.js').config;
    const {prefix, token} = await confModel.findOne({});

    bot.commands = new Discord.Collection;

    fs.readdir("./commands/", (err, files) => {

        if (err) {
            console.log(err);
            return;
        }
        let jsFile = files.filter(f => f.split(".").pop() === "js");

        jsFile.forEach((f) => {
            let props = require(`./commands/${f}`);
            console.log(`${f.split('.')[0]} command loaded!`);
            bot.commands.set(props.command.name, props);
        });
    });


    bot.on('message', async (message) => {
        // Make sure it doesn't react to bot's messages
        if (message.author.bot) return;
        // Checking to call modmail.js to handle the ModMail part
        const handled = await modmail.handler(message, bot);
        if (handled) return;
        // Make sure the command starts with the prefix
        if (!(message.content.startsWith(prefix))) return;
        // Get the command and arguments from the message
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const cmd = args.shift().toLowerCase();

        bot.commands.forEach(function (f) {
            if (f.command.name !== cmd.toLowerCase()) return;
            const command = require('./commands/' + cmd);
            command.command.run(message, args, bot);
        });
    });

    await bot.login(token);
}

main().then();
