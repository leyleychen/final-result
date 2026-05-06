const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    MessageFlags
} = require("discord.js");
const infraction = require("../../models/infraction");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("警告")
        .setDescription("選擇一個你要警告的對象")
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .setDMPermission(false)
        .addUserOption(option =>
            option
                .setName("用戶")
                .setDescription("要警告的對象")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("原因")
                .setDescription("警告的原因")
                .setRequired(false)
                .setMinLength(1)
                .setMaxLength(255)
        ),

    async execute(interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const { options, member, guild } = interaction;

        const targetUser = options.getUser("用戶");
        const reason = options.getString("原因") || "沒有提供原因";

        if (!targetUser) {
            await interaction.editReply("找不到要警告的用戶。");
            return;
        }

        const targetMember = await guild.members.fetch(targetUser.id).catch(() => null);

        if (!targetMember) {
            await interaction.editReply("該成員不在此伺服器中。");
            return;
        }

        await infraction.create({
            userId: targetUser.id,
            guildId: guild.id,
            reason: reason,
            type: "Warn",
            enforcerId: member.id
        });

        const embed = new EmbedBuilder()
            .setTitle("⚠️ 成員警告成功")
            .setColor("Red")
            .addFields(
                { name: "被警告對象", value: `${targetUser}`, inline: true },
                { name: "執行者", value: `${interaction.user}`, inline: true },
                { name: "原因", value: reason, inline: false }
            )
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    }
};