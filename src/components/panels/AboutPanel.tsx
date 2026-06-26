import { bio } from '@/data/bio';
import s from './panels.module.css';

export function AboutPanel() {
  return (
    <div className={s.panelBody}>
      <p className={s.codeComment}>about.md — who I am</p>
      <div style={{ height: 36 }} />

      <div className={s.aboutGrid}>
        <div>
          <p className={s.bioText}>
            I&apos;ve been founding and building things since college. At IIT Roorkee — where I
            graduated as Department Gold Medalist — I started my first company before finishing my
            degree. Three companies since: one scaled to 500,000 users, one built from solo founder
            to a 20+ person team. Now on the founding team at Powerplay, one of India&apos;s
            fastest-growing construction platforms.
          </p>
          <p className={s.bioText}>
            I&apos;m an AI engineer who owns the whole product. At Vignam Labs I ran everything
            myself for the first two years — the RAG search API, Three.js 3D renderer, live video
            infrastructure for 200+ concurrent users, a zero-downtime 2TB database migration. Not
            because I had to, but because I wanted to understand every layer. At Powerplay I&apos;m
            building the agents and pipelines that turn weeks of construction procurement into
            minutes.{' '}
            <em>The models are the easy part — the product loop around them is the hard part.</em>
          </p>
          <p className={s.bioText}>
            I also write — about building with AI agents, engineering in founder mode, and the
            unglamorous parts of shipping real software that lasts.
          </p>
          <p className={s.bioText}>
            Away from the keyboard: I was a competitive athlete growing up — Best Athlete (junior
            category) at school — and still swim and play badminton regularly. I&apos;m also
            unreasonably obsessive about food: regional cuisines, hole-in-the-wall spots, whatever&apos;s
            local to wherever I am. The same instinct — find something worth going deep on, then
            actually go deep — runs through everything.
          </p>
        </div>

        <aside>
          <div className={s.contactPanel}>
            <div className={s.contactPanelHead}>How to reach</div>
            <ul className={s.contactPanelList}>
              <li className={s.contactPanelItem}>
                <a href={`mailto:${bio.email}`} className={s.contactPanelLink}>
                  <span className={s.contactKey}>email</span>
                  <span className={s.contactVal}>{bio.email}<span className={s.contactArrow}>↗</span></span>
                </a>
              </li>
              <li className={s.contactPanelItem}>
                <a href={bio.github} target="_blank" rel="noopener noreferrer" className={s.contactPanelLink}>
                  <span className={s.contactKey}>github</span>
                  <span className={s.contactVal}>@{bio.handle}<span className={s.contactArrow}>↗</span></span>
                </a>
              </li>
              <li className={s.contactPanelItem}>
                <a href={bio.linkedin} target="_blank" rel="noopener noreferrer" className={s.contactPanelLink}>
                  <span className={s.contactKey}>linkedin</span>
                  <span className={s.contactVal}>vibhanshu-sharma<span className={s.contactArrow}>↗</span></span>
                </a>
              </li>
              <li className={s.contactPanelItem}>
                <a href={bio.twitter} target="_blank" rel="noopener noreferrer" className={s.contactPanelLink}>
                  <span className={s.contactKey}>twitter / x</span>
                  <span className={s.contactVal}>@viiforwinn<span className={s.contactArrow}>↗</span></span>
                </a>
              </li>
              <li className={s.contactPanelItem}>
                <span className={s.contactKey}>where</span>
                <span className={s.contactVal}>{bio.location}</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
