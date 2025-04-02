import { Command } from './interfaces/command.interface';
import { Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { DiscordService } from '../discord.service';

export class FeedbackCommand implements Command {
  name = 'feedback';
  description = 'Mostra um embed com botão para enviar feedback';

  constructor(
    private readonly discordService: DiscordService,
  ) {}

  async execute(message: Message, args: string[]): Promise<void> {
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('📝 Sistema de Feedback')
      .setDescription('Clique no botão abaixo para enviar seu feedback!')
      .addFields(
        { name: 'Como funciona?', value: '1. Clique no botão "Enviar Feedback"\n2. Preencha o formulário\n3. Seu feedback será enviado!' },
        { name: 'Importante', value: 'Seu feedback é muito importante para melhorarmos nossos serviços!' }
      )
      .setFooter({ text: 'Sistema de Feedback v1.0' })
      .setTimestamp();

    const button = new ButtonBuilder()
      .setCustomId('feedback_button')
      .setLabel('Enviar Feedback')
      .setStyle(ButtonStyle.Success)
      .setEmoji('📝');

    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(button);

    await message.reply({ embeds: [embed], components: [row] });
  }
} 