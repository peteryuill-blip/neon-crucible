import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { appRouter } from './routers';
import * as db from './db';

describe('Gallery Date Sorting', () => {
  let testWorkIds: number[] = [];
  
  beforeAll(async () => {
    // Create test works with different date formats
    const testWorks = [
      {
        title: 'Work with Full Date 2025-08-15',
        slug: `test-full-date-${Date.now()}-1`,
        year: '2025',
        dateCreated: '2025-08-15',
        phaseId: 30009,
        medium: 'Test Medium',
        isPublished: true,
      },
      {
        title: 'Work with Year Only 2025',
        slug: `test-year-only-${Date.now()}-2`,
        year: '2025',
        dateCreated: null,
        phaseId: 30009,
        medium: 'Test Medium',
        isPublished: true,
      },
      {
        title: 'Work with Full Date 2025-12-31',
        slug: `test-full-date-${Date.now()}-3`,
        year: '2025',
        dateCreated: '2025-12-31',
        phaseId: 30009,
        medium: 'Test Medium',
        isPublished: true,
      },
      {
        title: 'Work with Full Date 2024-06-20',
        slug: `test-full-date-${Date.now()}-4`,
        year: '2024',
        dateCreated: '2024-06-20',
        phaseId: 30009,
        medium: 'Test Medium',
        isPublished: true,
      },
    ];
    
    for (const work of testWorks) {
      await db.createWork(work as any);
      const created = await db.getWorkBySlug(work.slug);
      if (created) testWorkIds.push(created.id);
    }
  });
  
  afterAll(async () => {
    // Clean up test works
    for (const id of testWorkIds) {
      await db.deleteWork(id);
    }
  });
  
  it('should sort by newest date first, prioritizing full dates over year-only', async () => {
    const caller = appRouter.createCaller({ user: null, req: {} as any, res: {} as any });
    
    const result = await caller.gallery.getAll({ sort: 'year-desc' });
    
    const testResults = result.items.filter(w => testWorkIds.includes(w.id));
    
    // Expected order (newest first, full dates before year-only):
    // 1. 2025-12-31 (full date, newest in 2025)
    // 2. 2025-08-15 (full date, older in 2025)
    // 3. 2024-06-20 (older year with full date)
    // 4. 2025 year-only (should come last - no dateCreated)
    
    expect(testResults.length).toBe(4);
    expect(testResults[0].dateCreated).toBe('2025-12-31');
    expect(testResults[1].dateCreated).toBe('2025-08-15');
    expect(testResults[2].dateCreated).toBe('2024-06-20');
    expect(testResults[3].dateCreated).toBeNull(); // Year-only work comes last
    expect(testResults[3].year).toBe('2025');
  });
  
  it('should sort by oldest date first, prioritizing full dates over year-only', async () => {
    const caller = appRouter.createCaller({ user: null, req: {} as any, res: {} as any });
    
    const result = await caller.gallery.getAll({ sort: 'year-asc' });
    
    const testResults = result.items.filter(w => testWorkIds.includes(w.id));
    
    // Expected order (oldest first, full dates before year-only):
    // 1. 2024-06-20 (oldest)
    // 2. 2025-08-15 (full date)
    // 3. 2025-12-31 (full date, newest in 2025)
    // 4. 2025 year-only (should come last)
    
    expect(testResults.length).toBe(4);
    expect(testResults[0].dateCreated).toBe('2024-06-20');
    expect(testResults[1].dateCreated).toBe('2025-08-15');
    expect(testResults[2].dateCreated).toBe('2025-12-31');
    expect(testResults[3].dateCreated).toBeNull(); // Year-only work comes last
    expect(testResults[3].year).toBe('2025');
  });
});
