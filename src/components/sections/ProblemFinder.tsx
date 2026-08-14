'use client'

import { useState, useRef, useCallback } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

/* ── Types ── */

interface SolutionStep {
  label: string
  icon: string
}

interface ProblemOption {
  id: string
  label: string
  icon: string
  solutionFlow: SolutionStep[]
}

/* ── Data ── */

const PROBLEMS: ProblemOption[] = [
  {
    id: 'manual-work',
    label: 'Too much manual work',
    icon: '⏳',
    solutionFlow: [
      { label: 'MANUAL WORK', icon: '⏳' },
      { label: 'TASK ANALYSIS', icon: '🔍' },
      { label: 'WORKFLOW DESIGN', icon: '⚡' },
      { label: 'AUTOMATION', icon: '🤖' },
      { label: 'RESULT', icon: '✅' },
    ],
  },
  {
    id: 'spreadsheets',
    label: 'Too many spreadsheets',
    icon: '📊',
    solutionFlow: [
      { label: 'SPREADSHEETS', icon: '📊' },
      { label: 'DATA MAPPING', icon: '🗺️' },
      { label: 'CENTRALIZED SYSTEM', icon: '🗄️' },
      { label: 'REAL-TIME ACCESS', icon: '🔄' },
      { label: 'RESULT', icon: '✅' },
    ],
  },
  {
    id: 'disconnected',
    label: 'Disconnected systems',
    icon: '🔗',
    solutionFlow: [
      { label: 'SILOS', icon: '🧱' },
      { label: 'INTEGRATION AUDIT', icon: '🔍' },
      { label: 'API LAYER', icon: '🔌' },
      { label: 'UNIFIED PLATFORM', icon: '🌐' },
      { label: 'RESULT', icon: '✅' },
    ],
  },
  {
    id: 'order-management',
    label: 'Difficult order management',
    icon: '📦',
    solutionFlow: [
      { label: 'ORDER CHAOS', icon: '📦' },
      { label: 'PROCESS MAPPING', icon: '🗺️' },
      { label: 'ORDER ENGINE', icon: '⚙️' },
      { label: 'TRACKING', icon: '📡' },
      { label: 'RESULT', icon: '✅' },
    ],
  },
  {
    id: 'poor-visibility',
    label: 'Poor visibility',
    icon: '👁️',
    solutionFlow: [
      { label: 'DATA DARKNESS', icon: '🌑' },
      { label: 'REPORTING DESIGN', icon: '📋' },
      { label: 'DASHBOARDS', icon: '📈' },
      { label: 'INSIGHTS', icon: '💡' },
      { label: 'RESULT', icon: '✅' },
    ],
  },
  {
    id: 'bad-software',
    label: "Existing software doesn't fit",
    icon: '🔧',
    solutionFlow: [
      { label: 'RIGID SOFTWARE', icon: '🔧' },
      { label: 'REQUIREMENTS GAP', icon: '📝' },
      { label: 'CUSTOM BUILD', icon: '🏗️' },
      { label: 'PERFECT FIT', icon: '🎯' },
      { label: 'RESULT', icon: '✅' },
    ],
  },
  {
    id: 'ai-automation',
    label: 'Need AI automation',
    icon: '🧠',
    solutionFlow: [
      { label: 'REPETITIVE TASKS', icon: '🔁' },
      { label: 'AI ASSESSMENT', icon: '🧠' },
      { label: 'MODEL DESIGN', icon: '📐' },
      { label: 'INTELLIGENT SYSTEM', icon: '🤖' },
      { label: 'RESULT', icon: '✅' },
    ],
  },
  {
    id: 'new-platform',
    label: 'Need a new business platform',
    icon: '🚀',
    solutionFlow: [
      { label: 'OUTGROWN TOOLS', icon: '📉' },
      { label: 'ARCHITECTURE DESIGN', icon: '📐' },
      { label: 'PLATFORM BUILD', icon: '🏗️' },
      { label: 'SCALE', icon: '📈' },
      { label: 'RESULT', icon: '✅' },
    ],
  },
  {
    id: 'something-else',
    label: 'Something else',
    icon: '💬',
    solutionFlow: [
      { label: 'UNIQUE CHALLENGE', icon: '🧩' },
      { label: 'DISCOVERY', icon: '🔍' },
      { label: 'STRATEGY', icon: '🎯' },
      { label: 'TAILORED SOLUTION', icon: '🛠️' },
      { label: 'RESULT', icon: '✅' },
    ],
  },
]

