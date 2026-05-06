const Guild = require("../models/guild");

module.exports = {
    name: "guildMemberAdd",
    async execute(client, member) {
        try {
            const db = await Guild.findOne({
                where: { id: member.guild.id }
            });

            if (!db) return;

            if (db.welcomeRoleId) {
                const welcomeRole = await member.guild.roles.fetch(db.welcomeRoleId).catch(() => null);

                if (!welcomeRole) {
                    console.log("找不到歡迎身分組，可能已被刪除");
                } else {
                    const botMember = await member.guild.members.fetchMe();

                    if (!botMember.permissions.has("ManageRoles")) {
                        console.log("Bot 缺少 Manage Roles 權限");
                    } else if (welcomeRole.position >= botMember.roles.highest.position) {
                        console.log(`無法指派身分組 ${welcomeRole.name}：該角色高於或等於 bot 的最高角色`);
                    } else {
                        await member.roles.add(welcomeRole);
                        console.log(`已為 ${member.user.tag} 新增身分組 ${welcomeRole.name}`);
                    }
                }
            }

            if (db.welcomeChannelId) {
                const welcomeChannel = await member.guild.channels.fetch(db.welcomeChannelId).catch(() => null);

                if (!welcomeChannel) {
                    console.log("找不到歡迎頻道，可能已被刪除");
                    return;
                }

                await welcomeChannel.send(`Welcome to the server ${member.user}!`);
            }
        } catch (error) {
            console.error("guildMemberAdd 執行失敗：", error);
        }
    }
};