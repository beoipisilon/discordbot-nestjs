import { Module, OnModuleInit } from '@nestjs/common';
import { DiscordClientModule } from '../discord-client.module';
import { ReadyEvent } from './ready.event';
import { MessageEvent } from './message.event';
import { DiscordService } from '../discord.service';
import { LoggerModule } from '../../logger/logger.module';
import { LoggerService } from '../../logger/logger.service';
import { ConfigService, ConfigModule } from '@nestjs/config';

@Module({
  imports: [DiscordClientModule, LoggerModule, ConfigModule],
  providers: [ReadyEvent, MessageEvent],
  exports: [ReadyEvent, MessageEvent],
})
export class EventsModule implements OnModuleInit {
  constructor(
    private readonly discordService: DiscordService,
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
  ) {
    console.log('[Events] Construtor do módulo de eventos...');
  }

  async onModuleInit() {
    console.log('[Events] Inicializando módulo de eventos...');
    
    // Criar instâncias
    const readyEvent = new ReadyEvent(this.discordService);
    const messageEvent = new MessageEvent(this.discordService, this.loggerService, this.configService);

    // Registrar eventos
    console.log('[Events] Registrando eventos...');
    this.discordService.registerEvent(readyEvent);
    this.discordService.registerEvent(messageEvent);

    console.log('[Events] Módulo de eventos inicializado com sucesso!');
  }
} 