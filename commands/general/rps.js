const {
	SlashCommandBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
} = require("discord.js");

const cooldowns = new Set();

module.exports = {
	data: new SlashCommandBuilder()
		.setName("rps")
		.setDescription("Play Rock-Paper-Scissors with the bot!")
		.addUserOption((option) =>
			option
				.setName("user")
				.setDescription("Who do you want to play against")
				.setRequired(false)
		),

	async execute(interaction) {
		const challenger = interaction.user;
		const opponent = interaction.options.getUser("user") || interaction.user;

		if (opponent.bot) {
			return interaction.reply({
				content: "You can't play against a bot!",
				ephemeral: true,
			});
		}

		if (cooldowns.has(interaction.user.id)) {
			return interaction.reply({
				content:
					"⏳ You are on cooldown! Please wait **5 seconds** before playing again.",
				ephemeral: true,
			});
		}

		cooldowns.add(interaction.user.id);

		setTimeout(() => {
			cooldowns.delete(interaction.user.id);
		}, 5000);

		if (opponent.id != challenger.id) {
			const embed = new EmbedBuilder()
				.setTitle("Rock-Paper-Scissors")
				.setDescription(
					`${challenger.username} vs ${opponent.username} !\n\nMake your choice: <:searching:911641943589662722>`
				)
				.setColor(0x3498db)
				.setFooter({
					text: `Started by ${challenger.username}`,
					iconURL: challenger.displayAvatarURL(),
				})
				.setTimestamp();

			const row = new ActionRowBuilder().addComponents(
				new ButtonBuilder()
					.setCustomId("rock")
					.setLabel("🪨 Rock")
					.setStyle(ButtonStyle.Success),
				new ButtonBuilder()
					.setCustomId("paper")
					.setLabel("📄 Paper")
					.setStyle(ButtonStyle.Success),
				new ButtonBuilder()
					.setCustomId("scissors")
					.setLabel("✂️ Scissors")
					.setStyle(ButtonStyle.Success)
			);

			const message = await interaction.reply({
				embeds: [embed],
				components: [row],
				fetchReply: true,
			});

			const choices = new Map();
			choices.set(challenger.id, null);
			choices.set(opponent.id, null);

			const filter = (i) =>
				(i.user.id === challenger.id || i.user.id === opponent.id) &&
				i.isButton();
			const collector = message.createMessageComponentCollector({
				filter,
				time: 30000,
			}); // 30 seconds to make a choice

			collector.on("collect", async (i) => {
				const user = i.user;
				const choice = i.customId;

				choices.set(user.id, choice);

				await i.reply({
					content: `You chose **${choice.toUpperCase()}**!`,
					ephemeral: true,
				});

				if (choices.get(challenger.id) && choices.get(opponent.id)) {
					collector.stop();
				}
			});

			collector.on("end", async (collected) => {
				const challengerChoice = choices.get(challenger.id);
				const opponentChoice = choices.get(opponent.id);

				if (!challengerChoice || !opponentChoice) {
					await interaction.editReply({
						content: "⏳ One or both players did not make a choice in time!",
						components: [],
					});
					return;
				}

				let result;
				if (challengerChoice === opponentChoice) {
					result = "It's a tie! <:boxxhwew:1105760749193793597>";
				} else if (
					(challengerChoice === "rock" && opponentChoice === "scissors") ||
					(challengerChoice === "paper" && opponentChoice === "rock") ||
					(challengerChoice === "scissors" && opponentChoice === "paper")
				) {
					result = `${challenger.username} wins! <:ChildeCool:917114836888985632>`;
				} else {
					result = `${opponent.username} wins! <:ChildeCool:917114836888985632>`;
				}

				const resultEmbed = new EmbedBuilder()
					.setTitle("Rock-Paper-Scissors")
					.setDescription(
						`**${
							challenger.username
						} chose:** ${challengerChoice.toUpperCase()}\n**${
							opponent.username
						} chose:** ${opponentChoice.toUpperCase()}\n\n${result}`
					)
					.setColor(0x2ecc71)
					.setFooter({
						text: `${challenger.username} vs ${opponent.username}`,
						iconURL: challenger.displayAvatarURL(),
					})
					.setTimestamp();
				await interaction.editReply({ embeds: [resultEmbed], components: [] });
			});
		} else {
			const choices = ["rock", "paper", "scissors"];

			const embed = new EmbedBuilder()
				.setTitle("Rock-Paper-Scissors")
				.setDescription("Make your choice: <:searching:911641943589662722>")
				.setColor(0x3498db)
				.setFooter({
					text: `${interaction.user.username}`,
					iconURL: interaction.user.displayAvatarURL(),
				})
				.setTimestamp();

			const row = new ActionRowBuilder().addComponents(
				new ButtonBuilder()
					.setCustomId("rock")
					.setLabel("🪨 Rock")
					.setStyle(ButtonStyle.Success),
				new ButtonBuilder()
					.setCustomId("paper")
					.setLabel("📄 Paper")
					.setStyle(ButtonStyle.Success),
				new ButtonBuilder()
					.setCustomId("scissors")
					.setLabel("✂️ Scissors")
					.setStyle(ButtonStyle.Success)
			);

			const message = await interaction.reply({
				embeds: [embed],
				components: [row],
				ephemeral: false,
			});

			const filter = (i) => i.user.id === interaction.user.id;
			const collector = message.createMessageComponentCollector({
				filter,
				time: 15000,
			});

			collector.on("collect", async (i) => {
				const userChoice = i.customId;
				const botChoice = choices[Math.floor(Math.random() * choices.length)];

				const resultEmbed = new EmbedBuilder()
					.setTitle("Rock-Paper-Scissors Result")
					.setFooter({
						text: `${interaction.user.username}`,
						iconURL: interaction.user.displayAvatarURL(),
					})
					.setTimestamp();

				if (userChoice === botChoice) {
					resultEmbed.setDescription(
						`**You Chose:** ${userChoice.toUpperCase()}\n**I Chose:** ${botChoice.toUpperCase()}\n\nIt's a tie <:boxxhwew:1105760749193793597>`
					);
					resultEmbed.setColor(0xe0ff55);
				} else if (
					(userChoice === "rock" && botChoice === "scissors") ||
					(userChoice === "paper" && botChoice === "rock") ||
					(userChoice === "scissors" && botChoice === "paper")
				) {
					resultEmbed.setDescription(
						`**You Chose:** ${userChoice.toUpperCase()}\n**I Chose:** ${botChoice.toUpperCase()}\n\nYou won! <:waa:911604071281065995>`
					);
					resultEmbed.setColor(0x6bff72);
				} else {
					resultEmbed.setDescription(
						`**You Chose:** ${userChoice.toUpperCase()}\n**I Chose:** ${botChoice.toUpperCase()}\n\nYou lost <:ChildeCool:917114836888985632>`
					);
					resultEmbed.setColor(0xff5555);
				}
				await i.update({ embeds: [resultEmbed], components: [] });
			});

			collector.on("end", async (collected) => {
				if (collected.size === 0) {
					await interaction.editReply({
						content:
							"<:ChongyunStare:917114858774880266> Make a choice next time..",
						components: [],
					});
				}
			});
		}
	},
};
