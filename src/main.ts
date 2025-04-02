import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DiscordModule } from './discord/discord.module';
import { DiscordCoreModule } from './discord/discord-core.module';
import { CommandsModule } from './discord/commands/commands.module';
import { EventsModule } from './discord/events/events.module';
import { InteractionsModule } from './discord/interactions/interactions.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  logger.log('Iniciando aplicação...');

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Configuração do CORS
  app.enableCors({
    origin: configService.get('FRONTEND_URL') || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  // Configuração do Swagger
  const swaggerConfig = {
    title: 'API do Bot Discord',
    description: 'API para gerenciamento do bot Discord',
    version: '1.0',
    tags: ['discord', 'bot', 'api'],
  };

  // Inicializa todos os módulos
  logger.log('Obtendo instâncias dos módulos...');
  const appModule = app.get(AppModule);
  const discordModule = app.get(DiscordModule);
  const discordCoreModule = app.get(DiscordCoreModule);
  const commandsModule = app.get(CommandsModule);
  const eventsModule = app.get(EventsModule);
  const interactionsModule = app.get(InteractionsModule);

  // Chama onModuleInit em todos os módulos na ordem correta
  logger.log('Inicializando módulos...');
  
  // Primeiro inicializa o módulo principal
  await appModule.onModuleInit();
  
  // Depois inicializa o módulo do Discord
  await discordModule.onModuleInit();
  
  // Em seguida inicializa o cliente do Discord
  await discordCoreModule.onModuleInit();
  
  // Por fim inicializa os módulos de funcionalidades
  await commandsModule.onModuleInit();
  await eventsModule.onModuleInit();

  // Inicia o servidor
  const port = configService.get('PORT') || 3000;
  await app.listen(port);
  logger.log(`Aplicação rodando na porta ${port}`);
}

bootstrap().catch((error) => {
  console.error('Erro ao iniciar a aplicação:', error);
  process.exit(1);
}); 