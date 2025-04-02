import { Injectable } from '@nestjs/common';
import { Message, ClientEvents } from 'discord.js';
import { Event } from './interfaces/event.interface';
import { DiscordService } from '../discord.service';
import { LoggerService } from '../../logger/logger.service';

@Injectable()
export class MessageEvent implements Event {
  name: keyof ClientEvents = 'messageCreate';

  constructor(
    private discordService: DiscordService,
    private loggerService: LoggerService,
  ) {}

  async execute(message: Message): Promise<void> {
    if (message.author.bot) return;

    console.log(process.env.PREFIX);  
    if (!message.content.startsWith(process.env.PREFIX)) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase();

    if (!commandName) return;

    const command = this.discordService.commands.get(commandName);
    if (!command) return;

    try {
      await command.execute(message, args);
    } catch (error) {
      console.error(error);
      await message.reply('There was an error executing that command.');
    }
  }
} 