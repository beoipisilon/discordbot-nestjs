import { Module, OnModuleInit, forwardRef } from '@nestjs/common';
import { DiscordCoreModule } from '../discord-core.module';
import { ReadyEvent } from './ready.event';
import { MessageEvent } from './message.event';
import { LoggerModule } from '../../logger/logger.module';
import { ConfigModule } from '@nestjs/config';
import { CommandsModule } from '../commands/commands.module';

@Module({
  imports: [
    DiscordCoreModule,
    LoggerModule,
    ConfigModule,
    forwardRef(() => CommandsModule),
  ],
  providers: [ReadyEvent, MessageEvent],
  exports: [ReadyEvent, MessageEvent],
})
export class EventsModule implements OnModuleInit {
  constructor(
    private readonly readyEvent: ReadyEvent,
    private readonly messageEvent: MessageEvent,
  ) {
    console.log('[Events] Construtor do módulo de eventos...');
  }

  async onModuleInit() {
    try {
      console.log('[Events] Inicializando módulo de eventos...');
      console.log('[Events] Módulo de eventos inicializado com sucesso!');
    } catch (error) {
      console.error('[Events] ERRO: Falha ao inicializar módulo de eventos:', error);
      throw error;
    }
  }
} 