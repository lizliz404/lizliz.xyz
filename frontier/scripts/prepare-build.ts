import { fileURLToPath } from 'node:url';
import { prepareBuild } from './build-assets.ts';
await prepareBuild(fileURLToPath(new URL('../dist/', import.meta.url)));
