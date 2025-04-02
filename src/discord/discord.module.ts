import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommandsModule } from './commands/commands.module';
import { EventsModule } from './events/events.module';
import { InteractionsModule } from './interactions/interactions.module';
import { DiscordClientModule } from './discord-client.module';

@Module({
  imports: [
    ConfigModule,
    DiscordClientModule,
    CommandsModule,
    EventsModule,
    InteractionsModule,
  ],
})
export class DiscordModule {} 