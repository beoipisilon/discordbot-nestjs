import { Injectable } from '@nestjs/common';
import { Message, ClientEvents } from 'discord.js';
import { Event } from './interfaces/event.interface';
import { DiscordService } from '../discord.service';
import { LoggerService } from '../../logger/logger.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MessageEvent implements Event {
  name: keyof ClientEvents = 'messageCreate';

  constructor(
    private discordService: DiscordService,
    private loggerService: LoggerService,
    private configService: ConfigService,
  ) {
    console.log('[MessageEvent] Constructor called');
  }

  async execute(message: Message): Promise<void> {
    console.log('[MessageEvent] Execute called with message:', message.content);
    
    if (message.author.bot) {
      console.log('[MessageEvent] Ignoring message from bot');
      return;
    }

    const prefix = this.configService.get<string>('PREFIX');
    console.log('[MessageEvent] Prefix:', prefix);
    console.log('[MessageEvent] Message content:', message.content);

    if (!message.content.startsWith(prefix)) {
      console.log('[MessageEvent] Message does not start with prefix');
      return;
    }

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase();
    console.log('[MessageEvent] Command name:', commandName);
    console.log('[MessageEvent] Available commands:', Array.from(this.discordService.commands.keys()));

    if (!commandName) {
      console.log('[MessageEvent] No command name found');
      return;
    }

    const command = this.discordService.commands.get(commandName);
    if (!command) {
      console.log('[MessageEvent] Command not found:', commandName);
      return;
    }

    try {
      console.log('[MessageEvent] Executing command:', commandName);
      await command.execute(message, args);
      console.log('[MessageEvent] Command executed successfully:', commandName);
    } catch (error) {
      console.error('[MessageEvent] Error executing command:', error);
      await message.reply('There was an error executing that command.');
    }
  }
} 