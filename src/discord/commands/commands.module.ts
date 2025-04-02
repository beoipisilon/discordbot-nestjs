import { Module, OnModuleInit } from '@nestjs/common';
import { DiscordService } from '../discord.service';
import { PingCommand } from './ping.command';
import { DiscordClientModule } from '../discord-client.module';
import { FeedbackCommand } from './feedback.command';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [DiscordClientModule, ConfigModule],
  providers: [PingCommand, FeedbackCommand],
  exports: [PingCommand, FeedbackCommand],
})
export class CommandsModule implements OnModuleInit {
  constructor(private readonly discordService: DiscordService) {
    console.log('[Commands] Construtor do módulo de comandos...');
  }

  async onModuleInit() {
    console.log('[Commands] Inicializando módulo de comandos...');

    // Criar instâncias
    const pingCommand = new PingCommand(this.discordService);
    const feedbackCommand = new FeedbackCommand(this.discordService);

    // Registrar comandos
    console.log('[Commands] Registrando comandos...');
    this.discordService.commands.set(pingCommand.name, pingCommand);
    this.discordService.commands.set(feedbackCommand.name, feedbackCommand);

    console.log('[Commands] Comandos registrados:', Array.from(this.discordService.commands.keys()));
    console.log('[Commands] Módulo de comandos inicializado com sucesso!');
  }
} 