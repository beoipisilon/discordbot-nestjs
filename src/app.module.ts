import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DiscordModule } from './discord/discord.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/discordbot'),
    DiscordModule,
    LoggerModule,
  ],
})
export class AppModule implements OnModuleInit {
  constructor() {
    console.log('[App] Módulo criado');
  }

  async onModuleInit() {
    try {
      console.log('[App] Inicializando módulo principal...');
      
      // A ordem de inicialização é controlada pela ordem dos imports
      // 1. ConfigModule (global)
      // 2. MongooseModule (conexão com o banco)
      // 3. DiscordModule (bot do Discord)
      // 4. LoggerModule (sistema de logs)
      
      // Aguarda um momento para garantir que todos os módulos foram inicializados
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('[App] Módulo principal inicializado com sucesso!');
    } catch (error) {
      console.error('[App] ERRO: Falha ao inicializar o módulo principal:', error);
      throw error;
    }
  }
} 