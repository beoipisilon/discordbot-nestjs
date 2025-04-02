import { ButtonBuilder, ButtonInteraction, ButtonStyle } from 'discord.js';
import { IButtonInteraction } from '../interfaces/button.interface';
import { FeedbackModal } from '../modals/feedback.modal';

export class FeedbackButton implements IButtonInteraction {
  customId = 'feedback_button';

  constructor(private readonly feedbackModal: FeedbackModal) {}

  async execute(interaction: ButtonInteraction): Promise<void> {
    try {
      console.log('[Discord] Construindo modal de feedback...');
      const modal = this.feedbackModal.build();
      console.log('[Discord] Modal construído:', modal);
      console.log('[Discord] Custom ID do modal:', modal.data.custom_id);
      
      await interaction.showModal(modal);
      console.log('[Discord] Modal exibido com sucesso!');
    } catch (error) {
      console.error('[Discord] Erro ao mostrar modal de feedback:', error);
      await interaction.reply({ 
        content: 'Ocorreu um erro ao abrir o formulário de feedback. Por favor, tente novamente.',
        ephemeral: true 
      }).catch(console.error);
    }
  }

  build(): ButtonBuilder {
    return new ButtonBuilder()
      .setCustomId(this.customId)
      .setLabel('Enviar Feedback')
      .setStyle(ButtonStyle.Success)
      .setEmoji('📝');
  }
} 