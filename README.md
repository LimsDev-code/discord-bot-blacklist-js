# Discord Blacklist Bot

A Discord bot that allows server administrators to manage a blacklist of users. The bot can ban blacklisted users from all servers it is in and unban them when removed from the blacklist.

## Features

- **Blacklist Command** — Add a user to the blacklist and ban them from all servers.
- **Unblacklist Command** — Remove a user from the blacklist and unban them from all servers.
- **Automatic Ban** — Automatically bans blacklisted users who join a server.
- **Persistent Blacklist** — Stored in a JSON file for persistence across restarts.

## Prerequisites

- [Node.js](https://nodejs.org/) v16.11 or higher
- A Discord bot token (create one at the [Discord Developer Portal](https://discord.com/developers/applications))

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/LimsDev-code/discord-blacklist-bot.git
   cd discord-blacklist-bot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Replace `'Your Bot Token Here'` in `bot.js` with your actual bot token.

4. Start the bot:
   ```bash
   npm start
   ```

## Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `/blacklist` | Blacklist a member and ban them from all servers | `/blacklist <member>` |
| `/unblacklist` | Remove a member from the blacklist and unban them from all servers | `/unblacklist <member>` |

## Notes

- The bot requires the **Ban Members** permission in all servers it is added to.
- The bot must be invited with the `bot` and `applications.commands` OAuth2 scopes.

## Disclaimer

Use this bot responsibly. Ensure you comply with Discord's Terms of Service and Community Guidelines.
