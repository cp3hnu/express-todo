import path from 'node:path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename);

export const dirJoin = (...args) => {
  return path.join(__dirname, "../../", ...args)
}
