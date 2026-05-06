const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  MessageFlags
} = require("discord.js");
const Guild = require("../../models/guild");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("設置歡迎身分組")
    .setDescription("設置一個給新成員的身分組")
    .addRoleOption(option =>
      option
        .setName("身分組")
        .setDescription("選擇一個給新成員的身分組")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),

  async execute(interaction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const { options, member } = interaction;

    if (interaction.guild.ownerId !== member.id) {
      await interaction.editReply("只有伺服器主人可以使用此指令");
      return;
    }

    const role = options.getRole("身分組");

    const [guild] = await Guild.findOrCreate({
      where: { id: interaction.guild.id }
    });

    if (!role) {
      await guild.update({ welcomeRoleId: null });
      await interaction.editReply("成功刪除歡迎身分組");
      return;
    }

    await guild.update({ welcomeRoleId: role.id });

    const embed = new EmbedBuilder()
      .setTitle("成功設置歡迎身分組")
      .setDescription(`已設置為 ${role}`)
      .setColor("Gold");

    await interaction.editReply({ embeds: [embed] });
  }
};