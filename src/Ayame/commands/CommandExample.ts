module.exports = {
    name: 'example',
    description: 'This is an example command.',
    category: 'Examples',
    args: false,
    guildOnly: false,
    permissions: ['ADMINISTATOR'],
    usage: '<yes/no>',
    async execute(message, args) 
    {
        const messageSent = await message.reply(`Waiting for messages! Y/N`);
        const filter = m => m.author.id === message.author.id
        await message.channel.awaitMessages(filter, {max: 1, time: 15000, errors: ['time']})
            .then(async collected => {
                const col = collected.first().toString().toLowerCase();

                switch(col)
                {
                    case `yes`: case `y`:
                        {
                            messageSent.edit(`${col} | ${message.author.tag}`);
                            return await message.reply(`Yes.`);
                        }
                    case `no`: case `n`:
                        {
                            messageSent.edit(`${col} | ${message.author.tag}`);
                            return await message.reply(`No.`);
                        }
                    default: 
                    {
                        messageSent.edit(`${col} | ${message.author.tag}`);
                        return await message.reply(`Terminated | You have entered an invalid args.`);
                    }
                }
            })
    }
}