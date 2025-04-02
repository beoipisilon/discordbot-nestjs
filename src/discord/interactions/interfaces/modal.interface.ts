import { ModalBuilder, ModalSubmitInteraction } from 'discord.js';

export interface ModalInteraction {
  customId: string;
  execute: (interaction: ModalSubmitInteraction) => Promise<void>;
  build: () => ModalBuilder;
} 