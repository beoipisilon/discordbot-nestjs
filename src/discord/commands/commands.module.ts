import { Module, OnModuleInit } from '@nestjs/common';
import { DiscordService } from '../discord.service';
import { CommandHandler } from './command.handler';
import { FeedbackCommand } from './feedback.command';

@Module({
  providers: [CommandHandler, FeedbackCommand],
  exports: [CommandHandler],
})
export class CommandsModule implements OnModuleInit {
  constructor(
    private readonly discordService: DiscordService,
    private readonly commandHandler: CommandHandler,
  ) {
    console.log('[Commands] Construtor do módulo de comandos...');
  }

  async onModuleInit() {
    try {
      console.log('[Commands] Inicializando módulo de comandos...');
      
      // Registra o handler de comandos no cliente Discord
      const client = this.discordService.getClient();
      client.on('messageCreate', async (message) => {
        try {
          await this.commandHandler.handleCommand(message);
        } catch (error) {
          console.error('[Commands] Erro ao processar comando:', error);
        }
      });

      console.log('[Commands] Módulo de comandos inicializado com sucesso!');
    } catch (error) {
      console.error('[Commands] ERRO: Falha ao inicializar módulo de comandos:', error);
      throw error;
    }
  }
} 