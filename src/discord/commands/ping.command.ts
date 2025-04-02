import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { Command } from './interfaces/command.interface';
import { Message } from 'discord.js';
import { DiscordService } from '../discord.service';

@Injectable()
export class PingCommand implements Command {
  name = 'ping';
  description = 'Responde com Pong!';
  usage = '!ping';

  constructor(
    @Inject(forwardRef(() => DiscordService))
    private readonly discordService: DiscordService,
  ) {
    console.log('[PingCommand] Comando criado');
  }

  async register() {
    this.discordService.registerCommand(this);
  }

  async execute(message: Message, args: string[]): Promise<void> {
    try {
      const reply = await message.reply('Ping?');
      const latency = reply.createdTimestamp - message.createdTimestamp;
      await reply.edit(`Pong! Latência: ${latency}ms`);
    } catch (error) {
      console.error('[PingCommand] Erro ao executar comando:', error);
      await message.reply('Erro ao executar o comando. Por favor, tente novamente.');
    }
  }
} 