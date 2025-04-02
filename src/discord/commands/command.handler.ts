import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { Message } from 'discord.js';
import { Command } from './interfaces/command.interface';
import { DiscordService } from '../discord.service';

@Injectable()
export class CommandHandler {
  private prefix = '!';
  private commands: Map<string, Command> = new Map();

  constructor(
    @Inject(forwardRef(() => DiscordService))
    private readonly discordService: DiscordService,
  ) {
    console.log('[CommandHandler] Handler criado');
  }

  registerCommand(command: Command) {
    this.commands.set(command.name, command);
    console.log('[CommandHandler] Comando registrado:', command.name);
  }

  async handleCommand(message: Message): Promise<void> {
    try {
      // Ignora mensagens de bots
      if (message.author.bot) {
        console.log('[CommandHandler] Ignorando mensagem de bot');
        return;
      }

      // Verifica se a mensagem começa com o prefixo
      if (!message.content.startsWith(this.prefix)) {
        console.log('[CommandHandler] Mensagem não começa com prefixo');
        return;
      }

      // Extrai o comando e os argumentos
      const args = message.content.slice(this.prefix.length).trim().split(/ +/);
      const commandName = args.shift()?.toLowerCase();

      if (!commandName) {
        console.log('[CommandHandler] Nenhum comando encontrado');
        return;
      }

      console.log('[CommandHandler] Processando mensagem:', message.content);
      console.log('[CommandHandler] Comando encontrado:', commandName);
      console.log('[CommandHandler] Argumentos:', args);

      // Busca o comando
      const command = this.commands.get(commandName);
      if (!command) {
        console.log('[CommandHandler] Comando não encontrado:', commandName);
        return;
      }

      // Executa o comando
      console.log('[CommandHandler] Executando comando:', commandName);
      await command.execute(message, args);
      console.log('[CommandHandler] Comando executado com sucesso:', commandName);
    } catch (error) {
      console.error('[CommandHandler] Erro ao processar comando:', error);
      try {
        await message.reply('Ocorreu um erro ao executar o comando. Por favor, tente novamente.');
      } catch (replyError) {
        console.error('[CommandHandler] Erro ao enviar mensagem de erro:', replyError);
      }
    }
  }
} 