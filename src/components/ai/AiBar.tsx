import React, { useState } from 'react'
import { naturalLanguageToExpression } from '../../ai/nl'

export function AiBar(props: { history: string[]; onClearHistory: () => void }) {
  const { history, onClearHistory } = props
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!prompt.trim()) return
    setLoading(true)
    setError(null)
    try {
      const expression = await naturalLanguageToExpression(prompt)
      const event = new CustomEvent('nl-expression', { detail: expression })
      window.dispatchEvent(event)
      setPrompt('')
    } catch (err: any) {
      setError(err?.message || 'Failed to parse')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full flex flex-col gap-2">
      <form onSubmit={onSubmit} className="flex items-center gap-2 w-full">
        <input
          aria-label="Ask AI"
          placeholder="Ask: 15% of 240 + 3^2"
          className="flex-1 rounded-lg px-3 py-2 bg-[var(--button-bg)] text-[var(--display-text-color)] outline-none"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          disabled={loading}
          className="rounded-lg px-3 py-2"
          style={{ backgroundColor: 'var(--action-bg)', color: 'var(--action-text-color)' }}
        >{loading ? '...' : 'Go'}</button>
      </form>
      {error && <div className="text-sm text-red-400">{error}</div>}
      <div className="text-xs text-gray-400 flex items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <span>History: {history.length}</span>
          <button type="button" onClick={onClearHistory} className="underline">Clear</button>
        </div>
        <div className="flex items-center gap-2">
          <input 
            placeholder="OpenAI API key"
            className="rounded px-2 py-1 bg-[var(--button-bg)] text-[var(--display-text-color)]"
            onChange={(e) => localStorage.setItem('OPENAI_API_KEY', e.target.value)}
          />
          <button
            type="button"
            className="rounded px-2 py-1 border border-white/10 hover:bg-white/5"
            onClick={() => {
              const theme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light'
              document.documentElement.setAttribute('data-theme', theme || 'light')
            }}
          >Theme</button>
        </div>
      </div>
    </div>
  )
}
