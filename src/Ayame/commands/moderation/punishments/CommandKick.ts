const config = require('../../../config.json');

module.exports = {
    name: 'kick',
    description: 'Kicks a user!',
    args: true,
    permissions: [ "KICK_MEMBERS" ],
    category: 'Moderation/Punishments',
    guildOnly: true,
    usage: '<ping> <reason>',
    async execute(message, args) {
        let User = await message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0])
        if (!User) return await message.channel.send(`User is: ${User} | ${args[0]}`)
        if (!message.guild.members.resolve(message.client.user).hasPermission("KICK_MEMBERS")) return await message.reply({embed: {
            embed: {
                title: `Uh oh!`,
                description: `I do not have enough permissions to kick members!`,
                color: `#FF0000`,
                footer: {
                    text: "© 2019-2021 AJ Unturned | Ayame"
                },
                timestamp: new Date()
            }
        }})
        // Check to see if the person getting kicked has permissions.
        if (User.hasPermission("KICK_MEMBERS")) return await message.reply({embed: {
            title: `Error!`,
            description: `You cannot kick this user, as they have the **KICK_MEMBERS** permission!`,
            footer: {
            text: "© 2019-2021 AJ Unturned | Ayame"
        },
            color: '#FF0000',
            timestamp: new Date()
         }})
        // Checking if the banner is the user to be kicked.
        if (User.id === message.author.id) return await message.reply({embed: {
            title: `Oopsie!`,
            description: `You cannot kick yourself! Baka!`,
            footer: {
            text: "© 2019-2021 AJ Unturned | Ayame"
        },
            color: '#FF0000',
            timestamp: new Date()
         }})
        // Check to see if the person getting kicked is the guild owner.
        if (User.id === message.guild.owner.id) return await message.reply({embed: {
            title: `Ah! Oopsie!`,
            description: `You are not able to kick the guild owner! What are you trying to do?`,
            text: "© 2019-2021 AJ Unturned | Ayame"
        },
            color: '#FF0000',
            timestamp: new Date()
         })
        // Check to see if the user's role is above the executor's.
        if (User.roles.highest.position > message.guild.members.resolve(message.author.id).roles.highest.position) return await message.reply({
            embed: {
                title: `Uh oh!`,
                description: `
                ${User}'s role is higher than yours! You are unable to kick them!
                `,
                color: `#FF0000`,
                footer: {
                    text: "© 2019-2021 AJ Unturned | Ayame"
                },
                timestamp: new Date()
            }
        })

        let banReason = args.splice(1).join(' ') 
        + ` | Kicked by ${message.author.tag}`
        if (!banReason) {
            banReason = `None | Kicked by ${message.author.tag}`
        }
        await message.channel.send(`Are you sure you want to kick this [no gender specified]?`, {embed: {
            title: `${User.user.tag} (${User.id})`,
            description: `Yes/Y to finish the kick.. No/N to cancel!`,
            footer: {
                text: `©️ 2019-2021 Gatekeeper`
            },
            timestamp: new Date()
        }}).then(async m => {
            const filter = m => m.author.id === message.author.id

            await message.channel.awaitMessages(filter, {max: 1, time: 15000, errors: ['time']})
            .then(async collected => {
                const col = collected.first().toString().toLowerCase();
                if (col === "y" || col === "yes")
                {
                    try {
                        await User.send({embed: {
                            title: `Uh oh!`,
                            description: `You were **kicked** from **${message.guild}** for the reason of \`${banReason}\`!\nYou can rejoin this guild [here](${config.permInvite}).`,
                            color: '#FF0000'
                        }})
                    }
                    catch(error) {
                         console.error(`Cannot send a message to ${User}\n${error}`);
                    }

                    message.channel.send(`Kicking **${User.user.tag}**..`).then(async m => {
                        await User.kick({reason: banReason});
                        await m.edit(`Successfully kicked **${User.user.tag}**`);
                    });
                }
                if (col === "n" || col === "no")
                    return message.channel.send(`Sadly not kicking **${User.user.tag}** :c`);
                if (col === "cancel")
                    return message.reply(`Canceling kick for **${User.user.tag}**.`)
            })
            .catch(collected => {
                message.channel.send(`Time expired, stop pushing it!`);
            })
        });
    }
}