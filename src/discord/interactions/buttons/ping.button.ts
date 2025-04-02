import { ButtonBuilder, ButtonInteraction, ButtonStyle } from 'discord.js';
import { IButtonInteraction } from '../interfaces/button.interface';

export class PingButton implements IButtonInteraction {
  customId = 'ping_button';

  async execute(interaction: ButtonInteraction): Promise<void> {
    const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    await interaction.editReply(`Pong! 🏓\nLatency: ${latency}ms\nAPI Latency: ${Math.round(interaction.client.ws.ping)}ms`);
  }

  build(): ButtonBuilder {
    return new ButtonBuilder()
      .setCustomId(this.customId)
      .setLabel('Ping!')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('🏓');
  }
} 