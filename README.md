# Discord Bot with NestJS

A Discord bot built with NestJS, featuring a modular architecture and modern TypeScript practices.

## Project Structure

```
src/
├── discord/
│   ├── commands/           # Command handlers
│   │   ├── interfaces/     # Command interfaces
│   │   ├── ping.command.ts
│   │   └── feedback.command.ts
│   ├── events/            # Event handlers
│   │   ├── interfaces/    # Event interfaces
│   │   ├── ready.event.ts
│   │   └── message.event.ts
│   ├── interactions/      # Interactive components
│   │   ├── interfaces/    # Interaction interfaces
│   │   ├── buttons/       # Button handlers
│   │   └── modals/        # Modal handlers
│   ├── discord.module.ts  # Main Discord module
│   ├── discord.service.ts # Discord client service
│   └── discord-client.module.ts
├── logger/               # Logging system
└── main.ts              # Application entry point
```

## Available Commands

- `!ping` - Check bot latency
- `!feedback` - Open feedback form

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory:
   ```
   DISCORD_TOKEN=your_bot_token_here
   ```
4. Start the bot:
   ```bash
   npm run start:dev
   ```

## Development

- `npm run start:dev` - Start in development mode with hot-reload
- `npm run build` - Build the project
- `npm run start:prod` - Start in production mode