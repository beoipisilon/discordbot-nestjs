import { Injectable } from '@nestjs/common';
import { Event } from './interfaces/event.interface';
import { Message } from 'discord.js';
import { DiscordService } from '../discord.service';
import { LoggerService } from '../../logger/logger.service';
import { ConfigService } from '@nestjs/config';
import { CommandHandler } from '../commands/command.handler';

@Injectable()
export class MessageEvent implements Event {
  name = 'messageCreate';
  private prefix = '!';

  constructor(
    private readonly discordService: DiscordService,
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
    private readonly commandHandler: CommandHandler,
  ) {
    console.log('[MessageEvent] Evento criado');
  }

  async execute(message: Message): Promise<void> {
    try {
      // Ignora mensagens de bots
      if (message.author.bot) {
        console.log('[MessageEvent] Ignorando mensagem de bot');
        return;
      }

      // Verifica se a mensagem começa com o prefixo
      if (!message.content.startsWith(this.prefix)) {
        console.log('[MessageEvent] Mensagem não começa com prefixo');
        return;
      }

      // Extrai o comando e os argumentos
      const args = message.content.slice(this.prefix.length).trim().split(/ +/);
      const commandName = args.shift()?.toLowerCase();

      if (!commandName) {
        console.log('[MessageEvent] Nenhum comando encontrado');
        return;
      }

      console.log('[MessageEvent] Processando mensagem:', message.content);
      console.log('[MessageEvent] Comando encontrado:', commandName);
      console.log('[MessageEvent] Argumentos:', args);

      // Executa o comando usando o CommandHandler
      await this.commandHandler.handleCommand(message);
    } catch (error) {
      console.error('[MessageEvent] Erro ao processar mensagem:', error);
      try {
        await message.reply('Ocorreu um erro ao executar o comando. Por favor, tente novamente.');
      } catch (replyError) {
        console.error('[MessageEvent] Erro ao enviar mensagem de erro:', replyError);
      }
    }
  }
} 