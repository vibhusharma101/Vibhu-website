'use client';
import { useState, useRef, useEffect } from 'react';
import { IconSend } from '@tabler/icons-react';

interface Message {
  id: number;
  text: string;
  sender: 'bot' | 'me';
}

function ChatBubble({ message }: { message: Message }) {
  const isBot = message.sender === 'bot';
  return (
    <div style={{ display: 'flex', justifyContent: isBot ? 'flex-start' : 'flex-end' }}>
      <div style={{
        maxWidth: '80%',
        padding: '8px 12px',
        borderRadius: isBot ? '4px 12px 12px 12px' : '12px 4px 12px 12px',
        backgroundColor: isBot ? 'var(--color-surface)' : 'var(--color-accent)',
        color: isBot ? 'var(--color-text-1)' : '#fff',
        fontSize: 'var(--text-sm)',
        lineHeight: 'var(--line-height-normal)',
      }}>
        {message.text}
      </div>
    </div>
  );
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hi! I'm a bot version of Vibhanshu. Ask me about my skills, projects, or experience.", sender: 'bot' },
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: messages.length + 1, text: input, sender: 'me' };
    const botMsg: Message = { id: messages.length + 2, text: "Thanks for your message! This is a demo bot — check my projects and experience above.", sender: 'bot' };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTimeout(() => setMessages((prev) => [...prev, botMsg]), 900);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '380px' }}>
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--color-border-subtle)',
        fontWeight: 'var(--font-weight-medium)',
        fontSize: 'var(--text-sm)',
        textAlign: 'center',
      }}>
        Chat with Vibhanshu (bot)
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {messages.map((msg) => <ChatBubble key={msg.id} message={msg} />)}
        <div ref={bottomRef} />
      </div>

      <div style={{
        display: 'flex',
        gap: '8px',
        padding: '12px',
        borderTop: '1px solid var(--color-border-subtle)',
      }}>
        <input
          type="text"
          placeholder="Ask me anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          style={{
            flex: 1,
            padding: '8px 12px',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--text-sm)',
            fontFamily: 'var(--font-sans)',
            backgroundColor: 'var(--color-bg)',
            color: 'var(--color-text-1)',
            outline: 'none',
          }}
        />
        <button
          onClick={send}
          aria-label="Send message"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--color-accent)',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <IconSend size={16} />
        </button>
      </div>
    </div>
  );
}
