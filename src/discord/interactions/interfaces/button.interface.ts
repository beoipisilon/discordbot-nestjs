import { ButtonBuilder, ButtonInteraction } from 'discord.js';

export interface IButtonInteraction {
  customId: string;
  execute: (interaction: ButtonInteraction) => Promise<void>;
  build: () => ButtonBuilder;
} 