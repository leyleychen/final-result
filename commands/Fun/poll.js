const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");

const POLL_EMOJIS = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"];
const POLL_FOOTER = "POLL_BOT_ACTIVE";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("投票")
        .setDescription("建立一個投票")
        .addStringOption(option =>
            option
                .setName("問題")
                .setDescription("你想投票的問題")
                .setMinLength(1)
                .setMaxLength(100)
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("選項1")
                .setDescription("第一個選項")
                .setMinLength(1)
                .setMaxLength(50)
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("選項2")
                .setDescription("第二個選項")
                .setMinLength(1)
                .setMaxLength(50)
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("選項3")
                .setDescription("第三個選項")
                .setMinLength(1)
                .setMaxLength(50)
                .setRequired(false)
        )
        .addStringOption(option =>
            option
                .setName("選項4")
                .setDescription("第四個選項")
                .setMinLength(1)
                .setMaxLength(50)
                .setRequired(false)
        )
        .addStringOption(option =>
            option
                .setName("選項5")
                .setDescription("第五個選項")
                .setMinLength(1)
                .setMaxLength(50)
                .setRequired(false)
        ),

    async execute(interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const question = interaction.options.getString("問題");
        const choices = [
            interaction.options.getString("選項1"),
            interaction.options.getString("選項2"),
            interaction.options.getString("選項3"),
            interaction.options.getString("選項4"),
            interaction.options.getString("選項5"),
        ].filter(Boolean);

        if (choices.length < 2) {
            await interaction.editReply("投票至少需要 2 個選項。");
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle(`📊 ${question}`)
            .setColor(0x00AE86)
            .setDescription("請點擊下方對應的表情符號進行投票")
            .setFooter({ text: POLL_FOOTER });

        for (let i = 0; i < choices.length; i++) {
            embed.addFields({
                name: `${POLL_EMOJIS[i]} ${choices[i]}`,
                value: "‎",
                inline: false,
            });
        }

        try {
            const pollMessage = await interaction.channel.send({ embeds: [embed] });

            for (let i = 0; i < choices.length; i++) {
                await pollMessage.react(POLL_EMOJIS[i]);
            }

            await interaction.editReply(`成功創建投票。\n訊息 ID：\`${pollMessage.id}\``);
            console.log(`${interaction.user.username} 使用了 /${interaction.commandName}`);
        } catch (error) {
            console.error("建立投票失敗：", error);
            await interaction.editReply("建立投票失敗，請確認我有發送訊息與新增反應的權限。");
        }
    },
};