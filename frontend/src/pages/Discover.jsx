import { useEffect, useState } from 'react'
import {Search,SlidersHorizontal,ChevronDown,ChevronUp,X,} from 'lucide-react'

import SkillCard from '../components/SkillCard'

const API_URL = import.meta.env.VITE_API_URL

async function discoverFetch(path) {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Request failed')
  }

  return data
}

function Discover() {
  const [skill, setSkill] = useState('')
  const [type, setType] = useState('')
  const [proficiency, setProficiency] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [recommendations, setRecommendations] = useState([])
  const [recommendationLoading, setRecommendationLoading] = useState(false)
  const [recommendationError, setRecommendationError] = useState('')

  async function handleSearch() {
    try {
      setHasSearched(true)
      setLoading(true)
      setError('')

      const params = new URLSearchParams()

      if (skill.trim()) {
        params.set('skill', skill.trim())
      }

      if (type) {
        params.set('type', type)
      }

      if (proficiency) {
        params.set('proficiency', proficiency)
      }

      const data = await discoverFetch(
        `/discover/search?${params.toString()}`
      )

      setResults(data.results)
    } catch (error) {
      setError(error.message)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  function clearSearch() {
    setSkill('')
    setType('')
    setProficiency('')
    setResults([])
    setHasSearched(false)
    setError('')
  }

  useEffect(() => {
    async function loadRecommendations() {
      try {
        setRecommendationLoading(true)
        setRecommendationError('')

        const data = await discoverFetch('/discover/recommendations')

        setRecommendations(data.results)
      } catch (error) {
        setRecommendationError(error.message)
      } finally {
        setRecommendationLoading(false)
      }
    }

    loadRecommendations()
  }, [])

  return (
    <div className="space-y-10">
      {/* Header 
      <section>
        <h1 className="text-3xl font-bold text-[var(--accent)]">
          Discover
        </h1>

        <p className="mt-2 text-[var(--text-muted)]">
          Find people to exchange skills with.
        </p>
      </section> */}

      {/* Search */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4 sm:px-6 sm:py-5">
        {/* Search Input */}
        <div className="flex overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] transition focus-within:border-[var(--primary)] focus-within:ring-2 focus-within:ring-[var(--primary)]/10">
          <input
            id="skill"
            type="text"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch()
              }
            }}
            placeholder="Search for a skill..."
            className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-muted)]"
          />
          {hasSearched && (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Clear search"
              className="inline-flex items-center justify-center px-4 text-[var(--text-muted)] transition hover:text-[var(--text)]"
            >
              <X size={19} />
            </button>
          )}
          <button
            type="button"
            onClick={handleSearch}
            aria-label="Search"
            className="inline-flex items-center justify-center px-4 text-[var(--primary)] transition hover:bg-[var(--surface)]"
          >
            <Search size={19} strokeWidth={2} />
          </button>
        </div>

        {/* Filter Toggle */}
        <div className="mt-3 border-t border-[var(--border)] pt-2.5">
          <button
            type="button"
            onClick={() => setShowFilters((current) => !current)}
            className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[var(--text-muted)] transition hover:text-[var(--text)]"
          >
            <SlidersHorizontal size={12} />
            {showFilters ? (
              <ChevronUp size={11} />
            ) : (
              <ChevronDown size={11} />
            )}
          </button>

          {/* Filters */}
          {showFilters && (
            <div className="mt-3 flex flex-wrap items-center gap-8 border-t border-[var(--border)] pt-3">
              {/* Type */}
              <div className="flex items-center gap-2">
                <label
                  htmlFor="type"
                  className="text-xs font-medium text-[var(--text-muted)]"
                >
                  Type
                </label>

                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-24 rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-xs text-[var(--text)] outline-none transition focus:border-[var(--primary)]"
                >
                  <option value="">All</option>
                  <option value="OFFERED">Offered</option>
                  <option value="WANTED">Wanted</option>
                </select>
              </div>

              {/* Proficiency */}
              <div className="flex items-center gap-2">
                <label
                  htmlFor="proficiency"
                  className="text-xs font-medium text-[var(--text-muted)]"
                >
                  Proficiency
                </label>

                <select
                  id="proficiency"
                  value={proficiency}
                  onChange={(e) => setProficiency(e.target.value)}
                  className="w-32 rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-xs text-[var(--text)] outline-none transition focus:border-[var(--primary)]"
                >
                  <option value="">All</option>
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                  <option value="EXPERT">Expert</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Search Results */}
      {hasSearched && (
        <section>
          <div>
            <h2 className="text-xl font-semibold text-[var(--text)]">
              Search Results
            </h2>
          </div>

          <div className="mt-6">
            {loading ? (
              <p className="text-sm text-[var(--text-muted)]">
                Searching...
              </p>
            ) : error ? (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-[var(--error)]">
                {error}
              </p>
            ) : results.length === 0 ? (
              <p className="text-sm text-[var(--text-muted)]">
                No users found matching your search.
              </p>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {results.map((user) => (
                  <SkillCard key={user.id} user={user} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Recommendations */}
      <section>
        <div>
          <h2 className="text-xl font-semibold text-[var(--text)]">
            Recommendations
          </h2>

          <div className="mt-6">
            {recommendationLoading ? (
              <p className="text-sm text-[var(--text-muted)]">
                Loading recommendations...
              </p>
            ) : recommendationError ? (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-[var(--error)]">
                {recommendationError}
              </p>
            ) : recommendations.length === 0 ? (
              <p className="text-sm text-[var(--text-muted)]">
                No recommendations available yet.
              </p>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {recommendations.map((user) => (
                  <SkillCard key={user.id} user={user} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Discover