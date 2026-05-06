# Discord Bot Setup Guide

Follow these steps to create, configure, invite, and run the Discord bot.

## 1. Create a Discord Bot

Go to the Discord Developer Portal:

https://discord.com/developers/applications

Then:

1. Click **New Application**
2. Enter a name for your application
3. Click **Create**
4. Go to the **Bot** tab
5. Click **Add Bot**
6. Click **Reset Token** or **Copy Token**
7. Save the bot token for later

## 2. Invite the Bot to Your Server

In the Discord Developer Portal:

1. Go to **OAuth2**
2. Go to **URL Generator**
3. Under **Scopes**, select **bot**
4. Under **Bot Permissions**, select the permissions your bot needs
5. Copy the generated URL
6. Open the URL in your browser
7. Select your Discord server
8. Click **Authorize**

Your bot should now be added to your server.

## 3. Update `config.json`

Open the `config.json` file in this project.

Replace the token and client ID with your own bot information.

Example:

```json
{
  "token": "YOUR_BOT_TOKEN",
  "clientId": "YOUR_CLIENT_ID"
}
```

Replace:

| Value | What to put |
|---|---|
| `YOUR_BOT_TOKEN` | Your Discord bot token |
| `YOUR_CLIENT_ID` | Your Discord application client ID |

You can find the **Client ID** in the Discord Developer Portal under:

**OAuth2 > General**

Important:

Do not share your real bot token publicly.  
If you accidentally upload your real token to GitHub, reset it immediately.

## 4. Install Node Modules

Open a terminal in the project folder.

Run:

```bash
npm install
```

This will install all required `node_modules`.

## 5. Run the Bot

Start the bot by running:

```bash
node start.js
```

If everything is set up correctly, the bot should come online.

## Enjoy!

Your Discord bot is now running.
