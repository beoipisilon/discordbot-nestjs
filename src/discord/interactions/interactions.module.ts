import { Module, forwardRef } from '@nestjs/common';
import { DiscordCoreModule } from '../discord-core.module';
import { CommandsModule } from '../commands/commands.module';
import { PingButton } from './buttons/ping.button';
import { FeedbackButton } from './buttons/feedback.button';
import { FeedbackModal } from './modals/feedback.modal';

@Module({
  imports: [
    forwardRef(() => DiscordCoreModule),
    forwardRef(() => CommandsModule),
  ],
  providers: [PingButton, FeedbackButton, FeedbackModal],
  exports: [PingButton, FeedbackButton, FeedbackModal],
})
export class InteractionsModule {
  constructor() {
    console.log('[Interactions] Construtor do módulo de interações...');
  }
} 