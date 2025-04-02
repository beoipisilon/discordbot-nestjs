import { Module, OnModuleInit } from '@nestjs/common';
import { DiscordClientModule } from '../discord-client.module';
import { PingButton } from './buttons/ping.button';
import { FeedbackButton } from './buttons/feedback.button';
import { FeedbackModal } from './modals/feedback.modal';
import { DiscordService } from '../discord.service';

@Module({
  imports: [DiscordClientModule],
  providers: [PingButton, FeedbackButton, FeedbackModal, DiscordService],
  exports: [PingButton, FeedbackButton, FeedbackModal],
})
export class InteractionsModule implements OnModuleInit {
  constructor(private readonly discordService: DiscordService) {
    console.log('[Interactions] Inicializando módulo de interações...');
  }

  onModuleInit() {
    // Criar instâncias
    const feedbackModal = new FeedbackModal();
    const feedbackButton = new FeedbackButton(feedbackModal);
    const pingButton = new PingButton();

    // Registrar botões
    console.log('[Interactions] Registrando botões...');
    this.discordService.registerButton(pingButton);
    this.discordService.registerButton(feedbackButton);

    // Registrar modais
    console.log('[Interactions] Registrando modais...');
    this.discordService.registerModal(feedbackModal);

    console.log('[Interactions] Módulo de interações inicializado com sucesso!');
  }
} 