import React, { useEffect, useMemo, useRef, useState } from 'react'
import { evaluateExpression, sanitizeExpression } from '../lib/math'
import { AiBar } from '../components/ai/AiBar'

const BUTTONS: Array<{ key: string; label: string; type: 'number' | 'operator' | 'action' | 'parentheses' }> = [
  { key: 'AC', label: 'AC', type: 'action' },
  { key: '()', label: '( )', type: 'parentheses' },
  { key: '%', label: '%', type: 'operator' },
  { key: '/', label: '÷', type: 'operator' },
  { key: '7', label: '7', type: 'number' },
  { key: '8', label: '8', type: 'number' },
  { key: '9', label: '9', type: 'number' },
  { key: '*', label: '×', type: 'operator' },
  { key: '4', label: '4', type: 'number' },
  { key: '5', label: '5', type: 'number' },
  { key: '6', label: '6', type: 'number' },
  { key: '-', label: '-', type: 'operator' },
  { key: '1', label: '1', type: 'number' },
  { key: '2', label: '2', type: 'number' },
  { key: '3', label: '3', type: 'number' },
  { key: '+', label: '+', type: 'operator' },
  { key: '0', label: '0', type: 'number' },
  { key: '.', label: '.', type: 'number' },
  { key: 'backspace', label: '⌫', type: 'action' },
  { key: '=', label: '=', type: 'action' },
]

export function Calculator() {
  const [expression, setExpression] = useState('')
  const [result, setResult] = useState('0')
  const [history, setHistory] = useState<string[]>(() => JSON.parse(localStorage.getItem('calculatorHistory') || '[]') as string[])

  const mainDisplayRef = useRef<HTMLDivElement>(null)

  const updateHistory = (entry: string) => {
    setHistory((prev) => {
      const next = [entry, ...prev].slice(0, 50)
      localStorage.setItem('calculatorHistory', JSON.stringify(next))
      return next
    })
  }

  const displayText = expression || result

  const fontSizeRem = useMemo(() => {
    const displayLength = displayText.length
    let fontSize = 3
    if (displayLength > 9) fontSize = 3 * (9 / displayLength)
    return Math.max(fontSize, 1.5)
  }, [displayText])

  function vibrate(duration = 10) {
    if ('vibrate' in navigator) navigator.vibrate(duration)
  }

  function handleParentheses(current: string): string {
    const open = (current.match(/\(/g) || []).length
    const close = (current.match(/\)/g) || []).length
    const last = current.slice(-1)
    if (last === '' || last === '(' || ['+','-','*','/','%'].includes(last)) return current + '('
    if (open > close) return current + ')'
    return current + '*('
  }

  function handleAction(action: string) {
    switch (action) {
      case '=': {
        if (!expression) return
        const sanitized = sanitizeExpression(expression)
        if (sanitized === null) {
          setResult('Error')
          setExpression('')
          return
        }
        try {
          const value = evaluateExpression(sanitized)
          updateHistory(`${expression} = ${value}`)
          setResult(String(value))
          setExpression('')
          vibrate(20)
        } catch {
          setResult('Error')
          setExpression('')
        }
        return
      }
      case 'AC':
        setExpression('')
        setResult('0')
        return
      case 'backspace':
        setExpression((s) => s.slice(0, -1))
        return
    }
  }

  function onButtonPress(btn: typeof BUTTONS[number], ev?: React.MouseEvent) {
    vibrate()
    if ((result === 'Error')) {
      setResult('0')
      setExpression('')
    }
    if (btn.type === 'number' || btn.type === 'operator') {
      setExpression((s) => (s === '0' && btn.key !== '.' ? btn.key : s + btn.key))
    } else if (btn.type === 'parentheses') {
      setExpression((s) => handleParentheses(s))
    } else if (btn.type === 'action') {
      handleAction(btn.key)
    }
  }

  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      const keyMap: Record<string, string> = {
        Enter: '=', Escape: 'AC', Backspace: 'backspace',
        '0': '0', '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
        '.': '.', '+': '+', '-': '-', '*': '*', '/': '/', '%': '%', '(': '()', ')': '()'
      }
      const mapped = keyMap[e.key]
      if (!mapped) return
      e.preventDefault()
      const target = BUTTONS.find((b) => b.key === mapped)
      if (target) onButtonPress(target)
    }
    window.addEventListener('keydown', keyHandler)
    return () => window.removeEventListener('keydown', keyHandler)
  }, [expression, result])

  useEffect(() => {
    const onNl = (e: Event) => {
      const ce = e as CustomEvent<string>
      const expr = ce.detail
      if (!expr) return
      const sanitized = sanitizeExpression(expr)
      if (!sanitized) {
        setResult('Error')
        setExpression('')
        return
      }
      try {
        const value = evaluateExpression(sanitized)
        updateHistory(`${sanitized} = ${value}`)
        setResult(String(value))
        setExpression('')
      } catch {
        setResult('Error')
        setExpression('')
      }
    }
    window.addEventListener('nl-expression', onNl as EventListener)
    return () => window.removeEventListener('nl-expression', onNl as EventListener)
  }, [])

  return (
    <div className="calculator-body w-full h-full md:max-w-sm md:rounded-[40px] shadow-2xl flex flex-col p-4 md:p-6" role="application" aria-label="Calculator" style={{ backgroundColor: 'var(--calculator-bg)' }}>
      <div className="flex justify-between items-center h-12 px-2 text-gray-400">
        <AiBar history={history} onClearHistory={() => { setHistory([]); localStorage.removeItem('calculatorHistory') }} />
      </div>

      <div className="w-full text-right px-2 select-text flex-grow flex flex-col justify-end" aria-live="polite">
        <div className="h-8 text-lg md:text-xl" style={{ color: 'var(--sub-display-text-color)' }} />
        <div ref={mainDisplayRef} className="font-bold break-words" style={{ color: 'var(--display-text-color)', fontSize: `${fontSizeRem}rem` }}>{displayText}</div>
      </div>

      <div className="pt-4">
        <div className="grid grid-cols-4 gap-3 md:gap-4">
          {BUTTONS.map((b) => (
            <button key={b.key} onClick={(e) => onButtonPress(b, e)} className="calc-button h-16 md:h-20 rounded-full text-2xl md:text-3xl" data-key={b.key} data-type={b.type} style={{
              backgroundColor: b.type === 'action' && b.key !== 'backspace' ? 'var(--action-bg)' : 'var(--button-bg)',
              color: b.type === 'operator' ? 'var(--operator-text-color)' : b.type === 'action' && b.key !== 'backspace' ? 'var(--action-text-color)' : 'var(--button-text-color)'
            }}>
              {b.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
