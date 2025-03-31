import { describe, it, expect } from "bun:test";
import prisma from "../../../src/config/database/prisma";

describe('Prisma Client Initialization', () => {
    it('should export an instance of PrismaClient', () => {
        expect(prisma).toBeDefined();
        expect(typeof prisma.$connect).toBe('function');
        expect(typeof prisma.$disconnect).toBe('function');
    });

    it('should set global.prisma when not in production', () => {
        if (process.env.NODE_ENV !== 'production') {
            // Cast global to any to access custom properties.
            expect((global as any).prisma).toBeDefined();
            expect((global as any).prisma).toEqual(prisma);
        }
    });
});