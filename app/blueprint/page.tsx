'use client'

import { useEffect, useState } from 'react'
import type {
  ActionItem,
  Blueprint,
  Bot,
  DataLayer,
  PageBlueprint,
  Profile,
  Ritual,
} from '../data/chibot-blueprint'

export default function BlueprintView() {
  const [data, setData] = useState<Blueprint | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBlueprint = async () => {
      try {
        const response = await fetch('/api/blueprint')

        if (!response.ok) {
          throw new Error('Failed to fetch blueprint')
        }

        const json = await response.json()
        setData(json)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      }
    }

    fetchBlueprint()
  }, [])

  if (error) return <div className="p-6">Error loading blueprint.</div>
  if (!data) return <div className="p-6">Loading…</div>

  return (
    <div className="p-6 space-y-8">
      <header className="space-y-2">
        <p className="text-sm text-gray-500">CHIBot Stewardship</p>
        <h1 className="text-3xl font-bold">CHIBot Blueprint (π⁷)</h1>
        <p className="text-gray-700 leading-relaxed max-w-3xl">{data.mission}</p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Pages</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {data.pages.map((page: PageBlueprint) => (
            <article key={page.path} className="border p-4 rounded-lg shadow-sm space-y-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-500">{page.path}</p>
                  <h3 className="font-semibold text-lg">{page.name}</h3>
                </div>
                <span className="text-xs uppercase tracking-wide px-2 py-1 rounded bg-gray-900 text-white">
                  {page.status}
                </span>
              </div>
              <p className="text-sm text-gray-700">{page.focus}</p>
              <p className="text-xs text-gray-500">Owner: {page.owner}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Data Layers</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {data.dataLayers.map((layer: DataLayer) => (
            <article key={layer.name} className="border p-4 rounded-lg shadow-sm space-y-1">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold text-lg">{layer.name}</h3>
                <span className="text-xs uppercase tracking-wide px-2 py-1 rounded bg-gray-900 text-white">
                  {layer.status}
                </span>
              </div>
              <p className="text-sm text-gray-700">{layer.source}</p>
              <p className="text-xs text-gray-500">{layer.cadence} • {layer.retention}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Profiles</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {data.profiles.map((profile: Profile) => (
            <article key={profile.name} className="border p-4 rounded-lg shadow-sm space-y-1">
              <h3 className="font-semibold text-lg">{profile.name}</h3>
              <p className="text-xs text-gray-500 uppercase tracking-wide">{profile.archetype}</p>
              <p className="text-sm text-gray-700">{profile.focus}</p>
              <p className="text-xs text-gray-500">Rituale: {profile.rituals.join(', ')}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Bots</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {data.bots.map((bot: Bot) => (
            <article key={bot.name} className="border p-4 rounded-lg shadow-sm space-y-1">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold text-lg">{bot.name}</h3>
                <span className="text-xs uppercase tracking-wide px-2 py-1 rounded bg-gray-900 text-white">
                  {bot.mode}
                </span>
              </div>
              <p className="text-sm text-gray-700">{bot.promise}</p>
              <p className="text-xs text-gray-500">Links: {bot.links.join(' • ')}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Rituale</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {data.rituals.map((ritual: Ritual) => (
            <article key={ritual.title} className="border p-4 rounded-lg shadow-sm space-y-1">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold text-lg">{ritual.title}</h3>
                <span className="text-xs uppercase tracking-wide px-2 py-1 rounded bg-gray-900 text-white">
                  {ritual.cadence}
                </span>
              </div>
              <p className="text-sm text-gray-700">{ritual.description}</p>
              <p className="text-xs text-gray-500">Signals: {ritual.signals.join(', ')}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Actions</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {data.actions.map((action: ActionItem) => (
            <article key={action.title} className="border p-4 rounded-lg shadow-sm space-y-1">
              <h3 className="font-semibold text-lg">{action.title}</h3>
              <p className="text-sm text-gray-700">Impact: {action.impact}</p>
              <p className="text-xs text-gray-500">Owner: {action.owner}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
