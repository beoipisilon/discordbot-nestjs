import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DiscordModule } from './discord/discord.module';
import { DiscordClientModule } from './discord/discord-client.module';
import { CommandsModule } from './discord/commands/commands.module';
import { EventsModule } from './discord/events/events.module';
import { InteractionsModule } from './discord/interactions/interactions.module';

async function bootstrap() {
  try {
    console.log('[Bootstrap] Iniciando aplicação...');
    const app = await NestFactory.create(AppModule);
    
    // Inicializa todos os módulos
    console.log('[Bootstrap] Obtendo instâncias dos módulos...');
    const appModule = app.get(AppModule);
    const discordModule = app.get(DiscordModule);
    const discordClientModule = app.get(DiscordClientModule);
    const commandsModule = app.get(CommandsModule);
    const eventsModule = app.get(EventsModule);
    const interactionsModule = app.get(InteractionsModule);

    // Chama onModuleInit em todos os módulos na ordem correta
    console.log('[Bootstrap] Inicializando módulos...');
    
    // Primeiro inicializa o módulo principal
    await appModule.onModuleInit();
    
    // Depois inicializa o módulo do Discord
    await discordModule.onModuleInit();
    
    // Em seguida inicializa o cliente do Discord
    await discordClientModule.onModuleInit();
    
    // Por fim inicializa os módulos de funcionalidades
    await commandsModule.onModuleInit();
    await eventsModule.onModuleInit();
    await interactionsModule.onModuleInit();

    console.log('[Bootstrap] Iniciando servidor HTTP...');
    await app.listen(3000);
    console.log('[Bootstrap] Aplicação iniciada com sucesso!');
  } catch (error) {
    console.error('[Bootstrap] ERRO: Falha ao iniciar a aplicação:', error);
    process.exit(1);
  }
}

bootstrap(); 