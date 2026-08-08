import { SimpleGrid, Card, Text, Group } from '@mantine/core';
import {
  IconCalendarEvent,
  IconCalendarStats,
  IconClock,
  IconSettings,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

const sections = [
  { label: 'Event Types', description: 'Manage your event types', icon: IconCalendarEvent, path: '/admin/event-types' },
  { label: 'Schedules', description: 'Set your availability', icon: IconClock, path: '/admin/schedules' },
  { label: 'Bookings', description: 'View and manage bookings', icon: IconCalendarStats, path: '/admin/bookings' },
  { label: 'Settings', description: 'Configure your preferences', icon: IconSettings, path: '/admin/settings' },
];

export function AdminDashboardPage() {
  const navigate = useNavigate();

  return (
    <div>
      <Text size="xl" fw={600} mb="md">Dashboard</Text>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
        {sections.map((section) => (
          <Card
            key={section.path}
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(section.path)}
          >
            <Group mb="xs">
              <section.icon size={24} />
              <Text fw={600}>{section.label}</Text>
            </Group>
            <Text size="sm" c="dimmed">{section.description}</Text>
          </Card>
        ))}
      </SimpleGrid>
    </div>
  );
}
