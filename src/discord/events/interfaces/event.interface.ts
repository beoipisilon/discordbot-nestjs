import { ClientEvents } from 'discord.js';

export interface Event {
  name: string;
  execute: (...args: any[]) => void;
} 