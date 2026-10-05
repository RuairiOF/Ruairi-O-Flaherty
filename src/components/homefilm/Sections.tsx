import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CASES, CONTACT, DISCIPLINES, EDUCATION, MORE, ROLES, type CaseStudy, type Plate as PlateData, type Stat } from './work'
import { useDublinTime } from './useDublinTime'
import { scrollToY } from './scroll'

export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg className="rh-arrow" viewBox="0 0 16 16" aria-hidden="true">
      {diagonal ? (
        <path d="M4.5 11.5l7-7M5.5 4.5h6v6" fill="none" stroke="currentColor" strokeWidth="1.4" />
      ) : (
        <path d="M2 8h11.5M9 3.5L13.5 8 9 12.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
      )}
    </svg>
  )
}

function Plate({ data, to, cursor = 'View project' }: { data: PlateData; to: string; cursor?: string }) {
  return (
    <Link to={to} className="rh-plate" data-plate data-cursor={cursor} aria-label={`${data.alt}. ${cursor}`}>
      <span className="rh-plate__reveal" data-plate-reveal>
        <span className="rh-plate__move" data-plate-move>
          <img className="rh-plate__img" src={data.colour} alt="" loading="lazy" decoding="async" />
        </span>
      </span>
      <span className="rh-plate__mark rh-plate__mark--tl" aria-hidden="true" />
      <span className="rh-plate__mark rh-plate__mark--tr" aria-hidden="true" />
      <span className="rh-plate__mark rh-plate__mark--bl" aria-hidden="true" />
      <span className="rh-plate__mark rh-plate__mark--br" aria-hidden="true" />
    </Link>
  )
}

function StatValue({ stat }: { stat: Stat }) {
  if (stat.count === undefined) return <>{stat.value}</>
  return (
    <span
      data-count={stat.count}
      data-decimals={stat.decimals ?? 0}
      data-prefix={stat.prefix ?? ''}
      data-suffix={stat.suffix ?? ''}
      aria-label={stat.value}
    >
      {stat.value}
    </span>
  )
}

