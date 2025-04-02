import { Module } from '@nestjs/common';
import { DiscordService } from '../discord.service';
import { MessageEvent } from './message.event';
import { ReadyEvent } from './ready.event';
import { ClientEvents } from 'discord.js';
import { DiscordClientModule } from '../discord-client.module';
import { LoggerModule } from '../../logger/logger.module';
import { LoggerService } from '../../logger/logger.service';

@Module({
  imports: [DiscordClientModule, LoggerModule],
  providers: [MessageEvent, ReadyEvent],
  exports: [MessageEvent, ReadyEvent],
})
export class EventsModule {
  constructor(
    private discordService: DiscordService,
    private loggerService: LoggerService,
  ) {
    this.initializeEvents();
  }

  private initializeEvents() {
    const events = [MessageEvent, ReadyEvent];
    events.forEach(event => {
      const instance = new event(this.discordService, this.loggerService);
      this.discordService.events.set(instance.name, instance);
      
      // Type-safe event handler
      this.discordService.getClient().on(instance.name, (...args: any[]) => {
        instance.execute(args[0]);
      });
    });
  }
} 