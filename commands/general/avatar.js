const { SlashCommandBuilder} = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("avatar")
		.setDescription("Displays the user's profile picture")
		.addUserOption((option) =>
			option
				.setName("user")
				.setDescription("Who's avatar do you want to see?")
				.setRequired(false)
		),
	async execute(interaction) {
		const user = interaction.options.getUser("user") || interaction.user;
		const avatarURL = user.displayAvatarURL({ size: 1024, dynamic: true });


		await interaction.reply({ content: `${avatarURL}` });
	},
};
