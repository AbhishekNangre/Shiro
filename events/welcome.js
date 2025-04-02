const { Events, EmbedBuilder } = require("discord.js");

module.exports = {
	name: Events.GuildMemberAdd,
	execute(member) {
		const channelId = process.env.WELCOME_CHANNEL_ID;
		if (!channelId) {
			console.warn("⚠️ No welcome channel ID found in environment variables.");
			return;
		}

		const channel = member.guild.channels.cache.get(channelId);
		if (!channel) {
			console.warn(`⚠️ Cannot find the welcome channel with ID: ${channelId}`);
			return;
		}

		const totalMembers = member.guild.memberCount;

		const welcomeEmbed = new EmbedBuilder()
			.setTitle(` Welcome to ${member.guild.name}, ${member.user.username}!`)
			.setDescription(
				`Please read the <#777822948164894730> <#1323031124041273378>to get an understanding of our server.

                > Head over to [#Channels & Roles](https://discord.com/channels/677453601668333588/customize-community) to customize your experience and access exclusive channels.`
			)

			.setColor(0x3498db)
			.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
			.setImage("https://i.imgur.com/uAX4uPv.jpeg")
			.setFooter({
				text: `You are #${totalMembers} member!, enjoy your stay here`,
				iconURL: member.guild.iconURL(),
			})
			.setTimestamp();

		channel
			.send({
				content: ` Welcome <@${member.id}>, thanks for joining!`,
				embeds: [welcomeEmbed],
			})
			.catch(console.error);
	},
};
