const { Events, EmbedBuilder, resolveColor } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isModalSubmit()) {
            if (interaction.customId === 'embedModal') {
                const title = interaction.fields.getTextInputValue('embedTitle');
                const body = interaction.fields.getTextInputValue('embedBody');
                const imagesInput = interaction.fields.getTextInputValue('embedImages') || '';
                const footer = interaction.fields.getTextInputValue('embedFooter') || null;
                const colorInput = interaction.fields.getTextInputValue('embedColor') || null;

                let embedColor = 'Random'; 
                if (colorInput) {
                    try {
                        embedColor = resolveColor(colorInput);
                    } catch (error) {
                        embedColor = 'Random';
                    }
                }

                let embed = new EmbedBuilder()
                    .setTitle(title)
                    .setDescription(body)
                    .setColor(embedColor);

                
                const imageUrls = imagesInput.split(',').map(url => url.trim());
                if (imageUrls[0]) embed.setImage(imageUrls[0]); 
                if (imageUrls[1]) embed.setThumbnail(imageUrls[1]);

                if (footer) embed.setFooter({ text: footer });

                try {
                    await interaction.channel.send({ embeds: [embed] }); 
                    await interaction.deferReply({ ephemeral: true });
                    await interaction.deleteReply(); 
                } catch (error) {
                    console.error('Failed to send embed:', error);
                    await interaction.reply({ content: '❌ An error occurred while sending the embed.', ephemeral: true });
                }
            }
            return;
        }

        if (interaction.isChatInputCommand()) {
            const command = global.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(`❌ Error executing command: ${interaction.commandName}`, error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({
                        content: "There was an error executing this command!",
                        ephemeral: true,
                    });
                } else {
                    await interaction.reply({
                        content: "There was an error executing this command!",
                        ephemeral: true,
                    });
                }
            }
        }
    },
};
