import { mkdir, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
export async function prepareBuild(output: string) {
  await mkdir(output, { recursive: true });
  // BFCache/cached documents can still name an older hashed asset after a rebuild.
  // Retain only immutable assets; never keep old article HTML, catalogs or raw content.
  for (const entry of await readdir(output)) {
    if (entry !== 'assets') await rm(path.join(output, entry), { recursive: true, force: true });
  }
}
