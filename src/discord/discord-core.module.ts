import { Module, OnModuleInit, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DiscordService } from './discord.service';
import { CommandsModule } from './commands/commands.module';

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => CommandsModule),
  ],
  providers: [DiscordService],
  exports: [DiscordService],
})
export class DiscordCoreModule implements OnModuleInit {
  constructor(private readonly discordService: DiscordService) {
    console.log('[DiscordCore] Módulo criado');
  }

  async onModuleInit() {
    try {
      console.log('[DiscordCore] Verificando estado do cliente Discord...');
      
      // Verifica se o cliente está pronto
      const client = this.discordService.getClient();
      if (!client.isReady()) {
        console.log('[DiscordCore] Aguardando cliente estar pronto...');
        await new Promise<void>((resolve) => {
          client.once('ready', () => {
            console.log('[DiscordCore] Cliente está pronto!');
            resolve();
          });
        });
      }
      
      console.log('[DiscordCore] Cliente Discord inicializado com sucesso!');
    } catch (error) {
      console.error('[DiscordCore] ERRO: Falha ao verificar estado do cliente Discord:', error);
      throw error;
    }
  }
} 