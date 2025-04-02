import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, GatewayIntentBits, Collection, ButtonInteraction, ModalSubmitInteraction } from 'discord.js';
import { Command } from './commands/interfaces/command.interface';
import { Event } from './events/interfaces/event.interface';
import { IButtonInteraction } from './interactions/interfaces/button.interface';
import { ModalInteraction } from './interactions/interfaces/modal.interface';

@Injectable()
export class DiscordService implements OnModuleInit {
  private client: Client;
  public commands: Collection<string, Command>;
  public events: Collection<string, Event>;
  public buttons: Collection<string, IButtonInteraction>;
  public modals: Collection<string, ModalInteraction>;

  constructor(private configService: ConfigService) {
    console.log('[Discord] Inicializando cliente Discord...');
    try {
      const token = this.configService.get<string>('DISCORD_TOKEN');
      
      if (!token) {
        console.error('\x1b[31m%s\x1b[0m', '[Discord] ERRO: Token do Discord não encontrado nas variáveis de ambiente');
        throw new Error('Token do Discord não encontrado nas variáveis de ambiente');
      }

      this.client = new Client({
        intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.MessageContent,
          GatewayIntentBits.GuildMembers,
        ],
      });

      this.commands = new Collection();
      this.events = new Collection();
      this.buttons = new Collection();
      this.modals = new Collection();

      this.client.on('error', error => {
        console.error('[Discord] Erro no cliente:', error);
      });

      this.client.on('warn', warning => {
        console.warn('[Discord] Aviso do cliente:', warning);
      });

      this.client.on('debug', debug => {
        console.debug('[Discord] Debug:', debug);
      });

      this.client.on('interactionCreate', async interaction => {
        try {
          if (interaction.isButton()) {
            const button = this.buttons.get(interaction.customId);
            if (button) {
              await button.execute(interaction);
            }
          } else if (interaction.isModalSubmit()) {
            const modal = this.modals.get(interaction.customId);
            if (modal) {
              await modal.execute(interaction);
            }
          }
        } catch (error) {
          console.error('[Discord] Erro ao processar interação:', error);
          if (interaction.isRepliable()) {
            await interaction.reply({ 
              content: 'Ocorreu um erro ao processar sua interação. Por favor, tente novamente.',
              ephemeral: true 
            }).catch(console.error);
          }
        }
      });

      console.log('[Discord] Tentando conectar ao Discord...');
      this.client.login(token);
      console.log('[Discord] Cliente Discord inicializado com sucesso!');
    } catch (error) {
      console.error('[Discord] ERRO: Falha ao inicializar o cliente Discord:', error);
      throw error;
    }
  }

  async onModuleInit() {
  }

  getClient(): Client {
    return this.client;
  }

  registerButton(button: IButtonInteraction) {
    this.buttons.set(button.customId, button);
  }

  registerModal(modal: ModalInteraction) {
    this.modals.set(modal.customId, modal);
  }
} 