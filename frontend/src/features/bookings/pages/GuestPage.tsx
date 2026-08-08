import { Text } from '@mantine/core';
import { SlotBrowser } from '@/features/slots/components/SlotBrowser';
import type { Slot } from '@/shared/api/types';

export function GuestPage() {
  const handleSlotSelect = (_slot: Slot) => {
    // Booking flow will be implemented in issue #8
  };

  return (
    <div>
      <Text size="xl" fw={600} mb="md">Book a Meeting</Text>
      <Text size="sm" c="dimmed" mb="lg">
        Select an available time slot to book a meeting.
      </Text>
      <SlotBrowser onSlotSelect={handleSlotSelect} />
    </div>
  );
}
