module.exports.command = {
    "name": "update",
    "description": "Notifies of an update pushed. Usable by d0gg3r#1185 only.",
    "run": async (message, args, bot) => {
        const Discord = require('discord.js');
        const testChannel = bot.guilds.get("533508016566435840").channels.get("533552516538040320");
        const updatesChannel = bot.guilds.get("533508016566435840").channels.get("652215907258597376");

        if (message.author.id !== "460318444487704597") return testChannel.send("Only <@460318444487704597> can push bot updates. Nice try though.");
        if (args.length < 4) return testChannel.send("<@460318444487704597>, you kind of forgot that your command should have atleast 4 arguments, didn't you?");

        let target = args[0].toLowerCase();
            if (!args[0].toLowerCase() === "staff" || args[0].toLowerCase() === "public") target = "all";
        const ping = (args[1].toLowerCase() === "true");
        const version = args[2].toLowerCase();
        const added = args[3].split(";");
        if (args.length === 5) {
            const removed = args[4].split(";");
        } else {
            const removed = false;
        }



    }
};