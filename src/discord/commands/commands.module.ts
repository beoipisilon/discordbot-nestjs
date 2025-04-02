import { Module, OnModuleInit, forwardRef } from '@nestjs/common';
import { FeedbackCommand } from './feedback.command';
import { PingCommand } from './ping.command';
import { CommandHandler } from './command.handler';
import { DiscordCoreModule } from '../discord-core.module';

@Module({
  imports: [forwardRef(() => DiscordCoreModule)],
  providers: [CommandHandler, FeedbackCommand, PingCommand],
  exports: [CommandHandler],
})
export class CommandsModule implements OnModuleInit {
  constructor(
    private readonly commandHandler: CommandHandler,
    private readonly feedbackCommand: FeedbackCommand,
    private readonly pingCommand: PingCommand,
  ) {
    console.log('[Commands] Construtor do módulo de comandos...');
  }

  async onModuleInit() {
    try {
      console.log('[Commands] Inicializando módulo de comandos...');
      
      // Registra os comandos
      await this.feedbackCommand.register();
      await this.pingCommand.register();
      
      console.log('[Commands] Módulo de comandos inicializado com sucesso!');
    } catch (error) {
      console.error('[Commands] ERRO: Falha ao inicializar módulo de comandos:', error);
      throw error;
    }
  }
} 