import 'dotenv/config';
import { CustomInstance } from '#handler';

const instance = new CustomInstance();

await instance.start();