/* ── Component ── */

export default function ProblemFinder() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const flowRef = useRef<HTMLDivElement>(null)
  const flowTimeline = useRef<gsap.core.Timeline | null>(null)

  const selectedProblem = PROBLEMS.find((p) => p.id === selectedId) ?? null

  const handleSelect = useCallback(
    (id: string) => {
      if (selectedId === id) {
        setSelectedId(null)
        return
      }
      setSelectedId(id)
    },
    [selectedId],
  )

  useGSAP(
    () => {
      if (!flowRef.current || !selectedProblem) return

      // Kill any running timeline
      flowTimeline.current?.kill()

      const steps = flowRef.current.querySelectorAll<HTMLElement>('[data-flow-step]')
      const connectorEls = flowRef.current.querySelectorAll<HTMLElement>('[data-flow-connector]')
      const cta = flowRef.current.querySelector<HTMLElement>('[data-flow-cta]')

      // Set initial states
      gsap.set(steps, { opacity: 0, y: 20, scale: 0.9 })
      gsap.set(connectorEls, { opacity: 0, scaleX: 0 })
      if (cta) gsap.set(cta, { opacity: 0, y: 12 })

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      steps.forEach((step, i) => {
        tl.to(step, { opacity: 1, y: 0, scale: 1, duration: 0.4 }, i * 0.12)
        if (connectorEls[i]) {
          tl.to(
            connectorEls[i],
            { opacity: 1, scaleX: 1, duration: 0.3 },
            i * 0.12 + 0.15,
          )
        }
      })

      if (cta) {
        tl.to(cta, { opacity: 1, y: 0, duration: 0.4 }, '-=0.1')
      }

      flowTimeline.current = tl
    },
    { scope: flowRef, dependencies: [selectedProblem] },
  )

  return (
    <section
      id="problem-finder"
      className="section relative overflow-hidden"
      style={{ backgroundColor: 'var(--color-primary)' }}
    >
      {/* Subtle grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(var(--color-light) 1px, transparent 1px), linear-gradient(90deg, var(--color-light) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="container relative z-10 mx-auto max-w-[var(--container-max)] px-6 md:px-8 xl:px-12">
        {/* Section Header */}
        <div className="mb-12 md:mb-16">
          <span
            className="label mb-4 inline-block"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--color-muted)',
            }}
          >
            03
          </span>
          <h2
            className="mt-4 max-w-3xl text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-light)',
              letterSpacing: '-0.03em',
            }}
          >
            WHAT IS SLOWING{' '}
            <span style={{ color: 'var(--color-accent)' }}>YOUR BUSINESS</span>{' '}
            DOWN?
          </h2>
        </div>

        {/* Problem Cards Grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PROBLEMS.map((problem) => {
            const isSelected = selectedId === problem.id
            return (
              <button
                key={problem.id}
                type="button"
                onClick={() => handleSelect(problem.id)}
                className="group relative flex items-center gap-3 rounded-lg border p-4 text-left transition-all duration-300"
                style={{
                  fontFamily: 'var(--font-display)',
                  backgroundColor: isSelected
                    ? 'rgba(46, 74, 249, 0.08)'
                    : 'var(--color-deep-navy)',
                  borderColor: isSelected
                    ? 'var(--color-accent)'
                    : 'var(--color-gray-700)',
                  boxShadow: isSelected ? 'var(--shadow-glow)' : 'none',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'var(--color-gray-600)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'var(--color-gray-700)'
                  }
                }}
              >
                {/* Selection indicator */}
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-sm"
                  style={{
                    backgroundColor: isSelected
                      ? 'var(--color-accent)'
                      : 'rgba(255, 255, 255, 0.05)',
                    color: isSelected ? '#fff' : 'var(--color-muted)',
                    transition: 'all 300ms cubic-bezier(0.25, 0.1, 0.25, 1)',
                  }}
                >
                  {problem.icon}
                </span>
                <span
                  className="text-sm font-medium"
                  style={{
                    color: isSelected ? 'var(--color-light)' : 'var(--color-muted)',
                    transition: 'color 300ms cubic-bezier(0.25, 0.1, 0.25, 1)',
                  }}
                >
                  {problem.label}
                </span>

                {/* Accent bar on left when selected */}
                {isSelected && (
                  <span
                    className="absolute left-0 top-1/2 h-8 w-0.5 -translate-y-1/2 rounded-full"
                    style={{ backgroundColor: 'var(--color-accent)' }}
                  />
                )}
              </button>
            )
          })}
        </div>

        {/* Solution Flow Area */}
        <div
          ref={flowRef}
          className="mt-10 min-h-[200px] overflow-hidden rounded-xl border p-6 md:mt-14 md:p-8"
          style={{
            backgroundColor: 'var(--color-deep-navy)',
            borderColor: 'var(--color-gray-700)',
          }}
        >
          {selectedProblem ? (
            <>
              {/* Flow Label */}
              <p
                className="mb-6 text-xs font-medium uppercase tracking-widest"
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--color-muted)',
                }}
              >
                Solution path for: {selectedProblem.label}
              </p>

              {/* Flow Steps */}
              <div className="flex flex-wrap items-center justify-center gap-y-4">
                {selectedProblem.solutionFlow.map((step, i) => {
                  const isLast = i === selectedProblem.solutionFlow.length - 1
                  return (
                    <div key={step.label} className="flex items-center">
                      {/* Step Node */}
                      <div
                        data-flow-step
                        className="flex flex-col items-center gap-2 rounded-lg border px-4 py-3 md:px-6"
                        style={{
                          backgroundColor: isLast
                            ? 'rgba(46, 74, 249, 0.12)'
                            : 'rgba(255, 255, 255, 0.03)',
                          borderColor: isLast
                            ? 'var(--color-accent)'
                            : 'var(--color-gray-700)',
                          minWidth: '100px',
                        }}
                      >
                        <span className="text-xl md:text-2xl">{step.icon}</span>
                        <span
                          className="whitespace-nowrap text-[10px] font-medium uppercase tracking-wider md:text-xs"
                          style={{
                            fontFamily: 'var(--font-mono)',
                            color: isLast
                              ? 'var(--color-accent)'
                              : 'var(--color-muted)',
                          }}
                        >
                          {step.label}
                        </span>
                      </div>

                      {/* Connector Arrow */}
                      {!isLast && (
                        <div
                          data-flow-connector
                          className="mx-2 flex items-center"
                        >
                          <div
                            className="h-px w-6 md:w-10"
                            style={{ backgroundColor: 'var(--color-gray-600)' }}
                          />
                          <svg
                            width="12"
                            height="8"
                            viewBox="0 0 12 8"
                            fill="none"
                            className="shrink-0"
                          >
                            <path
                              d="M1 4H10M10 4L7 1M10 4L7 7"
                              stroke="var(--color-gray-600)"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* CTA */}
              <div data-flow-cta className="mt-8 text-center">
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 500,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    padding: 'var(--space-3) var(--space-6)',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-accent)',
                    color: '#fff',
                    border: '1px solid var(--color-accent)',
                    cursor: 'pointer',
                    transition:
                      'all 300ms cubic-bezier(0.25, 0.1, 0.25, 1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      'var(--color-accent-hover)'
                    e.currentTarget.style.boxShadow = 'var(--shadow-glow)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      'var(--color-accent)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  TURN THIS INTO A SYSTEM &rarr;
                </button>
              </div>
            </>
          ) : (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div
                className="mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--color-muted)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </div>
              <p
                className="text-sm"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--color-muted)',
                }}
              >
                Select a problem above to see your solution path
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
