'use client';

import { useEffect, useRef, useState } from 'react';
import type { ChatMessage } from '@/types/chat';
import s from './chat.module.css';

let msgId = 0;
const nextId = () => String(++msgId);

export function ChatWidget() {
  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const bottomRef               = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = { id: nextId(), role: 'user', content: text };
    const botMsg:  ChatMessage = { id: nextId(), role: 'assistant', content: '', streaming: true };

    setMessages(prev => [...prev, userMsg, botMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));
      const res = await fetch('/api/chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ messages: history }),
      });

      if (!res.ok || !res.body) throw new Error('Request failed');

      const reader = res.body.getReader();
      const dec    = new TextDecoder();
      let acc      = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        setMessages(prev =>
          prev.map(m => m.id === botMsg.id ? { ...m, content: acc } : m)
        );
      }

      setMessages(prev =>
        prev.map(m => m.id === botMsg.id ? { ...m, streaming: false } : m)
      );
    } catch {
      setMessages(prev =>
        prev.map(m =>
          m.id === botMsg.id
            ? { ...m, content: 'Chat unavailable — email me at sharma.vibhu101@gmail.com', streaming: false }
            : m
        )
      );
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  if (!open) {
    return (
      <button
        className={s.trigger}
        onClick={() => setOpen(true)}
        aria-label="Open chat"
      >
        <span className={s.triggerDot} />
        <span className={s.triggerLabel}>ask_vibhanshu_anything</span>
      </button>
    );
  }

  return (
    <div className={s.window} role="dialog" aria-label="Chat with Vibhanshu">
      <div className={s.windowBar}>
        <div className={s.windowBarLeft}>
          <span className={s.windowBarDot} />
          vibhanshu.exe
        </div>
        <button className={s.closeBtn} onClick={() => setOpen(false)} aria-label="Close chat">
          ✕
        </button>
      </div>

      <div className={s.messages}>
        {messages.length === 0 && (
          <div className={s.empty}>
            <span>$ </span>ask me about my work,<br />
            what I&apos;m building, or anything tech.
          </div>
        )}

        {messages.map(msg => (
          <div key={msg.id} className={s.msgRow}>
            <span className={`${s.msgRole} ${msg.role === 'user' ? s.msgRoleUser : s.msgRoleAssistant}`}>
              {msg.role === 'user' ? 'you' : 'vibhanshu'}
            </span>
            <div className={s.msgContent}>
              {msg.content}
              {msg.streaming && <span className={s.msgCursor} aria-hidden />}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className={s.inputRow}>
        <span className={s.inputPrompt}>$</span>
        <input
          className={s.input}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="type your question..."
          disabled={loading}
          autoFocus
          aria-label="Chat input"
        />
        <button
          className={s.sendBtn}
          onClick={send}
          disabled={loading || !input.trim()}
          aria-label="Send"
        >
          {loading ? '…' : '↵'}
        </button>
      </div>
    </div>
  );
}
