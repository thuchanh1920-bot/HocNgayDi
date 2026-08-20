import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const createPrismaClient = () => {
  // Tạo hồ chứa kết nối (Pool) trỏ tới Supabase
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  // Bọc vào Adapter
  const adapter = new PrismaPg(pool);
  // Khởi tạo Prisma Client với Adapter
  return new PrismaClient({ adapter });
};

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;