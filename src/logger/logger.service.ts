import { Injectable } from '@nestjs/common';
import { ClientEvents } from 'discord.js';

@Injectable()
export class LoggerService {
  logEvent(eventName: keyof ClientEvents, ...args: any[]): void {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Event: ${eventName}`);
    
    // Log additional event-specific information
    switch (eventName) {
      case 'messageCreate':
        const message = args[0];
        console.log(`Message from ${message.author.tag}: ${message.content}`);
        break;
      case 'ready':
        console.log('Bot is ready!');
        break;
      case 'error':
        console.error('Discord client error:', args[0]);
        break;
    }
  }
} 