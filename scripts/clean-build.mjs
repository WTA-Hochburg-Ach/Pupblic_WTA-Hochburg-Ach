import { rm } from 'node:fs/promises';

const directories = ['dist', '.wrangler'];

await Promise.all(
  directories.map(async (directory) => {
    await rm(directory, { recursive: true, force: true });
  }),
);
