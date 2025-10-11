export function sanitizeExpression(expr: string): string | null {
  const sanitized = expr.replace(/[×]/g, '*').replace(/[÷]/g, '/')
  if (/[^0-9\.\+\-\*\/\(\)\s\%]/.test(sanitized)) return null
  return sanitized
}

export function evaluateExpression(expr: string): number {
  // Using Function constructor to avoid eval and keep scope clean
  // eslint-disable-next-line no-new-func
  const fn = new Function('return ' + expr) as () => number
  const value = fn()
  if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
    throw new Error('Invalid calculation result')
  }
  return value
}
