const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('Create a custom embed using a modal form'),
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('embedModal')
            .setTitle('Create Embed');

        const titleInput = new TextInputBuilder()
            .setCustomId('embedTitle')
            .setLabel('Embed Title')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const bodyInput = new TextInputBuilder()
            .setCustomId('embedBody')
            .setLabel('Embed Body')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        const imageThumbnailInput = new TextInputBuilder()
            .setCustomId('embedImages')
            .setLabel('Main Image & Thumbnail (Comma Separated)')
            .setStyle(TextInputStyle.Short)
            .setRequired(false);

        const footerInput = new TextInputBuilder()
            .setCustomId('embedFooter')
            .setLabel('Footer Text (Optional)')
            .setStyle(TextInputStyle.Short)
            .setRequired(false);

        const colorInput = new TextInputBuilder()
            .setCustomId('embedColor')
            .setLabel('Embed Color (Name or Hex) - Optional')
            .setStyle(TextInputStyle.Short)
            .setRequired(false);

        modal.addComponents(
            new ActionRowBuilder().addComponents(titleInput),
            new ActionRowBuilder().addComponents(bodyInput),
            new ActionRowBuilder().addComponents(imageThumbnailInput),
            new ActionRowBuilder().addComponents(footerInput),
            new ActionRowBuilder().addComponents(colorInput) 
        );

        await interaction.showModal(modal);
    }
};
