import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, GatewayIntentBits, Collection, ButtonInteraction, ModalSubmitInteraction, Interaction } from 'discord.js';
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
    console.log('[Discord] Inicializando serviço Discord...');
    
    this.commands = new Collection();
    this.events = new Collection();
    this.buttons = new Collection();
    this.modals = new Collection();

    const token = this.configService.get<string>('DISCORD_TOKEN');
    if (!token) {
      throw new Error('Token do Discord não encontrado nas variáveis de ambiente');
    }

    // Validação básica do token
    const tokenRegex = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;
    if (!tokenRegex.test(token)) {
      throw new Error('Token do Discord inválido');
    }

    console.log('[Discord] Token encontrado e válido');

    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
      ],
    });

    this.setupEventHandlers();
    
    // Inicializa o cliente no construtor
    this.initializeClient(token);
  }

  private async initializeClient(token: string) {
    try {
      console.log('[Discord] Tentando fazer login...');
      await this.client.login(token);
      console.log('[Discord] Login realizado com sucesso!');

      // Aguarda o cliente estar pronto
      if (!this.client.isReady()) {
        console.log('[Discord] Aguardando cliente estar pronto...');
        await new Promise<void>((resolve) => {
          this.client.once('ready', () => {
            console.log('[Discord] Cliente está pronto!');
            resolve();
          });
        });
      }

      console.log('[Discord] Estado do cliente:', {
        ready: this.client.isReady(),
        user: this.client.user?.tag,
        eventos: Array.from(this.events.keys()),
        comandos: Array.from(this.commands.keys()),
        botoes: Array.from(this.buttons.keys()),
        modais: Array.from(this.modals.keys())
      });
    } catch (error) {
      console.error('[Discord] ERRO: Falha ao conectar ao Discord:', error);
      throw error;
    }
  }

  private setupEventHandlers() {
    this.client.on('error', error => {
      console.error('[Discord] Erro no cliente:', error);
    });

    this.client.on('warn', warning => {
      console.warn('[Discord] Aviso do cliente:', warning);
    });

    this.client.on('debug', debug => {
      console.debug('[Discord] Debug:', debug);
    });

    this.client.on('ready', () => {
      console.log('[Discord] Bot está online!');
      console.log('[Discord] Logado como:', this.client.user?.tag);
    });

    this.client.on('interactionCreate', async (interaction: Interaction) => {
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
  }

  async onModuleInit() {
    // Não faz nada aqui, pois a inicialização já foi feita no construtor
    console.log('[Discord] onModuleInit chamado, mas a inicialização já foi feita no construtor');
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

  registerEvent(event: Event) {
    this.events.set(event.name, event);
    this.client.on(event.name, (...args: any[]) => {
      event.execute(args[0]);
    });
  }
} 