import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);
const BACKUP_DIR = process.env.BACKUP_DIR || './backups';

async function createBackup() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `goldpay-backup-${timestamp}.sql`;
  const filepath = path.join(BACKUP_DIR, filename);

  const dbUrl = new URL(process.env.DATABASE_URL || 'postgresql://localhost:5432/goldpay_erp');

  console.log(`Creating backup: ${filename}`);
  console.log(`Database: ${dbUrl.hostname}:${dbUrl.port || 5432}/${dbUrl.pathname.slice(1)}`);

  try {
    process.env.PGPASSWORD = dbUrl.password;
    const cmd = [
      'pg_dump',
      `-h ${dbUrl.hostname}`,
      `-p ${dbUrl.port || 5432}`,
      `-U ${dbUrl.username}`,
      '-F c',
      '-v',
      `-f "${filepath}"`,
      dbUrl.pathname.slice(1),
    ].join(' ');

    const { stdout, stderr } = await execAsync(cmd);
    console.log(stdout);

    const stats = fs.statSync(filepath);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`✓ Backup completed: ${filename} (${sizeMB} MB)`);
    console.log(`  Location: ${filepath}`);
  } catch (error) {
    console.error('✗ Backup failed:', error);
    process.exit(1);
  }
}

createBackup();
