module.exports = client => {
    console.log(`Logged in as ${client.user.tag}`);
    console.log(`The bot SHOULD be up! :D`);

    let statuses = [
        `a!help | Release ${process.env.npm_package_version}`,
        `over ${client.users.cache.size} users!`,
        `over ${client.guilds.cache.size} guilds!`
    ]
    setInterval(async function() {
        let status = statuses[Math.floor(Math.random() * statuses.length)];
        
        client.user.setActivity(status, {type: "WATCHING"});
    }, 20000);
}