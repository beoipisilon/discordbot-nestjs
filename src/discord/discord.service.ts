import { Injectable, OnModuleInit, Inject, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, GatewayIntentBits, Collection, Message, TextChannel, ChannelType, Events, Interaction } from 'discord.js';
import { CommandHandler } from './commands/command.handler';
import { Command } from './commands/interfaces/command.interface';
import { IButtonInteraction } from './interactions/interfaces/button.interface';
import { ModalInteraction } from './interactions/interfaces/modal.interface';
import { Event } from './events/interfaces/event.interface';
import { PingButton } from './interactions/buttons/ping.button';
import { FeedbackButton } from './interactions/buttons/feedback.button';
import { FeedbackModal } from './interactions/modals/feedback.modal';

@Injectable()
export class DiscordService implements OnModuleInit {
  private client: Client;
  private commands: Collection<string, Command> = new Collection();
  private buttons: Collection<string, IButtonInteraction> = new Collection();
  private modals: Collection<string, ModalInteraction> = new Collection();
  private events: Collection<string, Event> = new Collection();

  constructor(
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => CommandHandler))
    private readonly commandHandler: CommandHandler,
  ) {
    console.log('[Discord] Serviço criado');
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

    // Registra o handler de mensagens
    this.client.on('messageCreate', async (message: Message) => {
      console.log('[Discord] Mensagem recebida:', message.content);
      try {
        await this.commandHandler.handleCommand(message);
      } catch (error) {
        console.error('[Discord] Erro ao processar mensagem:', error);
      }
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
    try {
      console.log('[Discord] Inicializando serviço...');
      const token = this.configService.get<string>('DISCORD_TOKEN');
      if (!token) {
        throw new Error('Token do Discord não encontrado nas variáveis de ambiente');
      }

      // Inicializa o cliente Discord
      this.client = new Client({
        intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.MessageContent,
          GatewayIntentBits.GuildMembers,
        ],
      });

      // Configura os handlers de eventos
      this.setupEventHandlers();

      // Registra os botões e modais
      const feedbackModal = new FeedbackModal();
      const feedbackButton = new FeedbackButton(feedbackModal);
      const pingButton = new PingButton();

      console.log('[Discord] Registrando botões...');
      this.registerButton(pingButton);
      this.registerButton(feedbackButton);

      console.log('[Discord] Registrando modais...');
      this.registerModal(feedbackModal);

      // Faz login no Discord
      await this.initializeClient(token);
      console.log('[Discord] Serviço inicializado com sucesso!');
    } catch (error) {
      console.error('[Discord] ERRO: Falha ao inicializar serviço:', error);
      throw error;
    }
  }

  getClient(): Client {
    return this.client;
  }

  registerButton(button: IButtonInteraction) {
    this.buttons.set(button.customId, button);
    console.log('[Discord] Botão registrado:', button.customId);
  }

  registerModal(modal: ModalInteraction) {
    this.modals.set(modal.customId, modal);
    console.log('[Discord] Modal registrado:', modal.customId);
  }

  registerEvent(event: Event) {
    this.events.set(event.name, event);
    this.client.on(event.name, (...args: any[]) => {
      event.execute(args[0]);
    });
    console.log('[Discord] Evento registrado:', event.name);
  }

  registerCommand(command: Command) {
    this.commandHandler.registerCommand(command);
  }
} 