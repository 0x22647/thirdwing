import { sanitizeExpression, evaluateExpression } from '../lib/math'

// Very simple offline NL->expression parser with a few patterns as fallback.
// If OPENAI_API_KEY or GROQ_API_KEY are present, we will call the provider.
export async function naturalLanguageToExpression(input: string): Promise<string> {
  const provider = selectProvider()
  if (provider) {
    try {
      const expr = await provider(input)
      return expr
    } catch {
      // fall through to local
    }
  }
  return localParse(input)
}

function selectProvider(): ((input: string) => Promise<string>) | null {
  const openaiKey = (typeof localStorage !== 'undefined' && localStorage.getItem('OPENAI_API_KEY')) || import.meta.env.VITE_OPENAI_API_KEY
  const groqKey = (typeof localStorage !== 'undefined' && localStorage.getItem('GROQ_API_KEY')) || import.meta.env.VITE_GROQ_API_KEY
  if (openaiKey) return (i) => callOpenAI(i, openaiKey)
  if (groqKey) return (i) => callGroq(i, groqKey)
  return null
}

async function callOpenAI(input: string, apiKey: string): Promise<string> {
  const prompt = `You convert math in natural language to a JS-safe arithmetic expression using + - * / % ( ).
No variables, only numbers and operators. No words. No equals. Example: "15% of 240 + 3^2" -> "240*0.15+3*3".
Input: ${input}\nOutput:`
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You output only arithmetic expressions, nothing else.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0
    })
  })
  const json = await res.json()
  const text: string = json.choices?.[0]?.message?.content?.trim?.() || ''
  const sanitized = sanitizeExpression(text)
  if (!sanitized) throw new Error('Model returned invalid expression')
  return sanitized
}

async function callGroq(input: string, apiKey: string): Promise<string> {
  const prompt = `You convert math in natural language to a JS-safe arithmetic expression using + - * / % ( ).
No variables, only numbers and operators. No words. No equals. Example: "15% of 240 + 3^2" -> "240*0.15+3*3".
Input: ${input}\nOutput:`
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: 'You output only arithmetic expressions, nothing else.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0
    })
  })
  const json = await res.json()
  const text: string = json.choices?.[0]?.message?.content?.trim?.() || ''
  const sanitized = sanitizeExpression(text)
  if (!sanitized) throw new Error('Model returned invalid expression')
  return sanitized
}

function localParse(input: string): string {
  let text = input.toLowerCase().trim()
  text = text.replace(/percent/g, '%')
  // 15% of 240 -> 240*0.15
  text = text.replace(/(\d+(?:\.\d+)?)%\s+of\s+(\d+(?:\.\d+)?)/g, (_m, p1, p2) => `${p2}*${Number(p1)/100}`)
  // powers a^b or a to the power of b
  text = text.replace(/(\d+)\s*(?:\^|to the power of)\s*(\d+)/g, (_m, a, b) => `${a}*`.repeat(Number(b)).slice(0,-1))
  text = text.replace(/plus/g, '+').replace(/minus/g, '-').replace(/times|x|multiplied by/g, '*').replace(/divided by|over/g, '/')
  text = text.replace(/[^0-9\.\+\-\*\/\(\)\s]/g, '')
  const sanitized = sanitizeExpression(text)
  if (!sanitized) throw new Error('Could not parse input')
  // Validate by evaluating
  try {
    evaluateExpression(sanitized)
  } catch {
    throw new Error('Could not evaluate parsed expression')
  }
  return sanitized
}
