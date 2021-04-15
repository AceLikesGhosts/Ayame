const Discord = require('discord.js');
const fs = require('fs');

const client = new Discord.Client({
    partials: ['REACTION', 'GUILD_MEMBER', 'CHANNEL'],
    ws: { intents: ['GUILDS', 'GUILD_BANS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'DIRECT_MESSAGES'] }
});

const { prefix, token } = require('./config.json');

fs.readdir("./events/", (err, files) => // Event handler
{
  if (err) console.log(err);
  files.forEach(file => {
    const eventHandler = require(`./events/${file}`);
    const eventName = file.split(".")[0];
    client.on(eventName, (...args) => eventHandler(client, ...args));
    console.log(`Registered Event: ${eventName}`);
  })
})

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
loadCommands(client.commands, './commands');

function loadCommands(collection, directory) 
{
    const files = fs.readdirSync(directory);
    for (const file of files) {
        const path = `${directory}/${file}`;
        if (file.endsWith('.ts')) 
        {
            const registeredCommand = require(path);
            collection.set(registeredCommand.name, registeredCommand);
            if (registeredCommand.aliases == undefined) 
            {
                console.log(`Registered command ${registeredCommand.name} with no aliases.`);
            } else {
                console.log(`Registered command: ${registeredCommand.name}\nAliases: ${registeredCommand.aliases}`);
                collection.set(registeredCommand.aliases, registeredCommand);
            }
        } else if (fs.lstatSync(path).isDirectory()) 
        {
            loadCommands(collection, path);
        }
    }
}

client.on('message', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (command.guildOnly && message.channel.type == "dm") 
    {
        return await message.reply({
            embed: {
                title: `Oops!`,
                description: `Sadly, you are unable to execute this command in direct-messages.`,
                footer: {
                    text: `© 2019-2021 AJ Unturned | Ayame`
                },
                timestamp: new Date()
            }
        })
    }
    if (command.permissions) 
    {
        const authorPerms = message.channel.permissionsFor(message.author);
        if (message.channel.type !== "dm" && !authorPerms || !authorPerms.has(command.permissions)) 
        {
            return await message.reply({
                embed: {
                    title: `Permission Error.`,
                    description: `You do not have enough permissions to execute this command!\nYou need atleast the permissions of ${command.permissions}!`,
                    footer: {
                        text: `© 2019-2021 AJ Unturned | Ayame`
                    },
                    color: `FF0000`,
                    timestamp: new Date()
                }
            })
        }
    }
    if (command.args && !args.length) 
    {
        if (command.usage) {
            return await message.reply(`Invalid usage, proper command usage: ${prefix}${command.name} ${command.usage}.`);
        } else {
            return await message.reply(`Invalid usage.`);
        }
    }

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply(
            `
            There was an error trying to execute that command!
            Error: \`${error}\`.
            `)
    }
});
client.login(token);