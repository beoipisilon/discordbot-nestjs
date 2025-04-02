import { Injectable } from '@nestjs/common';
import { ClientEvents } from 'discord.js';
import { Event } from './interfaces/event.interface';
import { DiscordService } from '../discord.service';
import { LoggerService } from '../../logger/logger.service';

@Injectable()
export class ReadyEvent implements Event {
  name: keyof ClientEvents = 'ready';

  constructor(
    private discordService: DiscordService,
    private loggerService: LoggerService,
  ) {}

  async execute(): Promise<void> {
    const client = this.discordService.getClient();
    console.log(`[Discord] Bot está online como ${client.user?.tag}!`);
    console.log(`[Discord] Servidores conectados: ${client.guilds.cache.size}`);
  }
} 