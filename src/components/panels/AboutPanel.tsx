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
            I grew up wanting to build things end-to-end. B.Tech in Production &amp; Industrial
            Engineering at IIT Roorkee — GPA 9.007, department gold medalist. Started shipping
            production software in college and never stopped.
          </p>
          <p className={s.bioText}>
            Three companies in, the pattern is the same:{' '}
            <em>find the wedge, ship the first version, listen, iterate hard.</em>{' '}
            Right now that pattern is pointed at AI automation in construction tech.
          </p>
          <p className={s.bioText}>
            I write occasionally about founder-mode engineering, AI products, and the
            unfashionable parts of building real software.
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
