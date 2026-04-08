const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const BLACKLIST_FILE = path.join(__dirname, 'blacklist.json');

// Load/save blacklist
function loadBlacklist() {
    if (fs.existsSync(BLACKLIST_FILE)) {
        return JSON.parse(fs.readFileSync(BLACKLIST_FILE, 'utf-8'));
    }
    return [];
}

function saveBlacklist(blacklist) {
    fs.writeFileSync(BLACKLIST_FILE, JSON.stringify(blacklist, null, 4));
}

let blacklist = loadBlacklist();

// Initialize client
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

// Register slash commands
const commands = [
    new SlashCommandBuilder()
        .setName('blacklist')
        .setDescription('Blacklist a member and ban them from all servers')
        .addUserOption(option =>
            option.setName('member').setDescription('The member to blacklist').setRequired(true)
        ),
    new SlashCommandBuilder()
        .setName('unblacklist')
        .setDescription('Remove a member from the blacklist and unban them from all servers')
        .addUserOption(option =>
            option.setName('member').setDescription('The member to remove from the blacklist').setRequired(true)
        ),
];

client.once('ready', async () => {
    const rest = new REST().setToken(client.token);
    await rest.put(Routes.applicationCommands(client.user.id), {
        body: commands.map(c => c.toJSON()),
    });
    console.log(`Bot connected as ${client.user.tag}`);
});

// Handle slash commands
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'blacklist') {
        const user = interaction.options.getUser('member');

        if (blacklist.includes(user.id)) {
            return interaction.reply({ content: `${user} is already blacklisted.`, ephemeral: true });
        }

        blacklist.push(user.id);
        saveBlacklist(blacklist);

        const errors = [];
        for (const guild of client.guilds.cache.values()) {
            try {
                await guild.bans.create(user.id, { reason: 'Blacklisted' });
            } catch (err) {
                errors.push(`Unable to ban ${user.tag} in ${guild.name}: ${err.message}`);
            }
        }

        let reply = `${user} has been blacklisted and banned from all servers.`;
        if (errors.length) reply += `\n${errors.join('\n')}`;
        await interaction.reply({ content: reply, ephemeral: true });
    }

    if (commandName === 'unblacklist') {
        const user = interaction.options.getUser('member');

        if (!blacklist.includes(user.id)) {
            return interaction.reply({ content: `${user} is not in the blacklist.`, ephemeral: true });
        }

        blacklist = blacklist.filter(id => id !== user.id);
        saveBlacklist(blacklist);

        const errors = [];
        for (const guild of client.guilds.cache.values()) {
            try {
                await guild.bans.remove(user.id, 'Unblacklisted');
            } catch (err) {
                errors.push(`Unable to unban ${user.tag} in ${guild.name}: ${err.message}`);
            }
        }

        let reply = `${user} has been removed from the blacklist and unbanned from all servers.`;
        if (errors.length) reply += `\n${errors.join('\n')}`;
        await interaction.reply({ content: reply, ephemeral: true });
    }
});

// Auto-ban blacklisted members on join
client.on('guildMemberAdd', async member => {
    if (blacklist.includes(member.id)) {
        try {
            await member.ban({ reason: 'Blacklisted' });
        } catch (err) {
            console.error(`Unable to ban ${member.user.tag} in ${member.guild.name}: ${err.message}`);
        }
    }
});

// Run the bot
client.login('Your Bot Token Here');
