import { ModalBuilder, ModalSubmitInteraction, TextInputBuilder, TextInputStyle, ActionRowBuilder } from 'discord.js';
import { ModalInteraction } from '../interfaces/modal.interface';

export class FeedbackModal implements ModalInteraction {
  customId = 'feedback_modal';

  async execute(interaction: ModalSubmitInteraction): Promise<void> {
    const feedback = interaction.fields.getTextInputValue('feedback_input');
    await interaction.reply({ content: `Obrigado pelo seu feedback!\n\n${feedback}`, ephemeral: true });
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