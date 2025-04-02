import { Module, OnModuleInit } from '@nestjs/common';
import { DiscordClientModule } from '../discord-client.module';
import { PingButton } from './buttons/ping.button';
import { FeedbackButton } from './buttons/feedback.button';
import { FeedbackModal } from './modals/feedback.modal';
import { DiscordService } from '../discord.service';

@Module({
  imports: [DiscordClientModule],
  providers: [PingButton, FeedbackButton, FeedbackModal],
  exports: [PingButton, FeedbackButton, FeedbackModal],
})
export class InteractionsModule implements OnModuleInit {
  constructor(private readonly discordService: DiscordService) {}

  onModuleInit() {
    // Registrar botões
    this.discordService.registerButton(new PingButton());
    this.discordService.registerButton(new FeedbackButton(new FeedbackModal()));

    // Registrar modais
    this.discordService.registerModal(new FeedbackModal());
  }
} 