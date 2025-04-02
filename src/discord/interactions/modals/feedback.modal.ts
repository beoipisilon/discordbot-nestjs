import { ModalBuilder, ModalSubmitInteraction, TextInputBuilder, TextInputStyle, ActionRowBuilder } from 'discord.js';
import { ModalInteraction } from '../interfaces/modal.interface';

export class FeedbackModal implements ModalInteraction {
  customId = 'feedback_modal';

  async execute(interaction: ModalSubmitInteraction): Promise<void> {
    try {
      const feedback = interaction.fields.getTextInputValue('feedback_input');
      
      if (!feedback || feedback.trim().length === 0) {
        await interaction.reply({ 
          content: 'O feedback não pode estar vazio. Por favor, tente novamente.',
          ephemeral: true 
        });
        return;
      }

      await interaction.reply({ 
        content: `✅ Obrigado pelo seu feedback!\n\n${feedback}`, 
        ephemeral: true 
      });
    } catch (error) {
      console.error('[Discord] Erro ao processar feedback:', error);
      await interaction.reply({ 
        content: 'Ocorreu um erro ao processar seu feedback. Por favor, tente novamente.',
        ephemeral: true 
      }).catch(console.error);
    }
  }

  build(): ModalBuilder {
    const modal = new ModalBuilder()
      .setCustomId(this.customId)
      .setTitle('Envie seu feedback');

    const feedbackInput = new TextInputBuilder()
      .setCustomId('feedback_input')
      .setLabel('Qual é seu feedback?')
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder('Digite seu feedback aqui...')
      .setRequired(true)
      .setMaxLength(1000);

    const firstActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(feedbackInput);
    modal.addComponents(firstActionRow);

    return modal;
  }
} 