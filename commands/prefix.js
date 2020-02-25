module.exports.command = {
  "name": "prefix",
  "description": "Changes the bot's prefix to the new one provided.",
  "run": async (message, args, bot) => {
      return message.channel.send("Command has been disabled."); // Not meant for this bot. Preserving to be used later.
      const Discord = require('discord.js');
      const mongoose = require('mongoose');
      const db = require('../lib/db.js');
      const configModel = require('../lib/configModel.js');

      if (args.length !== 1) return message.channel.send("Incorrect number of arguments. Please pass along only the new prefix (no spaces allowed).")
      const prefix = args[0];

      let config = new configModel({
          prefix: prefix,
          token: "NTMzNjM4NDQwMDgwNjM3OTUz.Xd2G8A.gNe1jdnJpRzvdmJWbMKQPr1Xy-k"
      });
      
      await configModel.deleteMany({});
      await config.save(function (err, config) {
          message.channel.send(`Prefix successfuly changed to \`${config.prefix}\`!`);
      });

  },
};
