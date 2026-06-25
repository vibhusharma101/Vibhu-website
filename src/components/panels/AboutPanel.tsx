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
            I&apos;m an AI engineer who likes owning the whole product — the agents and LLM
            pipelines, and the full stack around them: backend, frontend, mobile. I studied
            Production &amp; Industrial Engineering at IIT Roorkee, graduated top of my
            department, and started shipping production software in college. I never really stopped.
          </p>
          <p className={s.bioText}>
            These days my work is AI-first. At Powerplay I&apos;m building India&apos;s first AI
            workforce for construction — a set of production AI agents that turn weeks of
            estimation and procurement into minutes. Before that I built a RAG-powered learning
            platform from scratch. The approach hasn&apos;t changed:{' '}
            <em>find the real problem, ship a first version fast, listen, then iterate hard.</em>
          </p>
          <p className={s.bioText}>
            I also write — about building with AI agents, engineering in founder mode, and the
            unglamorous parts of shipping real software that lasts.
          </p>
        </div>

        <aside>
          <div className={s.contactPanel}>
            <div className={s.contactPanelHead}>How to reach</div>
            <ul className={s.contactPanelList}>
              <li className={s.contactPanelItem}>
                <span className={s.contactKey}>email</span>
                <a href={`mailto:${bio.email}`} className={s.contactVal}>{bio.email}</a>
              </li>
              <li className={s.contactPanelItem}>
                <span className={s.contactKey}>github</span>
                <a href={bio.github} target="_blank" rel="noopener noreferrer" className={s.contactVal}>
                  @{bio.handle}
                </a>
              </li>
              <li className={s.contactPanelItem}>
                <span className={s.contactKey}>linkedin</span>
                <a href={bio.linkedin} target="_blank" rel="noopener noreferrer" className={s.contactVal}>
                  vibhanshu-s
                </a>
              </li>
              <li className={s.contactPanelItem}>
                <span className={s.contactKey}>twitter</span>
                <a href={bio.twitter} target="_blank" rel="noopener noreferrer" className={s.contactVal}>
                  @vibhusharma
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
