import { apiFetch } from './client';
import type {
  Schedule,
  ScheduleList,
  CreateScheduleRequest,
} from './types';

export async function listSchedules(): Promise<Schedule[]> {
  const result = await apiFetch<ScheduleList>('/schedules');
  return result.items;
}

export async function createSchedule(
  data: CreateScheduleRequest,
): Promise<Schedule> {
  return apiFetch<Schedule>('/schedules', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
