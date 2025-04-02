import { Module, OnModuleInit } from '@nestjs/common';
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
export class DiscordModule implements OnModuleInit {
  constructor() {}

  async onModuleInit() {
    // A ordem de inicialização é controlada pela ordem dos imports
    // 1. ConfigModule (global)
    // 2. DiscordClientModule (cria o cliente)
    // 3. CommandsModule (registra comandos)
    // 4. EventsModule (registra eventos)
    // 5. InteractionsModule (registra interações)
  }
} 