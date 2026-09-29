import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

const schemaPath = path.join(__dirname, 'schema.prisma');
let schemaContent = fs.readFileSync(schemaPath, 'utf8');

const dbUrl = process.env.DATABASE_URL || '';
const isSqlite = dbUrl.startsWith('file:') || dbUrl.includes('.db');

if (isSqlite) {
  schemaContent = schemaContent.replace(/provider\s*=\s*"postgresql"/g, 'provider = "sqlite"');
  console.log('[SATELITE Database] Configured Prisma for SQLite (Local File Database).');
} else {
  schemaContent = schemaContent.replace(/provider\s*=\s*"sqlite"/g, 'provider = "postgresql"');
  console.log('[SATELITE Database] Configured Prisma for PostgreSQL.');
}

fs.writeFileSync(schemaPath, schemaContent, 'utf8');
