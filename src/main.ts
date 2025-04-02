import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DiscordModule } from './discord/discord.module';
import { DiscordClientModule } from './discord/discord-client.module';
import { CommandsModule } from './discord/commands/commands.module';
import { EventsModule } from './discord/events/events.module';
import { InteractionsModule } from './discord/interactions/interactions.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    
    // Inicializa todos os módulos
    const appModule = app.get(AppModule);
    const discordModule = app.get(DiscordModule);
    const discordClientModule = app.get(DiscordClientModule);
    const commandsModule = app.get(CommandsModule);
    const eventsModule = app.get(EventsModule);
    const interactionsModule = app.get(InteractionsModule);

    // Chama onModuleInit em todos os módulos na ordem correta
    await appModule.onModuleInit();
    await discordModule.onModuleInit();
    await discordClientModule.onModuleInit();
    await commandsModule.onModuleInit();
    await eventsModule.onModuleInit();
    await interactionsModule.onModuleInit();

    await app.listen(3000);
  } catch (error) {
    console.error('[Bootstrap] ERRO: Falha ao iniciar a aplicação:', error);
    process.exit(1);
  }
}

bootstrap(); 