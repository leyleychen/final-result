const fs = require('node:fs').promises;
const path = require('node:path');
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const sequelize = require("./utils/database");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

client.commands = new Collection();

async function loadCommands() {
    const commandPath = path.resolve('commands');
    const commandFolders = await fs.readdir(commandPath);

    for (const folder of commandFolders) {
        const folderPath = path.join(commandPath, folder);
        const stat = await fs.stat(folderPath);

        if (!stat.isDirectory()) continue;

        const commandFiles = await fs.readdir(folderPath);

        for (const file of commandFiles.filter(file => file.endsWith(".js"))) {
            const filePath = path.join(folderPath, file);
            const command = require(filePath);

            if (!command.data || !command.execute) {
                console.log(`略過無效指令檔案: ${filePath}`);
                continue;
            }

            client.commands.set(command.data.name, command);
            console.log(`已載入指令: ${command.data.name}`);
        }
    }
}

async function loadEvents() {
    const eventPath = path.resolve('events');
    const eventFiles = await fs.readdir(eventPath);

    for (const file of eventFiles.filter(file => file.endsWith(".js"))) {
        const event = require(path.join(eventPath, file));
        if (event.once) {
            client.once(event.name, (...args) => event.execute(client, ...args));
        } else {
            client.on(event.name, (...args) => event.execute(client, ...args));
        }
    }
}

async function startBot() {
    let config;
    try {
        const configPath = path.resolve('config.json');
        const configContent = await fs.readFile(configPath, 'utf8');
        config = JSON.parse(configContent);
    } catch (err) {
        console.error('Failed to read config.json:', err);
        process.exit(1);
    }

    const { token } = config;
    if (!token) {
        console.error('Token is missing in config.json');
        process.exit(1);
    }

    await loadCommands();
    await loadEvents();

    await sequelize.sync();
    console.log("資料表同步完成");
    
    await client.login(token);
    console.log('Bot is running!');
}

startBot().catch(console.error);