'use client'
import { useState } from 'react';
import { Affix, Popover, ActionIcon } from '@mantine/core';
import { IconMessageCircle } from '@tabler/icons-react';
import { ChatInterface } from './ChatInterface'; // Assuming you saved the component in this file

export function ChatPopover() {
  // Type the state for the opened boolean
  const [opened, setOpened] = useState<boolean>(false);

  return (
    <Affix position={{ bottom: 20, right: 20 }}>
      <Popover
        opened={opened}
        onChange={setOpened}
        position="top-end"
        width={320}
        shadow="md"
        styles={{ dropdown: { padding: 0, background: 'none', border: 'none' } }}
      >
        <Popover.Target>
          <ActionIcon
            size="xl"
            radius="xl"
            variant="filled"
            color="blue"
            onClick={() => setOpened((o) => !o)}
          >
            <IconMessageCircle size={24} />
          </ActionIcon>
        </Popover.Target>

        <Popover.Dropdown>
          <ChatInterface />
        </Popover.Dropdown>
      </Popover>
    </Affix>
  );
}