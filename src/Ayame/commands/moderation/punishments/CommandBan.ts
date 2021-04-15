module.exports = {
    name: 'ban',
    description: 'Bans a user!',
    category: 'Moderation/Punishments',
    args: true,
    guildOnly: true,
    permissions: ['BAN_MEMBERS'],
    usage: '<mention> <reason>',
    async execute(message, args) {
        let User = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0])
        if (!User) return await message.reply(`Invalid user.`)
        // Perm check for client user
        if (!message.guild.members.resolve(message.client.user).hasPermission("BAN_MEMBERS")) return await message.reply({embed: {
            embed: {
                title: `Uh oh!`,
                description: `I do not have enough permissions to ban members!`,
                color: `#FF0000`,
                footer: {
                    text: "© 2019-2021 AJ Unturned | Ayame"
                },
                timestamp: new Date()
            }
        }})
        // Check to see if the person getting banned has permissions.
        if (User.hasPermission("BAN_MEMBERS")) return await message.reply({embed: {
            title: `Error!`,
            description: `You cannot ban this user, as they have the **BAN_MEMBERS** permission!`,
            footer: {
            text: "© 2019-2021 AJ Unturned | Ayame"
        },
            color: '#FF0000',
            timestamp: new Date()
         }})
        // Checking if the banner is the user to be banned.
        if (User.id === message.author.id) return await message.reply({embed: {
            title: `Oopsie!`,
            description: `You are unable to ban yourself!`,
            footer: {
            text: "© 2019-2021 AJ Unturned | Ayame"
        },
            color: '#FF0000',
            timestamp: new Date()
         }})
        // Check to see if the person getting banned is the guild owner.
        if (User.id === message.guild.owner.id) return await message.inlineReply({embed: {
            title: `Ah! Oopsie!`,
            description: `You are not able to ban the guild owner! What are you trying to do?`,
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
                ${User}'s role is higher than yours! You are unable to ban them!
                `,
                color: `#FF0000`,
                footer: {
                    text: "© 2019-2021 AJ Unturned | Ayame"
                },
                timestamp: new Date()
            }
        })

        let banReason = args.splice(1).join(' ') + ` | Banned by ${message.author.tag}`
        if (!banReason) {
            banReason = `None | Banned by ${message.author.tag}`
        }
        await message.reply(`Are you sure you want to ban this [no gender specified]?`, {
            embed: {
                title: `${User.user.tag} (${User.id})`,
                description: `Yes/Y to finish the ban.. No/N to cancel!`,
                footer: {
                    text: `© 2019-2021 AJ Unturned | Ayame`
                },
                timestamp: new Date()
            }
        }).then(m => {
            const filter = m => m.author.id === message.author.id

            message.channel.awaitMessages(filter, { max: 1, time: 15000, errors: ['time'] })
                .then(collected => {
                    const col = collected.first().toString().toLowerCase();
                    if (col === "y" || col === "yes") {
                        try {
                            User.send({
                                embed: {
                                    title: `Uh oh!`,
                                    description: `You were **banned** from **${message.guild}** for the reason of \`${banReason}\`!`,
                                    color: '#FF0000'
                                }
                            })
                        }
                        catch (error) {
                            console.error(`Cannot send a message to ${User}\n${error}`);
                        }

                        message.channel.send(`Banned **${User.user.tag}**..`).then(async m => {
                             await User.ban({ days: 7, reason: banReason });
                             await m.edit(`Successfully banned **${User.user.tag}**`);
                        }) .catch(console.log("Failed to ban a user??"));
                    }
                    if (col === "n" || col === "no") 
                        return message.channel.send(`Sadly not banning **${User.user.tag}** :c`);
                    if (col === "cancel")
                        return message.reply(`Canceling ban for user ${User.user.tag}.`); return;
                })
                .catch(collected => {
                    message.channel.send(`Time expired, stop pushing it!`)
                })
        });
    }
}