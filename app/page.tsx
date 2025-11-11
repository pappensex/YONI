'use client'

import { useState } from 'react'

export default function Home() {
  const [question, setQuestion] = useState('')
  const [mode, setMode] = useState('Consensus')
  const [autoTranslate, setAutoTranslate] = useState(true)
  const [feed, setFeed] = useState<Array<{ id: number; agent: string; text: string; isFusion?: boolean }>>([])
  const [envMessage, setEnvMessage] = useState('')

  // Check environment on mount
  useState(() => {
    if (typeof window !== 'undefined') {
      setEnvMessage(
        window.location.protocol === 'https:'
          ? 'HTTPS aktiv – Service Worker & Install verfügbar.'
          : 'Hinweis: Für Offline & „Zum Home‑Bildschirm" bitte HTTPS nutzen.'
      )
    }
  })

  const handleInstall = async () => {
    if (typeof window !== 'undefined') {
      if (window.location.protocol !== 'https:') {
        alert('Service Worker benötigt HTTPS.')
        return
      }
      if ('serviceWorker' in navigator) {
        await navigator.serviceWorker.register('/sw.js')
        alert('Offline aktiviert.')
      }
    }
  }

  const handleA2HS = () => {
    alert('iPhone: Safari → Teilen → „Zum Home‑Bildschirm".')
  }

  const handleAsk = () => {
    const q = question.trim()
    if (!q) return

    const answers = [
      { a: 'GPT‑5 Pro', t: `Antwort auf „${q}" — präzise, strukturiert, mit Handlungsempfehlung.` },
      { a: 'CHIBot‑Alpha', t: `Antwort auf „${q}" — intuitiv, visionär, poetisch‑kantig.` },
      { a: 'CHIBot‑Beta', t: `Antwort auf „${q}" — technisch, datengetrieben, scharf.` },
      { a: 'CHIBot‑Omega', t: `Antwort auf „${q}" — synthetisch, meta, systemisch.` },
    ]

    const fuse = (arr: typeof answers, m: string) => {
      if (m === 'Consensus') return 'Konsens: ' + arr.map(x => x.t).join(' | ')
      if (m === 'Contrast') return 'Kontrast: ' + arr.map(x => x.t).join(' ⇄ ')
      return 'Chain: ' + arr.map((x, i) => `[${i + 1}] ${x.t}`).join(' → ')
    }

    const fused = fuse(answers, mode)
    const newFeed = [
      { id: Date.now(), agent: 'Fusion', text: fused, isFusion: true },
      ...answers.map((x, i) => ({ id: Date.now() + i + 1, agent: x.a, text: x.t }))
    ]

    setFeed([...newFeed, ...feed])
  }

  return (
    <div className="wrap">
      <div className="card">
        <h1>YONI • pi² Control</h1>
        <div className="muted">Vercel‑Minimal • Creator‑KI • Auto‑Translate • Transzendenz</div>
        <div className="row">
          <button onClick={handleInstall}>Offline aktivieren</button>
          <button onClick={handleA2HS}>Zum Home‑Bildschirm</button>
        </div>
        <p className="muted">{envMessage}</p>
      </div>

      <div className="card" style={{ marginTop: '16px' }}>
        <h2>Transzendenz</h2>
        <div className="row">
          <select 
            value={mode} 
            onChange={(e) => setMode(e.target.value)}
          >
            <option>Consensus</option>
            <option>Contrast</option>
            <option>Chain</option>
          </select>
          <label className="muted">
            <input 
              type="checkbox" 
              checked={autoTranslate}
              onChange={(e) => setAutoTranslate(e.target.checked)}
            /> Auto‑Translate → Deutsch
          </label>
        </div>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Frag dein Multi‑Kollektiv …"
        />
        <div className="row">
          <button onClick={handleAsk}>Fusion starten</button>
        </div>
        <div className="feed">
          {feed.map((item) => (
            <div key={item.id} className="item">
              <b>{item.agent}</b>: {item.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
