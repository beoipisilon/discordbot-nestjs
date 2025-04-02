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
  constructor() {}

  async onModuleInit() {
    // A ordem de inicialização é controlada pela ordem dos imports
    // 1. ConfigModule (global)
    // 2. MongooseModule (conexão com o banco)
    // 3. DiscordModule (bot do Discord)
    // 4. LoggerModule (sistema de logs)
  }
} 