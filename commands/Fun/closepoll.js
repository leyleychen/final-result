const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");

const POLL_EMOJIS = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"];
const POLL_FOOTER = "POLL_BOT_ACTIVE";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("結束投票")
        .setDescription("結算投票結果並顯示結果")
        .addStringOption(option =>
            option
                .setName("message_id")
                .setDescription("投票訊息的 ID")
                .setRequired(true)
        ),

    async execute(interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const messageId = interaction.options.getString("message_id");

        try {
            const pollMessage = await interaction.channel.messages.fetch(messageId);

            if (!pollMessage) {
                await interaction.editReply("找不到這則訊息。");
                return;
            }

            if (pollMessage.embeds.length === 0) {
                await interaction.editReply("這不是投票訊息。");
                return;
            }

            const pollEmbed = pollMessage.embeds[0];

            if (!pollEmbed.footer || pollEmbed.footer.text !== POLL_FOOTER) {
                await interaction.editReply("這不是由 bot 建立的有效投票訊息。");
                return;
            }

            const question = pollEmbed.title || "未命名投票";
            const optionFields = pollEmbed.fields || [];

            if (optionFields.length === 0) {
                await interaction.editReply("這則投票訊息沒有可統計的選項。");
                return;
            }

            await pollMessage.fetch();

            const results = [];
            let maxVotes = -1;

            for (let i = 0; i < optionFields.length; i++) {
                const emoji = POLL_EMOJIS[i];
                const reaction = pollMessage.reactions.cache.get(emoji);
                const voteCount = reaction ? Math.max(reaction.count - 1, 0) : 0;

                results.push({
                    emoji,
                    optionName: optionFields[i].name.replace(`${emoji} `, ""),
                    votes: voteCount,
                });

                if (voteCount > maxVotes) {
                    maxVotes = voteCount;
                }
            }

            const winners = results.filter(result => result.votes === maxVotes && maxVotes > 0);

            const resultEmbed = new EmbedBuilder()
                .setTitle(`📊 投票結果`)
                .setColor(0x57F287)
                .addFields({
                    name: "問題",
                    value: question.replace(/^📊\s*/, ""),
                });

            for (const result of results) {
                resultEmbed.addFields({
                    name: `${result.emoji} ${result.optionName}`,
                    value: `票數：${result.votes}`,
                    inline: false,
                });
            }

            if (maxVotes <= 0) {
                resultEmbed.addFields({
                    name: "結果",
                    value: "沒有人投票。",
                });
            } else if (winners.length === 1) {
                resultEmbed.addFields({
                    name: "結果",
                    value: `🏆 勝出選項：${winners[0].emoji} ${winners[0].optionName}（${winners[0].votes} 票）`,
                });
            } else {
                resultEmbed.addFields({
                    name: "結果",
                    value: `🤝 平手：${winners.map(w => `${w.emoji} ${w.optionName}`).join("、")}`,
                });
            }

            await interaction.channel.send({ embeds: [resultEmbed] });
            await interaction.editReply("投票結算完成。");
        } catch (error) {
            console.error("結束投票失敗：", error);
            await interaction.editReply("無法找到指定的投票訊息，請確認訊息 ID 是否正確，而且訊息就在目前頻道。");
        }
    },
};