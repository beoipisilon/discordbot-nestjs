import { Event } from './interfaces/event.interface';
import { DiscordService } from '../discord.service';

export class ReadyEvent implements Event {
  name = 'ready';

  constructor(private readonly discordService: DiscordService) {}

  execute(client: any) {
    console.log(`[Discord] Bot online como ${client.user.tag}!`);
  }
} 