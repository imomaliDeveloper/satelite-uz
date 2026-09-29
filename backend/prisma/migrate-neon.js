import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbUrl = process.env.DATABASE_URL || '';
if (!dbUrl || dbUrl.startsWith('file:') || dbUrl.includes('.db')) {
  console.log('[SATELITE Deploy] Local or SQLite database detected. Skipping cloud DB push.');
  process.exit(0);
}

console.log('[SATELITE Deploy] PostgreSQL detected in DATABASE_URL. Syncing schema to cloud database...');
try {
  execSync('npx prisma db push --schema=backend/prisma/schema.prisma --accept-data-loss', {
    stdio: 'inherit',
    env: process.env
  });
  console.log('[SATELITE Deploy] ✅ Schema synchronized to PostgreSQL successfully.');

  console.log('[SATELITE Deploy] Seeding initial questions and admin account...');
  execSync('node backend/src/utils/seed.js', {
    stdio: 'inherit',
    env: process.env
  });
  console.log('[SATELITE Deploy] ✅ Initial seed completed.');
} catch (err) {
  console.warn('[SATELITE Deploy] ⚠️ Database push or seed warning (non-fatal):', err.message);
}
