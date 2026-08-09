import { test as base } from '@playwright/test';
import { cleanupDb } from './api-seed';
import type { ApiSeedEventType, ApiSeedSchedule } from './api-seed';
import { seedEventType, seedSchedule } from './api-seed';

export interface TestFixtures {
  apiSeed: {
    eventType: (data: Omit<ApiSeedEventType, 'id'>) => Promise<ApiSeedEventType>;
    schedule: (data: Omit<ApiSeedSchedule, 'id'>) => Promise<ApiSeedSchedule>;
  };
}

export const test = base.extend<TestFixtures>({
  apiSeed: async ({}, use) => {
    const apiSeed: TestFixtures['apiSeed'] = {
      eventType: (data) => seedEventType(data),
      schedule: (data) => seedSchedule(data),
    };
    await use(apiSeed);
  },
});

test.beforeEach(async () => {
  await cleanupDb();
});

export { expect } from '@playwright/test';
