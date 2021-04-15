module.exports = {
    name: 'stats',
    description: 'Displays statistics!',
    category: 'Information',
    args: false,
    guildOnly: false,
    usage: '',
    async execute(message, args) {
        let totalSeconds = (message.client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);

        const used = process.memoryUsage();
        let actualUsed = 1;
        const version = process.env.npm_package_version;
        await message.channel.send({
            embed: {
                title: `Ayame Statistics`,
                fields: [
                    { name: `Uptime`, value: `${days}d, ${hours}h, ${minutes}m, ${seconds}s`, inline: true },
                    { name: `Memory`, value: `${Math.round(used.heapTotal / 1024 / 1024)}MBs`, inline: true },
                    { name: ``, value: ``, inline: true},
                    { name: `Guilds`, value: `${message.client.guilds.cache.size}`, inline: true},
                    { name: `Channels`, value: `${message.client.channels.cache.size}`, inline: true},
                    { name: ``, value: ``, inline: true},
                    {name: `Version`, value: `${version}`, inline: true},
                    {name: `Source-Code`, value: `[Github](https://github.com/AceLikesGhosts/Ayame)`, inline: true},
                    { name: ``, value: ``, inline: true}
                ],
                footer: {
                    text: `Shard: 0/0 | Prefix: a!, @Ayame\n© 2019-2021 AJ Unturned | Ayame`
                }
            }
        });
    }
}