# Ayame
A general purpose Discord bot created for AJ Unturned. licenced using the GNU 3.0 licence.

## How to set-up:
1. Download/Clone the repo.
2. Install [NodeJS](https://nodejs.org/en/download/)
3. Go into src/Ayame and change all variables in CONFIG._JSON
4. Convert CONFIG._JSON to a proper JSON file.


# Features:
## Commands

Stats:
- Displays memory used.
- Displays uptime.
- Displays how long the bot has been running.
- Displays how many cached guilds/channels there are.
- Displays what shard (0/0) the guild is on.

Bans:
- Has a required Yes/No option.
- If the user set to be banned has permissions to ban members, it cancels.
- If the user set to be banned hass a higher role than the executor, it cancels.
- If the user set to be banned is the guild owner, it cancels.
- Deletes all messages within the past week.

Kicks:
- Has a required Yes/No option.
- If the user set to be kicked has permissions to kick members, it cancels.
- If the user set to be kicked hass a higher role than the executor, it cancels.
- If the user set to be kicked is the guild owner, it cancels.
