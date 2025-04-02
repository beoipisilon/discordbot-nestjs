import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DiscordService } from './discord.service';

@Module({
  imports: [ConfigModule],
  providers: [DiscordService],
  exports: [DiscordService],
})
export class DiscordClientModule implements OnModuleInit {
  constructor(private readonly discordService: DiscordService) {
    console.log('[DiscordClient] Módulo criado');
  }

  async onModuleInit() {
    try {
      console.log('[DiscordClient] Verificando estado do cliente Discord...');
      
      // Verifica se o cliente está pronto
      const client = this.discordService.getClient();
      if (!client.isReady()) {
        console.log('[DiscordClient] Aguardando cliente estar pronto...');
        await new Promise<void>((resolve) => {
          client.once('ready', () => {
            console.log('[DiscordClient] Cliente está pronto!');
            resolve();
          });
        });
      }
      
      console.log('[DiscordClient] Cliente Discord inicializado com sucesso!');
    } catch (error) {
      console.error('[DiscordClient] ERRO: Falha ao verificar estado do cliente Discord:', error);
      throw error;
    }
  }
} 