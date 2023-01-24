import dotenv from 'dotenv';
import { Pogbot } from './Pogbot.js';

dotenv.config();
new Pogbot(process.env.TOKEN as string);