function Case({ c }: { c: CaseStudy }) {
  const to = `/projects/${c.slug}`
  return (
    <article className={`rh-case${c.flipped ? ' is-flipped' : ''}`} aria-labelledby={`case-${c.slug}`}>
      <div className="rh-case__text">
        <p className="rh-case__index" data-reveal>
          <span className="rh-mono">{c.index}</span>
          <span>{c.role}</span>
        </p>
        <h3 className="rh-case__title" id={`case-${c.slug}`} data-lines>
          {c.title}
        </h3>
        <p className="rh-case__desc" data-reveal>
          {c.desc}
        </p>
        {c.stats ? (
          <dl className="rh-stats">
            {c.stats.map((s) => (
              <div className="rh-stat" key={s.label} data-reveal>
                <dt>{s.label}</dt>
                <dd>
                  <StatValue stat={s} />
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
        {c.facts ? (
          <dl className="rh-stats rh-stats--facts">
            {c.facts.map(([k, v]) => (
              <div className="rh-stat rh-stat--fact" key={k} data-reveal>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        <div className="rh-case__links" data-reveal>
          {c.links.map((l) =>
            l.external ? (
              <a key={l.label} className="rh-link rh-link--quiet" href={l.href} target="_blank" rel="noreferrer">
                {l.label}
                <Arrow diagonal />
              </a>
            ) : (
              <Link key={l.label} className="rh-link" to={l.href}>
                {l.label}
                <Arrow />
              </Link>
            ),
          )}
        </div>
      </div>
      <div className="rh-case__media">
        <div className="rh-case__main">
          <Plate data={c.main} to={to} />
        </div>
        <div
          className={`rh-case__inset rh-case__inset--${c.inset.kind} rh-case__inset--${c.flipped ? 'right' : 'left'}`}
          data-inset
        >
          <Plate data={c.inset} to={to} />
        </div>
        <p className="rh-case__cap" data-reveal>
          {c.main.caption}
        </p>
      </div>
    </article>
  )
}

export function WorkSection() {
  return (
    <section id="work" className="rh-section rh-work" data-nav-tone="ink" aria-labelledby="work-title">
      <header className="rh-head">
        <p className="rh-head__label" data-reveal>
          <span className="rh-mono">01–02</span>
          Work
        </p>
        <h2 className="rh-head__title" id="work-title" data-lines>
          Projects
        </h2>
        <p className="rh-head__aside" data-reveal>
          A shipping service and a 3D-printing shop. There’s a write-up for each, with a few smaller projects below.
        </p>
        <span className="rh-rule" data-rule aria-hidden="true" />
      </header>

      {CASES.map((c) => (
        <Case key={c.slug} c={c} />
      ))}

      <div className="rh-index" aria-labelledby="more-title">
        <div className="rh-index__head">
          <h3 id="more-title" style={{ font: 'inherit', margin: 0 }} data-reveal>
            More projects
          </h3>
          <span className="rh-mono" data-reveal>
            {MORE[0].index}–{MORE[MORE.length - 1].index}
          </span>
          <span className="rh-rule" data-rule aria-hidden="true" />
        </div>
        <ul className="rh-index__list">
          {MORE.map((p, i) => (
            <li className="rh-row" key={p.slug}>
              <Link to={`/projects/${p.slug}`} data-peek={p.image ? i : undefined}>
                <span className="rh-row__n rh-mono">{p.index}</span>
                <span className="rh-row__title">{p.title}</span>
                <span className="rh-row__desc">{p.desc}</span>
                <span className="rh-row__meta">{p.meta}</span>
                <span className="rh-row__go">
                  <Arrow />
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="rh-index__all">
          <Link to="/projects" className="rh-link">
            All projects
            <Arrow />
          </Link>
        </div>
      </div>

      <div className="rh-peek" data-peek-box aria-hidden="true">
        {MORE.map((p, i) =>
          p.image ? <img key={p.slug} src={p.image} alt="" loading="lazy" decoding="async" data-peek-img={i} /> : null,
        )}
      </div>
    </section>
  )
}

export function ExperienceSection() {
  return (
    <section id="experience" className="rh-section rh-xp" data-nav-tone="ink" aria-labelledby="xp-title">
      <header className="rh-head">
        <p className="rh-head__label" data-reveal>
          Experience
        </p>
        <h2 className="rh-head__title" id="xp-title" data-lines>
          Work and study
        </h2>
        <p className="rh-head__aside" data-reveal>
          Recent work alongside my degree.
        </p>
        <span className="rh-rule" data-rule aria-hidden="true" />
      </header>
      <ol className="rh-xp__list">
        {ROLES.map((r) => (
          <li className="rh-xp__row" key={r.where}>
            <span className="rh-xp__when rh-mono" data-reveal>
              {r.when}
            </span>
            <h3 className="rh-xp__where" data-reveal>
              {r.where}
              <small>{r.role}</small>
            </h3>
            <p className="rh-xp__what" data-reveal>
              {r.what}
            </p>
            <span className="rh-xp__tag" data-reveal>
              {r.place}
            </span>
            <span className="rh-rule" data-rule aria-hidden="true" />
          </li>
        ))}
      </ol>
      <div className="rh-xp__foot">
        <p className="rh-xp__edu" data-reveal>
          <strong>Education.</strong> {EDUCATION}
        </p>
        <Link to="/experience" className="rh-link" data-reveal>
          Full experience
          <Arrow />
        </Link>
      </div>
    </section>
  )
}

export function ToolsSection() {
  return (
    <section className="rh-section rh-tools" data-nav-tone="light" aria-labelledby="tools-title">
      <header className="rh-head">
        <p className="rh-head__label" data-reveal>
          Tools
        </p>
        <h2 className="rh-head__title" id="tools-title" data-lines>
          Tools I use
        </h2>
        <p className="rh-head__aside" data-reveal>
          CAD, printers, code and the day-to-day work behind the projects.
        </p>
        <span className="rh-rule" data-rule aria-hidden="true" />
      </header>
      <ol className="rh-spec">
        {DISCIPLINES.map((d) => (
          <li className="rh-spec__row" key={d.name}>
            <span className="rh-spec__n rh-mono" data-reveal>
              {d.index}
            </span>
            <h3 className="rh-spec__name" data-reveal>
              {d.name}
            </h3>
            <p className="rh-spec__what" data-reveal>
              {d.what}
            </p>
            <ul className="rh-spec__tools" aria-label={`${d.name} tools`}>
              {d.tools.map((t) => (
                <li className="rh-chip" key={t} data-chip>
                  {t}
                </li>
              ))}
            </ul>
            <span className="rh-rule" data-rule aria-hidden="true" />
          </li>
        ))}
      </ol>
      <div className="rh-xp__foot">
        <span />
        <Link to="/skills" className="rh-link" data-reveal>
          Skills in more detail
          <Arrow />
        </Link>
      </div>
    </section>
  )
}

export function ContactSection() {
  const time = useDublinTime()
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      window.location.href = `mailto:${CONTACT.email}`
    }
  }
  return (
    <section id="contact" className="rh-section rh-contact" data-nav-tone="ink" aria-labelledby="contact-title">
      <header className="rh-head">
        <p className="rh-head__label" data-reveal>
          Contact
        </p>
        <h2 className="rh-head__title" id="contact-title" data-lines>
          Contact
        </h2>
        <p className="rh-head__aside" data-reveal>
          For a project question, placement or a quick hello, email is best.
        </p>
      </header>
      <a className="rh-mail" href={`mailto:${CONTACT.email}`} data-cursor="Write to me">
        <span className="rh-mail__text" data-lines>
          {CONTACT.email}
        </span>
      </a>
      <div className="rh-contact__row">
        <span className="rh-rule" data-rule aria-hidden="true" style={{ top: 0, bottom: 'auto' }} />
        <div className="rh-contact__cell" data-reveal>
          <span>Email</span>
          <button type="button" className={`rh-copy${copied ? ' is-copied' : ''}`} onClick={copy}>
            <span className="rh-copy__state">
              <span>Copy address</span>
              <span aria-live="polite">{copied ? 'Copied' : ''}</span>
            </span>
          </button>
        </div>
        <div className="rh-contact__cell" data-reveal>
          <span>LinkedIn</span>
          <a className="rh-link rh-link--bare" href={CONTACT.linkedin} target="_blank" rel="noreferrer">
            ruairioflaherty
            <Arrow diagonal />
          </a>
        </div>
        <div className="rh-contact__cell" data-reveal>
          <span>GitHub</span>
          <a className="rh-link rh-link--bare" href={CONTACT.github} target="_blank" rel="noreferrer">
            RuairiOF
            <Arrow diagonal />
          </a>
        </div>
        <div className="rh-contact__cell" data-reveal>
          <span>Local time</span>
          <span>
            <span className="rh-mono">{time}</span> in Dublin
          </span>
        </div>
      </div>
    </section>
  )
}

export function HomeFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="rh-foot" data-nav-tone="ink">
      <p className="rh-foot__mark" data-chars aria-label="Ruairí O’Flaherty">
        Ruairí O’Flaherty
      </p>
      <div className="rh-foot__bar">
        <span className="rh-rule" data-rule aria-hidden="true" />
        <span className="rh-foot__copy">© {year} Ruairí O’Flaherty</span>
        <ul className="rh-foot__links">
          {[
            ['Projects', '/projects'],
            ['Experience', '/experience'],
            ['Skills', '/skills'],
            ['Photos', '/photos'],
          ].map(([label, href]) => (
            <li key={href}>
              <Link to={href} className="rh-roll">
                <span>{label}</span>
                <span aria-hidden="true">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
        <button type="button" className="rh-foot__top" onClick={() => scrollToY(0)}>
          Back to top
          <Arrow />
        </button>
      </div>
    </footer>
  )
}
