import { Button } from '@mantine/core';

interface SlotChipProps {
  time: string;
  selected: boolean;
  onSelect: () => void;
}

export function SlotChip({ time, selected, onSelect }: SlotChipProps) {
  return (
    <Button
      variant={selected ? 'filled' : 'outline'}
      size="xs"
      radius="md"
      data-selected={selected ? true : undefined}
      onClick={onSelect}
    >
      {time}
    </Button>
  );
}
