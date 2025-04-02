import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { Command } from './interfaces/command.interface';
import { Message } from 'discord.js';
import { DiscordService } from '../discord.service';

@Injectable()
export class FeedbackCommand implements Command {
  name = 'feedback';
  description = 'Envia feedback para os desenvolvedores';
  usage = '!feedback <mensagem>';

  constructor(
    @Inject(forwardRef(() => DiscordService))
    private readonly discordService: DiscordService,
  ) {
    console.log('[FeedbackCommand] Comando criado');
  }

  async register() {
    this.discordService.registerCommand(this);
  }

  async execute(message: Message, args: string[]): Promise<void> {
    if (args.length === 0) {
      await message.reply('Por favor, forneça uma mensagem de feedback. Exemplo: !feedback Este é meu feedback');
      return;
    }

    const feedback = args.join(' ');
    const channelId = process.env.FEEDBACK_CHANNEL_ID;

    if (!channelId) {
      await message.reply('Erro: Canal de feedback não configurado');
      return;
    }

    try {
      const channel = await this.discordService.getClient().channels.fetch(channelId);
      if (!channel || channel.type !== 0) { // 0 é o tipo para TextChannel
        await message.reply('Erro: Canal de feedback não encontrado ou não é um canal de texto');
        return;
      }

      await (channel as any).send({
        embeds: [{
          title: 'Novo Feedback',
          description: feedback,
          color: 0x00ff00,
          fields: [
            {
              name: 'Autor',
              value: `${message.author.tag} (${message.author.id})`,
              inline: true,
            },
            {
              name: 'Servidor',
              value: message.guild?.name || 'DM',
              inline: true,
            },
          ],
          timestamp: new Date(),
        }],
      });

      await message.reply('Feedback enviado com sucesso! Obrigado pela sua contribuição.');
    } catch (error) {
      console.error('[FeedbackCommand] Erro ao enviar feedback:', error);
      await message.reply('Erro ao enviar feedback. Por favor, tente novamente mais tarde.');
    }
  }
} 