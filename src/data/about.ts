/**
 * Prose shown on the home and about panels. Kept as data so the HTML
 * panels and their markdown versions (src/lib/md) read the same text.
 * `emphasis` renders in italics after the main text.
 */
export interface Paragraph {
  text: string;
  emphasis?: string;
}

export const heroIntro = {
  lead: 'I build AI-native products end-to-end — the agents and LLM pipelines, and the full stack that ships them.',
  text: 'Three products taken from a blank repo to real users.',
  emphasis: 'No templates, no vapor.',
} as const;

export const aboutParagraphs: Paragraph[] = [
  {
    text: 'I’ve been founding and building things since college. At IIT Roorkee — where I graduated as Department Gold Medalist — I started my first company before finishing my degree. Three companies since: one scaled to 500,000 users, one built from solo founder to a 20+ person team. Now on the founding team at Powerplay, one of India’s fastest-growing construction platforms.',
  },
  {
    text: 'I’m an AI engineer who owns the whole product. At Vignam Labs I ran everything myself for the first two years — the RAG search API, Three.js 3D renderer, live video infrastructure for 200+ concurrent users, a zero-downtime 2TB database migration. Not because I had to, but because I wanted to understand every layer. At Powerplay I’m building the agents and pipelines that turn weeks of construction procurement into minutes.',
    emphasis: 'The models are the easy part — the product loop around them is the hard part.',
  },
  {
    text: 'I also write — about building with AI agents, engineering in founder mode, and the unglamorous parts of shipping real software that lasts.',
  },
  {
    text: 'Away from the keyboard: I was a competitive athlete growing up — Best Athlete (junior category) at school — and still swim and play badminton regularly. I’m also unreasonably obsessive about food: regional cuisines, hole-in-the-wall spots, whatever’s local to wherever I am. The same instinct — find something worth going deep on, then actually go deep — runs through everything.',
  },
];
