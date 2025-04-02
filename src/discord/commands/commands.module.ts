import { Module } from '@nestjs/common';
import { DiscordService } from '../discord.service';
import { PingCommand } from './ping.command';
import { DiscordClientModule } from '../discord-client.module';
import { FeedbackCommand } from './feedback.command';

@Module({
  imports: [DiscordClientModule],
  providers: [PingCommand, FeedbackCommand],
  exports: [PingCommand, FeedbackCommand],
})
export class CommandsModule {
  constructor(private discordService: DiscordService) {
    this.initializeCommands();
  }

  private initializeCommands() {
    const commands = [PingCommand, FeedbackCommand];
    commands.forEach(command => {
      const instance = new command(this.discordService);
      this.discordService.commands.set(instance.name, instance);
    });
  }
} 