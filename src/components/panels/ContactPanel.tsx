'use client';

import { useState } from 'react';
import { bio } from '@/data/bio';
import s from './panels.module.css';

export function ContactPanel() {
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent]       = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio contact from ${name}`);
    const body    = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:${bio.email}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <div className={s.contactBody}>
      <div className={s.termForm}>
        <div className={s.termBar}>
          <div className={s.termBarTitle}>
            <b>contact.sh</b> — send a message
          </div>
          <div style={{ display: 'flex', gap: 5 }}>
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--color-magenta)', display: 'inline-block' }} />
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--color-amber-dim)', display: 'inline-block' }} />
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--color-amber-deep)', display: 'inline-block' }} />
          </div>
        </div>

        <div className={s.termBody}>
          <p className={s.termComment}>
            # Opens your email client pre-filled.{' '}
            <em>Direct line to sharma.vibhu101@gmail.com</em>
          </p>

          <form onSubmit={handleSubmit}>
            <div className={s.termField}>
              <label className={s.termLabel} htmlFor="ct-name">name</label>
              <div className={s.termRow}>
                <span className={s.termPrompt}>›</span>
                <input
                  id="ct-name"
                  className={s.termInput}
                  type="text"
                  placeholder="your name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>
            </div>

            <div className={s.termField}>
              <label className={s.termLabel} htmlFor="ct-email">email</label>
              <div className={s.termRow}>
                <span className={s.termPrompt}>›</span>
                <input
                  id="ct-email"
                  className={s.termInput}
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className={s.termField}>
              <label className={s.termLabel} htmlFor="ct-msg">message</label>
              <div className={s.termRow}>
                <span className={s.termPrompt}>›</span>
                <textarea
                  id="ct-msg"
                  className={s.termTextarea}
                  placeholder="what's on your mind?"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  required
                  rows={3}
                />
              </div>
            </div>

            <div className={s.termFooter}>
              <button type="submit" className={s.btn}>
                send_message
              </button>
              <span className={s.termNote}>
                <em>opens your email client</em>
              </span>
            </div>
          </form>

          {sent && (
            <p className={s.termSuccess}>
              Email client opened. Talk soon.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
