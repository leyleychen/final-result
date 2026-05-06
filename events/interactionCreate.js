const { MessageFlags } = require("discord.js");

module.exports = {
    name: "interactionCreate",
    async execute(client, interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) {
            await interaction.reply({
                content: "Command not found!",
                flags: MessageFlags.Ephemeral,
            });
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);

            const errorReply = {
                content: "There was an error while executing this command!",
                flags: MessageFlags.Ephemeral,
            };

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(errorReply);
            } else {
                await interaction.reply(errorReply);
            }
        }
    },
};