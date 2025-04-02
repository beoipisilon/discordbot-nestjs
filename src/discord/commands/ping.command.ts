import { Command } from './interfaces/command.interface';
import { Message } from 'discord.js';
import { DiscordService } from '../discord.service';

export class PingCommand implements Command {
  name = 'ping';
  description = 'Responde com Pong!';

  constructor(private readonly discordService: DiscordService) {}

  async execute(message: Message): Promise<void> {
    const sent = await message.reply('Pinging...');
    const latency = sent.createdTimestamp - message.createdTimestamp;
    await sent.edit(`Pong! 🏓\nLatency: ${latency}ms\nAPI Latency: ${Math.round(this.discordService.getClient().ws.ping)}ms`);
  }
} 