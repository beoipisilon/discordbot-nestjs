import { ButtonBuilder, ButtonInteraction, ButtonStyle } from 'discord.js';
import { IButtonInteraction } from '../interfaces/button.interface';
import { FeedbackModal } from '../modals/feedback.modal';

export class FeedbackButton implements IButtonInteraction {
  customId = 'feedback_button';

  constructor(private readonly feedbackModal: FeedbackModal) {}

  async execute(interaction: ButtonInteraction): Promise<void> {
    await interaction.showModal(this.feedbackModal.build());
  }

  build(): ButtonBuilder {
    return new ButtonBuilder()
      .setCustomId(this.customId)
      .setLabel('Enviar Feedback')
      .setStyle(ButtonStyle.Success)
      .setEmoji('📝');
  }
} 