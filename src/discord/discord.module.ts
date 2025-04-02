import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsModule } from './events/events.module';
import { InteractionsModule } from './interactions/interactions.module';
import { LoggerModule } from '../logger/logger.module';
import { DiscordCoreModule } from './discord-core.module';

@Module({
  imports: [
    ConfigModule,
    MongooseModule,
    LoggerModule,
    DiscordCoreModule,
    EventsModule,
    InteractionsModule,
  ],
})
export class DiscordModule implements OnModuleInit {
  constructor() {
    console.log('[Discord] Módulo criado');
  }

  async onModuleInit() {
    try {
      console.log('[Discord] Inicializando módulo Discord...');
      console.log('[Discord] Módulo Discord inicializado com sucesso!');
    } catch (error) {
      console.error('[Discord] ERRO: Falha ao inicializar módulo Discord:', error);
      throw error;
    }
  }
} 