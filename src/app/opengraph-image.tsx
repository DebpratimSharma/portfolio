import { ImageResponse } from 'next/og'

// Route segment config - Edge runtime is faster for image generation
export const runtime = 'edge'

// Image metadata
export const alt = 'Debpratim Sharma — Full-Stack Developer Portfolio'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          // Deep black base with dark teal radial glow — matches Hero ColorBends
          background:
            'radial-gradient(ellipse 80% 60% at 50% 60%, #0e4f5f 0%, #083d4c 30%, #041e2a 60%, #000000 100%)',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
          // Subtle cyan-teal perimeter border — matches Hero outline
          border: '1.5px solid rgba(34,211,238,0.35)',
          boxSizing: 'border-box',
        }}
      >
        {/* ── Decorative dot-grid overlay (matches DotField) ── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            display: 'flex',
          }}
        />

        {/* ── Corner accent glows ── */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            left: -120,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,255,255,0.12) 0%, transparent 70%)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -120,
            right: -120,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(14,79,95,0.45) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* ── Content ── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0,
            position: 'relative',
            zIndex: 10,
          }}
        >
          {/* Badge — "Available for work" — matches Hero pill badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 28,
              padding: '6px 20px',
              borderRadius: 9999,
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.05)',
              color: 'rgba(255,255,255,0.7)',
              fontSize: 14,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontWeight: 500,
            }}
          >
            Available for work
          </div>

          {/* "Welcome to" italic subtitle — matches Hero h2 */}
          <div
            style={{
              fontSize: 24,
              color: 'rgba(255,255,255,0.45)',
              fontStyle: 'italic',
              marginBottom: 8,
              display: 'flex',
            }}
          >
            Welcome to
          </div>

          {/* Main title "DEBRIX" — white gradient, bold, Syne-style */}
          <div
            style={{
              fontSize: 120,
              fontWeight: 900,
              letterSpacing: '-0.04em',
              // Simulate the white→white/60→white/30 gradient with a layered text approach
              background: 'linear-gradient(90deg, #ffffff 0%, rgba(255,255,255,0.65) 55%, rgba(255,255,255,0.28) 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              display: 'flex',
              lineHeight: 1,
              marginBottom: 0,
            }}
          >
            DEBPRIX
          </div>

          {/* Full name — cyan accent, matches Hero name line */}
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#22d3ee',
              marginTop: 14,
              display: 'flex',
            }}
          >
            DEBPRATIM SHARMA
          </div>

          {/* Role — white/70, matches Hero p */}
          <div
            style={{
              fontSize: 26,
              color: 'rgba(255,255,255,0.62)',
              marginTop: 18,
              fontWeight: 400,
              letterSpacing: '0.02em',
              display: 'flex',
            }}
          >
            Full-Stack Web Developer
          </div>

          {/* Subtle divider */}
          <div
            style={{
              width: 80,
              height: 2,
              background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.6), transparent)',
              borderRadius: 999,
              marginTop: 28,
              display: 'flex',
            }}
          />

          {/* URL watermark */}
          <div
            style={{
              fontSize: 16,
              color: 'rgba(255,255,255,0.25)',
              marginTop: 18,
              letterSpacing: '0.08em',
              display: 'flex',
            }}
          >
            debprix.vercel.app
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
