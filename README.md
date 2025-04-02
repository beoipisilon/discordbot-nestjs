# Discord Bot - NestJS

A modular Discord bot built with NestJS, discord.js v14, and MongoDB.

## 🚀 Quick Start

1. **Clone & Install**
   ```bash
   npm install
   ```
2. **Configure Environment**
   ```
   # .env
   DISCORD_TOKEN=your_bot_token
   MONGODB_URI=mongodb://localhost:27017/discordbot
   ```
3. **Run**

   # Development
   ```bash
   npm run start:dev
   ```

   # Production
   ```bash
   npm run build && npm run start:prod
   ```

## Project Structure

```
src/
├── discord/
│   ├── commands/         # Command implementations
│   ├── events/          # Event handlers
│   └── discord.service.ts
├── logger/             # Logging functionality
└── main.ts            # Application entry point
```

## Adding New Commands

1. Create a new command class in `src/discord/commands/`
2. Implement the `Command` interface
3. Add the command to the `commands` array in `CommandsModule`

## Adding New Events

1. Create a new event class in `src/discord/events/`
2. Implement the `Event` interface
3. Add the event to the `events` array in `EventsModule` 