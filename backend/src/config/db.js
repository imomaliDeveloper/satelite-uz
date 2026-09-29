import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error']
});

let dbSynced = false;
let dbSyncPromise = null;

export async function ensureDbColumns(force = false) {
  if (dbSynced && !force) return;
  if (dbSyncPromise && !force) return dbSyncPromise;

  dbSyncPromise = (async () => {
    try {
      const dbUrl = process.env.DATABASE_URL || '';
      const isSqlite = dbUrl.startsWith('file:') || dbUrl.includes('.db');

      if (!isSqlite) {
        // PostgreSQL DDL with IF NOT EXISTS (both quoted and unquoted for schema safety)
        await prisma.$executeRawUnsafe(`ALTER TABLE "Exam" ADD COLUMN IF NOT EXISTS "calculatorAllowed" BOOLEAN NOT NULL DEFAULT true;`).catch(() => {});
        await prisma.$executeRawUnsafe(`ALTER TABLE "Exam" ADD COLUMN IF NOT EXISTS "referenceSheetAllowed" BOOLEAN NOT NULL DEFAULT true;`).catch(() => {});
        await prisma.$executeRawUnsafe(`ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "calculatorAllowed" BOOLEAN NOT NULL DEFAULT true;`).catch(() => {});
        await prisma.$executeRawUnsafe(`ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "referenceSheetAllowed" BOOLEAN NOT NULL DEFAULT true;`).catch(() => {});

        await prisma.$executeRawUnsafe(`ALTER TABLE exam ADD COLUMN IF NOT EXISTS "calculatorAllowed" BOOLEAN NOT NULL DEFAULT true;`).catch(() => {});
        await prisma.$executeRawUnsafe(`ALTER TABLE exam ADD COLUMN IF NOT EXISTS "referenceSheetAllowed" BOOLEAN NOT NULL DEFAULT true;`).catch(() => {});
        await prisma.$executeRawUnsafe(`ALTER TABLE question ADD COLUMN IF NOT EXISTS "calculatorAllowed" BOOLEAN NOT NULL DEFAULT true;`).catch(() => {});
        await prisma.$executeRawUnsafe(`ALTER TABLE question ADD COLUMN IF NOT EXISTS "referenceSheetAllowed" BOOLEAN NOT NULL DEFAULT true;`).catch(() => {});
      } else {
        // SQLite safe alter
        try { await prisma.$executeRawUnsafe(`ALTER TABLE "Exam" ADD COLUMN "calculatorAllowed" BOOLEAN NOT NULL DEFAULT 1;`); } catch (_) {}
        try { await prisma.$executeRawUnsafe(`ALTER TABLE "Exam" ADD COLUMN "referenceSheetAllowed" BOOLEAN NOT NULL DEFAULT 1;`); } catch (_) {}
        try { await prisma.$executeRawUnsafe(`ALTER TABLE "Question" ADD COLUMN "calculatorAllowed" BOOLEAN NOT NULL DEFAULT 1;`); } catch (_) {}
        try { await prisma.$executeRawUnsafe(`ALTER TABLE "Question" ADD COLUMN "referenceSheetAllowed" BOOLEAN NOT NULL DEFAULT 1;`); } catch (_) {}
      }
      dbSynced = true;
      console.log('[Database] Verified math tool columns in Exam and Question tables.');
    } catch (err) {
      console.warn('[Database] Column verification notice:', err?.message || err);
      dbSynced = true;
    } finally {
      dbSyncPromise = null;
    }
  })();

  return dbSyncPromise;
}

// Automatically initiate verification non-blocking on startup/import
ensureDbColumns().catch(() => {});

export default prisma;

