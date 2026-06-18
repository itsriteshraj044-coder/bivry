import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin } from 'lucide-react'
import { Header } from './Header/Header'
import { Footer } from './Footer'
import { InnerHero, PageCTA, NAVY, GREEN, CREAM, ease } from './InnerHero'

/* ── Content model ──
 * A section is a heading plus body content.
 * `body` is an array of paragraphs (strings) and/or a bullet list.
 */
export interface LegalSection {
  id: string
  heading: string
  paragraphs?: string[]
  bullets?: string[]
  bulletsLead?: string   // sentence introducing the bullet list
}

export interface LegalPageProps {
  badge: string
  titleLine1: string
  titleLine2: string
  lastUpdated: string
  intro: string          // opening paragraph above the first section
  sections: LegalSection[]
}

export function LegalPage({ badge, titleLine1, titleLine2, lastUpdated, intro, sections }: LegalPageProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? '')

  /* Highlight the section currently in view in the sidebar TOC */
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    )
    sections.forEach(s => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [sections])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 96
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    <div style={{ background: CREAM, overflowX: 'hidden' }}>
      <Header />
      <main>

        <InnerHero
          badge={badge}
          line1={titleLine1}
          line2={titleLine2}
          description={`Last updated: ${lastUpdated}. Please read this document carefully before using the Bivry website and services.`}
        />

        {/* ── Document body ── */}
        <section style={{ background: '#fff', padding: 'clamp(56px,8vw,110px) clamp(24px,5vw,80px)' }}>
          <div className="legal-wrap">

            {/* Sticky TOC sidebar (desktop only) */}
            <aside className="legal-toc">
              <div style={{ position: 'sticky', top: 110 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 20 }}>
                  <div style={{ width: 3, height: 13, background: GREEN, borderRadius: 2 }} />
                  <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'rgba(8,33,60,0.38)' }}>
                    On This Page
                  </span>
                </div>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {sections.map(s => {
                    const active = activeId === s.id
                    return (
                      <button
                        key={s.id}
                        onClick={() => scrollTo(s.id)}
                        style={{
                          textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer',
                          padding: '7px 0 7px 14px',
                          borderLeft: `2px solid ${active ? GREEN : 'rgba(8,33,60,0.10)'}`,
                          fontSize: 13, lineHeight: 1.4,
                          fontWeight: active ? 700 : 500,
                          color: active ? NAVY : 'rgba(8,33,60,0.5)',
                          transition: 'color 0.18s ease, border-color 0.18s ease',
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = NAVY }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = active ? NAVY : 'rgba(8,33,60,0.5)' }}
                      >
                        {s.heading}
                      </button>
                    )
                  })}
                </nav>
              </div>
            </aside>

            {/* Article */}
            <article className="legal-article">

              {/* Last updated pill + intro */}
              <motion.div
                initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.6, ease }}
                style={{ marginBottom: 'clamp(36px,4vw,56px)' }}
              >
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'rgba(60,185,140,0.10)', border: '1px solid rgba(60,185,140,0.28)',
                  borderRadius: 100, padding: '7px 16px', marginBottom: 28,
                  fontSize: 11, fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: NAVY,
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: GREEN }} />
                  Last Updated: {lastUpdated}
                </span>
                <p style={{
                  fontSize: 'clamp(15px,1.25vw,18px)', color: 'rgba(8,33,60,0.66)',
                  lineHeight: 1.85, margin: 0, fontWeight: 500,
                }}>
                  {intro}
                </p>
              </motion.div>

              {/* Sections */}
              {sections.map((s, i) => (
                <motion.div
                  key={s.id}
                  id={s.id}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.5, ease }}
                  style={{ scrollMarginTop: 96, marginBottom: 'clamp(34px,3.5vw,52px)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <span style={{
                      fontSize: 11, fontWeight: 900, letterSpacing: '1.5px',
                      color: 'rgba(8,33,60,0.25)', minWidth: 22,
                    }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h2 style={{
                      margin: 0, fontSize: 'clamp(22px,2.6vw,38px)', fontWeight: 900,
                      letterSpacing: '-0.035em', lineHeight: 1.05, color: NAVY,
                      textTransform: 'uppercase',
                    }}>
                      {s.heading}
                    </h2>
                  </div>

                  <div style={{ paddingLeft: 'clamp(0px,2.6vw,34px)' }}>
                    {s.paragraphs?.map((p, j) => (
                      <p key={j} style={{
                        fontSize: 'clamp(14px,1.1vw,16.5px)', color: 'rgba(8,33,60,0.6)',
                        lineHeight: 1.85, margin: j === 0 ? '0 0 14px' : '0 0 14px', maxWidth: 860,
                      }}>
                        {p}
                      </p>
                    ))}

                    {s.bulletsLead && (
                      <p style={{
                        fontSize: 'clamp(14px,1.1vw,16.5px)', color: 'rgba(8,33,60,0.6)',
                        lineHeight: 1.85, margin: '0 0 12px', maxWidth: 860,
                      }}>
                        {s.bulletsLead}
                      </p>
                    )}

                    {s.bullets && (
                      <ul style={{ listStyle: 'none', margin: '0 0 6px', padding: 0, display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 860 }}>
                        {s.bullets.map((b, k) => (
                          <li key={k} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                            <span style={{
                              flexShrink: 0, marginTop: 9, width: 6, height: 6,
                              borderRadius: '50%', background: GREEN,
                            }} />
                            <span style={{ fontSize: 'clamp(14px,1.1vw,16.5px)', color: 'rgba(8,33,60,0.6)', lineHeight: 1.7 }}>
                              {b}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Contact card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, ease }}
                style={{
                  marginTop: 'clamp(40px,5vw,64px)',
                  background: NAVY, borderRadius: 18, padding: 'clamp(28px,3.5vw,48px)',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                <div style={{ position: 'absolute', top: 0, right: 0, width: 240, height: 240, background: `radial-gradient(circle at top right, ${GREEN}1A 0%, transparent 65%)`, pointerEvents: 'none' }} />
                <div style={{ position: 'relative' }}>
                  <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: GREEN }}>
                    Contact Us
                  </span>
                  <p style={{ fontSize: 'clamp(18px,2vw,26px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', margin: '14px 0 24px' }}>
                    EG Transport Pty Ltd (Bivry)
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <a href="mailto:connect@bivry.com.au" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, color: 'rgba(255,255,255,0.78)', textDecoration: 'none', fontSize: 14.5, transition: 'color 0.16s ease' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = GREEN }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.78)' }}>
                      <Mail size={16} strokeWidth={1.6} style={{ color: GREEN, flexShrink: 0 }} /> connect@bivry.com.au
                    </a>
                    <a href="tel:1800054555" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, color: 'rgba(255,255,255,0.78)', textDecoration: 'none', fontSize: 14.5, transition: 'color 0.16s ease' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = GREEN }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.78)' }}>
                      <Phone size={16} strokeWidth={1.6} style={{ color: GREEN, flexShrink: 0 }} /> 1800 054 555
                    </a>
                    <span style={{ display: 'inline-flex', alignItems: 'flex-start', gap: 12, color: 'rgba(255,255,255,0.78)', fontSize: 14.5, lineHeight: 1.6 }}>
                      <MapPin size={16} strokeWidth={1.6} style={{ color: GREEN, flexShrink: 0, marginTop: 3 }} />
                      71 Gipps Street, Collingwood,<br />Melbourne, VIC 3066, Australia
                    </span>
                  </div>
                </div>
              </motion.div>

            </article>
          </div>
        </section>

        <PageCTA line1="QUESTIONS?" line2="GET IN TOUCH." sub="Our team is happy to clarify anything about our policies or services." buttonLabel="Contact Our Team" href="/contact" />

      </main>
      <Footer />

      <style>{`
        .legal-wrap {
          max-width: 1760px; margin: 0 auto;
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: clamp(40px,5vw,90px);
          align-items: start;
        }
        @media (min-width: 1920px) { .legal-wrap { max-width: 1900px; } }
        @media (min-width: 2560px) { .legal-wrap { max-width: 2400px; } }

        /* Tablet & below: drop the sidebar, single column */
        @media (max-width: 1023px) {
          .legal-wrap { grid-template-columns: 1fr; gap: 0; }
          .legal-toc { display: none; }
          .legal-article { max-width: 860px; }
        }
      `}</style>
    </div>
  )
}
