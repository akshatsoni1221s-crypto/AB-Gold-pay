import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';

const execAsync = promisify(exec);
const BACKUP_DIR = process.env.BACKUP_DIR || './backups';

async function restoreBackup(filename: string) {
  const filepath = path.join(BACKUP_DIR, filename);

  if (!filename) {
    console.error('Usage: tsx scripts/restore.ts <backup-filename>');
    console.log(`Available backups in ${BACKUP_DIR}:`);
    const fs = await import('fs');
    const files = fs.readdirSync(BACKUP_DIR).filter((f) => f.endsWith('.sql'));
    files.forEach((f) => console.log(`  - ${f}`));
    process.exit(1);
  }

  const dbUrl = new URL(process.env.DATABASE_URL || '');

  console.log(`Restoring from: ${filename}`);
  console.log(`Target database: ${dbUrl.hostname}/${dbUrl.pathname.slice(1)}`);

  const confirm = await prompt(`This will overwrite the database. Continue? (y/N): `);
  if (confirm.toLowerCase() !== 'y') {
    console.log('Restore cancelled.');
    process.exit(0);
  }

  try {
    process.env.PGPASSWORD = dbUrl.password;
    const cmd = [
      'pg_restore',
      `-h ${dbUrl.hostname}`,
      `-p ${dbUrl.port || 5432}`,
      `-U ${dbUrl.username}`,
      '-d',
      dbUrl.pathname.slice(1),
      '--clean',
      '--if-exists',
      '-v',
      `"${filepath}"`,
    ].join(' ');

    const { stdout, stderr } = await execAsync(cmd);
    console.log(stdout);
    console.log('✓ Restore completed successfully!');
  } catch (error) {
    console.error('✗ Restore failed:', error);
    process.exit(1);
  }
}

function prompt(question: string): Promise<string> {
  return new Promise((resolve) => {
    process.stdout.write(question);
    process.stdin.once('data', (data) => resolve(data.toString().trim()));
  });
}

const filename = process.argv[2];
restoreBackup(filename);
