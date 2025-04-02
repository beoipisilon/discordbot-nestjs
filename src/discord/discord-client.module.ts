import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DiscordService } from './discord.service';

@Module({
  imports: [ConfigModule],
  providers: [DiscordService],
  exports: [DiscordService],
})
export class DiscordClientModule implements OnModuleInit {
  constructor(private readonly discordService: DiscordService) {}

  async onModuleInit() {
    try {
      await this.discordService.onModuleInit();
    } catch (error) {
      console.error('[DiscordClient] Erro ao inicializar o cliente Discord:', error);
      throw error;
    }
  }
} 