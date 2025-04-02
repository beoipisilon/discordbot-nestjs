import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DiscordService } from './discord.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: DiscordService,
      useFactory: (configService: ConfigService) => {
        return new DiscordService(configService);
      },
      inject: [ConfigService],
    },
  ],
  exports: [DiscordService],
})
export class DiscordClientModule {} 