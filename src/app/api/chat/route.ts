import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { VIBHANSHU_SYSTEM_PROMPT } from '@/lib/chat-context';
import { checkRateLimit } from '@/lib/rateLimit';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MessageSchema = z.object({
  role:    z.enum(['user', 'assistant']),
  content: z.string().min(1).max(2000),
});

const RequestSchema = z.object({
  messages: z.array(MessageSchema).min(1).max(20),
});

export async function POST(req: Request) {
  /* Rate limiting */
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const { allowed } = checkRateLimit(ip);
  if (!allowed) {
    return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /* Validate body */
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({ error: 'Chat not configured' }), { status: 503 });
  }

  /* Stream from Anthropic */
  const stream = await client.messages.stream({
    model:      process.env.ANTHROPIC_MODEL ?? 'claude-haiku-4-5-20251001',
    max_tokens: 600,
    system:     VIBHANSHU_SYSTEM_PROMPT,
    messages:   parsed.data.messages,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === 'content_block_delta' &&
          chunk.delta.type === 'text_delta'
        ) {
          controller.enqueue(encoder.encode(chunk.delta.text));
        }
      }
      controller.close();
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(readable, {
    headers: {
      'Content-Type':  'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
    },
  });
}
