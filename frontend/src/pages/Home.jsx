import {
  ArrowRight,
  BookOpen,
  MessageCircle,
  Repeat2,
  Search,
  Star,
  Users,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const steps = [
  {
    icon: Users,
    number: '01',
    title: 'Offer a skill',
    description:
      'Share something you know and help someone learn from your experience.',
  },
  {
    icon: Search,
    number: '02',
    title: 'Discover people',
    description:
      'Find users whose skills complement what you want to learn.',
  },
  {
    icon: Repeat2,
    number: '03',
    title: 'Exchange knowledge',
    description:
      'Connect, exchange skills, and learn directly from one another.',
  },
]

const features = [
  {
    icon: BookOpen,
    title: 'Teach what you know',
    description:
      'Add the skills you can offer and let others discover what you can teach.',
  },
  {
    icon: Search,
    title: 'Find what you want to learn',
    description:
      'Explore people offering the skills you are interested in developing.',
  },
  {
    icon: MessageCircle,
    title: 'Connect through exchanges',
    description:
      'Send exchange requests and communicate with matched people.',
  },
  {
    icon: Star,
    title: 'Build trust through reviews',
    description:
      'Rate completed exchanges and help build a stronger learning community.',
  },
]

function Home() {
  return (
    <div className="w-full">

      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-[var(--dark)]">
        {/* Background accents */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full border border-[var(--primary)]/10"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 right-24 h-96 w-96 rounded-full border border-[var(--primary)]/5"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-10 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[var(--primary)]/5 blur-3xl"
        />

        <div className="relative z-10 grid min-h-[520px] items-center gap-12 px-6 py-16 sm:px-10 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-14 lg:py-20">

          {/* Hero copy */}
          <div className="max-w-2xl">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--primary)] sm:text-sm">
              SkillExchange
            </p>

            <h1 className="max-w-2xl text-4xl font-bold leading-[1.08] tracking-tight text-[var(--text-on-dark)] sm:text-5xl lg:text-6xl">
              Learn from others.
              <br />
              Share what you know.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-[var(--text-on-dark-muted)] sm:text-lg">
              Share what you know, discover people with complementary
              skills, and learn together through meaningful skill
              exchanges.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-[var(--dark)] transition-all duration-200 hover:bg-[var(--primary-hover)] hover:-translate-y-0.5"
              >
                Get Started
                <ArrowRight size={17} />
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-lg border border-[var(--text-on-dark-muted)]/20 px-5 py-3 text-sm font-semibold text-[var(--text-on-dark)] transition-all duration-200 hover:border-[var(--primary)] hover:text-[var(--primary)]"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative hidden min-h-[340px] lg:block">

            <div
              aria-hidden="true"
              className="absolute left-8 top-12 h-56 w-72 rounded-2xl border border-[var(--primary)]/15 bg-white/[0.035] backdrop-blur-sm"
            >
              <div className="p-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[var(--primary)]/15" />

                  <div>
                    <div className="h-2.5 w-24 rounded-full bg-[var(--primary)]/60" />
                    <div className="mt-2 h-2 w-16 rounded-full bg-white/10" />
                  </div>
                </div>

                <div className="mt-7 flex gap-2">
                  <div className="rounded-full bg-white/10 px-3 py-1.5 text-[10px] text-white/50">
                    React
                  </div>

                  <div className="rounded-full bg-[var(--primary)]/15 px-3 py-1.5 text-[10px] text-[var(--primary)]">
                    Teaching
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <div className="h-2 w-44 rounded-full bg-white/10" />
                  <div className="h-2 w-32 rounded-full bg-white/10" />
                  <div className="h-2 w-24 rounded-full bg-white/10" />
                </div>
              </div>
            </div>

            <div
              aria-hidden="true"
              className="absolute bottom-2 right-0 h-56 w-72 rounded-2xl border border-[var(--primary)]/15 bg-white/[0.035] backdrop-blur-sm"
            >
              <div className="p-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[var(--primary)]/10" />

                  <div>
                    <div className="h-2.5 w-28 rounded-full bg-[var(--primary)]/60" />
                    <div className="mt-2 h-2 w-20 rounded-full bg-white/10" />
                  </div>
                </div>

                <div className="mt-7 flex gap-2">
                  <div className="rounded-full bg-[var(--primary)]/15 px-3 py-1.5 text-[10px] text-[var(--primary)]">
                    UI/UX
                  </div>

                  <div className="rounded-full bg-white/10 px-3 py-1.5 text-[10px] text-white/50">
                    Learning
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <div className="h-2 w-40 rounded-full bg-white/10" />
                  <div className="h-2 w-28 rounded-full bg-white/10" />
                  <div className="h-2 w-20 rounded-full bg-white/10" />
                </div>
              </div>
            </div>

            <div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--primary)]/30 bg-[var(--dark)] shadow-lg"
            >
              <Repeat2
                size={24}
                strokeWidth={1.8}
                className="text-[var(--primary)]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mt-20 sm:mt-24">
        <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary-hover)] sm:text-sm">
              How it works
            </p>

            <h2 className="mt-3 max-w-md text-2xl font-bold tracking-tight text-[var(--text)] sm:text-3xl">
              A simple way to exchange skills
            </h2>
          </div>

          <p className="max-w-xl text-sm leading-6 text-[var(--text-muted)] lg:ml-auto">
            SkillExchange keeps the process straightforward:
            offer, discover, connect, and learn.
          </p>
        </div>

        <div className="mt-10 grid border-y border-[var(--border)] md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon

            return (
              <div
                key={step.title}
                className={`group px-5 py-7 sm:px-6 ${
                  index !== 0
                    ? 'border-t border-[var(--border)] md:border-l md:border-t-0'
                    : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--primary-subtle)] text-[var(--primary-hover)] transition-colors duration-200 group-hover:bg-[var(--primary)] group-hover:text-[var(--dark)]">
                    <Icon size={18} strokeWidth={1.8} />
                  </div>

                  <span className="text-xs font-semibold tracking-wider text-[var(--text-muted)]">
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-6 text-base font-semibold text-[var(--text)]">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                  {step.description}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Features */}
      <section className="mt-20 sm:mt-24">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary-hover)] sm:text-sm">
            What you can do
          </p>

          <h2 className="mt-3 text-2xl font-bold tracking-tight text-[var(--text)] sm:text-3xl">
            Built around real skill exchange
          </h2>
        </div>

        <div className="mt-10 grid gap-x-8 gap-y-0 sm:grid-cols-2">
          {features.map((feature, index) => {
            const Icon = feature.icon

            return (
              <div
                key={feature.title}
                className={`group flex gap-4 border-[var(--border)] py-7 ${
                  index >= 2 ? 'border-t' : ''
                } ${index % 2 === 1 ? 'sm:border-l sm:pl-8' : ''}`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--background)] text-[var(--text-muted)] transition-colors duration-200 group-hover:bg-[var(--primary-subtle)] group-hover:text-[var(--primary-hover)]">
                  <Icon size={18} strokeWidth={1.8} />
                </div>

                <div>
                  <h3 className="text-base font-semibold text-[var(--text)]">
                    {feature.title}
                  </h3>

                  <p className="mt-2 max-w-md text-sm leading-6 text-[var(--text-muted)]">
                    {feature.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="relative mt-20 overflow-hidden rounded-2xl bg-[var(--dark)] px-6 py-12 text-center sm:mt-24 sm:px-10 sm:py-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--primary)]/10 blur-3xl"
        />

        <div className="relative z-10 mx-auto max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary)] sm:text-sm">
            Start exchanging
          </p>

          <h2 className="mt-3 text-2xl font-bold tracking-tight text-[var(--text-on-dark)] sm:text-3xl">
            Have a skill to share?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[var(--text-on-dark-muted)]">
            Create your profile, list what you can offer, and discover
            people who can help you learn something new.
          </p>

          <Link
            to="/register"
            className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-[var(--dark)] transition-all duration-200 hover:bg-[var(--primary-hover)] hover:-translate-y-0.5"
          >
            Create your account
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home