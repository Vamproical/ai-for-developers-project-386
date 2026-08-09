import { test as base, expect } from '@playwright/test';
import { cleanupDb } from './api-seed';

base.beforeEach(async () => {
  await cleanupDb();
});

export { base as test, expect };
