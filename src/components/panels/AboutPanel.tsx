import { bio } from '@/data/bio';
import { aboutParagraphs } from '@/data/about';
import s from './panels.module.css';

export function AboutPanel() {
  return (
    <div className={s.panelBody}>
      <p className={s.codeComment}>about.md — who I am</p>
      <div style={{ height: 36 }} />

      <div className={s.aboutGrid}>
        <div>
          {aboutParagraphs.map(p => (
            <p key={p.text} className={s.bioText}>
              {p.text}
              {p.emphasis && <>{' '}<em>{p.emphasis}</em></>}
            </p>
          ))}
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
