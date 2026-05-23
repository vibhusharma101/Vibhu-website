'use client';
import { useState } from 'react';
import { IconMessageCircle, IconX } from '@tabler/icons-react';
import { ChatInterface } from './ChatInterface';

export function ChatPopover() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      {open && (
        <div style={{
          position: 'absolute',
          bottom: '56px',
          right: 0,
          width: '320px',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
          border: '1px solid var(--color-border-subtle)',
          backgroundColor: 'var(--color-bg)',
        }}>
          <ChatInterface />
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close chat' : 'Open chat'}
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-accent)',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-md)',
          transition: 'background-color var(--duration-base)',
        }}
      >
        {open ? <IconX size={20} /> : <IconMessageCircle size={20} />}
      </button>
    </div>
  );
}
