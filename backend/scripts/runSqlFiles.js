import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { pool } from '../src/config/database.js';
import { logger } from '../src/utils/logger.js';

const DATABASE_DIRECTORY = path.resolve(import.meta.dirname, '../../database');

const runFolder = async (folder) => {
  const directory = path.join(DATABASE_DIRECTORY, folder);
  const files = (await readdir(directory)).filter((file) => file.endsWith('.sql')).sort();

  for (const file of files) {
    await pool.query(await readFile(path.join(directory, file), 'utf8'));
    logger.info(`Ran ${folder}/${file}`);
  }
};

export const runSqlFiles = async (folder) => {
  try {
    await runFolder(folder);
    logger.info(`Finished ${folder}`);
  } catch (error) {
    logger.fatal({ err: error }, `Failed while running ${folder}`);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
};
