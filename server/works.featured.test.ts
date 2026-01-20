import { describe, it, expect, beforeAll } from 'vitest';
import { appRouter } from './routers';
import type { TrpcContext } from './routers';

describe('Featured Works Filter', () => {
  const mockContext: TrpcContext = {
    user: null,
    req: {} as any,
    res: {} as any,
  };

  const caller = appRouter.createCaller(mockContext);

  it('should filter works by featured=true', async () => {
    const result = await caller.works.list({
      featured: true,
      limit: 100,
      offset: 0,
    });

    console.log('[TEST] Total results:', result.total);
    console.log('[TEST] Items returned:', result.items.length);
    console.log('[TEST] Featured status:', result.items.map(w => w.featured));
    console.log('[TEST] Titles:', result.items.map(w => w.title));

    // All returned items should have featured=true
    expect(result.items.every(work => work.featured === true)).toBe(true);
    
    // Should return exactly 6 featured works (based on database query)
    expect(result.total).toBe(6);
    expect(result.items.length).toBeLessThanOrEqual(6);
  });

  it('should return all works when featured filter is not specified', async () => {
    const result = await caller.works.list({
      limit: 20,
      offset: 0,
    });

    console.log('[TEST] Total without filter:', result.total);
    console.log('[TEST] Items without filter:', result.items.length);

    // Should return more than 6 works
    expect(result.total).toBeGreaterThan(6);
  });
});
