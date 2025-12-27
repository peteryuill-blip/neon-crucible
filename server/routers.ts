import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import * as db from "./db";
import { storagePut } from "./storage";
import { nanoid } from "nanoid";

// Admin check middleware
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ============ PHASES ============
  phases: router({
    list: publicProcedure.query(async () => {
      return db.getAllPhases();
    }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getPhaseById(input.id);
      }),
    
    getByCode: publicProcedure
      .input(z.object({ code: z.string() }))
      .query(async ({ input }) => {
        return db.getPhaseByCode(input.code);
      }),
    
    getWorkThumbnails: publicProcedure
      .input(z.object({ phaseId: z.number(), limit: z.number().optional().default(3) }))
      .query(async ({ input }) => {
        return db.getWorksByPhaseId(input.phaseId, input.limit);
      }),
    
    create: adminProcedure
      .input(z.object({
        code: z.string().min(1).max(16),
        title: z.string().min(1).max(255),
        year: z.string().min(1).max(16),
        description: z.string().optional(),
        emotionalTemperature: z.string().optional(),
        color: z.string().optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.createPhase(input);
        return { success: true };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        code: z.string().min(1).max(16).optional(),
        title: z.string().min(1).max(255).optional(),
        year: z.string().min(1).max(16).optional(),
        description: z.string().optional(),
        emotionalTemperature: z.string().optional(),
        color: z.string().optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updatePhase(id, data);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deletePhase(input.id);
        return { success: true };
      }),
  }),

  // ============ WORKS ============
  works: router({
    list: publicProcedure
      .input(z.object({
        phaseId: z.number().optional(),
        technique: z.string().optional(),
        emotionalRegister: z.string().optional(),
        seriesName: z.string().optional(),
        search: z.string().optional(),
        sortBy: z.enum(['phase', 'date_newest', 'date_oldest', 'title', 'random']).optional().default('phase'),
        limit: z.number().min(1).max(100).optional().default(12),
        offset: z.number().min(0).optional().default(0),
      }).optional())
      .query(async ({ input }) => {
        const filter = { ...input, isPublished: true };
        const [items, total] = await Promise.all([
          db.getWorks(filter),
          db.getWorksCount(filter),
        ]);
        return { items, total, limit: filter.limit, offset: filter.offset };
      }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getWorkById(input.id);
      }),
    
    getDistinctSeries: publicProcedure
      .query(async () => {
        return db.getDistinctSeriesNames();
      }),
    
    create: adminProcedure
      .input(z.object({
        title: z.string().min(1).max(255),
        phaseId: z.number().optional(),
        dateCreated: z.string().optional(),
        technique: z.string().optional(),
        dimensions: z.string().optional(),
        colorPalette: z.string().optional(),
        emotionalRegister: z.string().optional(),
        imageUrl: z.string().optional(),
        imageKey: z.string().optional(),
        thumbnailUrl: z.string().optional(),
        journalExcerpt: z.string().optional(),
        neonReading: z.string().optional(),
        seriesName: z.string().optional(),
        isPublished: z.boolean().optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.createWork(input);
        return { success: true };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(1).max(255).optional(),
        phaseId: z.number().nullable().optional(),
        dateCreated: z.string().optional(),
        technique: z.string().optional(),
        dimensions: z.string().optional(),
        colorPalette: z.string().optional(),
        emotionalRegister: z.string().optional(),
        imageUrl: z.string().optional(),
        imageKey: z.string().optional(),
        thumbnailUrl: z.string().optional(),
        journalExcerpt: z.string().optional(),
        neonReading: z.string().optional(),
        seriesName: z.string().optional(),
        isPublished: z.boolean().optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateWork(id, data);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteWork(input.id);
        return { success: true };
      }),
  }),

  // ============ ESSAYS ============
  essays: router({
    list: publicProcedure
      .input(z.object({ category: z.string().optional() }).optional())
      .query(async ({ input }) => {
        if (input?.category) {
          return db.getEssaysByCategory(input.category);
        }
        return db.getAllEssays(true);
      }),
    
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return db.getEssayBySlug(input.slug);
      }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getEssayById(input.id);
      }),
    
    create: adminProcedure
      .input(z.object({
        title: z.string().min(1).max(255),
        slug: z.string().min(1).max(128),
        description: z.string().optional(),
        content: z.string().optional(),
        category: z.string().optional(),
        phaseId: z.number().optional(),
        isPublished: z.boolean().optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.createEssay(input);
        return { success: true };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(1).max(255).optional(),
        slug: z.string().min(1).max(128).optional(),
        description: z.string().optional(),
        content: z.string().optional(),
        category: z.string().optional(),
        phaseId: z.number().nullable().optional(),
        isPublished: z.boolean().optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateEssay(id, data);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteEssay(input.id);
        return { success: true };
      }),
  }),

  // ============ METAQUESTIONS ============
  metaquestions: router({
    list: publicProcedure.query(async ({ ctx }) => {
      const metaquestions = await db.getAllMetaquestions();
      // Filter out private answers for non-admin users
      const isAdmin = ctx.user?.role === 'admin';
      return metaquestions.map(mq => ({
        ...mq,
        // Hide answer if it's marked private and user is not admin
        answer: (mq.isAnswerPrivate && !isAdmin) ? null : mq.answer,
      }));
    }),
    
    // Admin-only endpoint to get all metaquestions with answers
    listWithAnswers: adminProcedure.query(async () => {
      return db.getAllMetaquestions();
    }),
    
    create: adminProcedure
      .input(z.object({
        question: z.string().min(1),
        answer: z.string().optional(),
        isAnswered: z.boolean().optional(),
        isAnswerPrivate: z.boolean().optional().default(true),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.createMetaquestion(input);
        return { success: true };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        question: z.string().min(1).optional(),
        answer: z.string().optional(),
        isAnswered: z.boolean().optional(),
        isAnswerPrivate: z.boolean().optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateMetaquestion(id, data);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteMetaquestion(input.id);
        return { success: true };
      }),
  }),

  // ============ ARCHIVE FILES ============
  archiveFiles: router({
    list: publicProcedure.query(async () => {
      return db.getAllArchiveFiles(true);
    }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getArchiveFileById(input.id);
      }),
    
    create: adminProcedure
      .input(z.object({
        filename: z.string().min(1).max(255),
        fileType: z.string().optional(),
        fileSize: z.string().optional(),
        fileUrl: z.string().optional(),
        fileKey: z.string().optional(),
        description: z.string().optional(),
        category: z.string().optional(),
        isPublished: z.boolean().optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.createArchiveFile(input);
        return { success: true };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        filename: z.string().min(1).max(255).optional(),
        fileType: z.string().optional(),
        fileSize: z.string().optional(),
        fileUrl: z.string().optional(),
        fileKey: z.string().optional(),
        description: z.string().optional(),
        category: z.string().optional(),
        isPublished: z.boolean().optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateArchiveFile(id, data);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteArchiveFile(input.id);
        return { success: true };
      }),
  }),

  // ============ PRESS CLIPPINGS ============
  pressClippings: router({
    getAll: publicProcedure.query(async () => {
      return db.getAllPressClippings(true);
    }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getPressClippingById(input.id);
      }),
    
    create: adminProcedure
      .input(z.object({
        title: z.string().min(1).max(255),
        source: z.string().min(1).max(128),
        author: z.string().optional(),
        date: z.string().optional(),
        excerpt: z.string().optional(),
        fullText: z.string().optional(),
        url: z.string().optional(),
        imageUrl: z.string().optional(),
        phaseId: z.number().optional(),
        category: z.string().optional(),
        isPublished: z.boolean().optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.createPressClipping(input);
        return { success: true };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(1).max(255).optional(),
        source: z.string().min(1).max(128).optional(),
        author: z.string().optional(),
        date: z.string().optional(),
        excerpt: z.string().optional(),
        fullText: z.string().optional(),
        url: z.string().optional(),
        imageUrl: z.string().optional(),
        phaseId: z.number().nullable().optional(),
        category: z.string().optional(),
        isPublished: z.boolean().optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updatePressClipping(id, data);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deletePressClipping(input.id);
        return { success: true };
      }),
  }),

  // ============ FILE UPLOAD ============
  upload: router({
    // Upload work image
    workImage: adminProcedure
      .input(z.object({
        filename: z.string(),
        contentType: z.string(),
        base64Data: z.string(),
      }))
      .mutation(async ({ input }) => {
        const buffer = Buffer.from(input.base64Data, 'base64');
        const ext = input.filename.split('.').pop() || 'jpg';
        const key = `works/${nanoid()}-${Date.now()}.${ext}`;
        const { url } = await storagePut(key, buffer, input.contentType);
        return { key, url };
      }),
    
    // Upload archive file
    archiveFile: adminProcedure
      .input(z.object({
        filename: z.string(),
        contentType: z.string(),
        base64Data: z.string(),
      }))
      .mutation(async ({ input }) => {
        const buffer = Buffer.from(input.base64Data, 'base64');
        const ext = input.filename.split('.').pop() || 'bin';
        const key = `archive/${nanoid()}-${Date.now()}.${ext}`;
        const { url } = await storagePut(key, buffer, input.contentType);
        return { key, url };
      }),
  }),
});

export type AppRouter = typeof appRouter;
