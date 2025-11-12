export function isValidExpression(expr) {
  if (typeof expr !== 'string' || !expr.trim()) return false;
  const allowed = /^[0-9+\-*/().\s]+$/;
  return allowed.test(expr);
}

export function safeEval(expr) {
  const cleaned = expr.replace(/\s+/g, '');
  if (!isValidExpression(cleaned)) throw new Error('Expresión inválida');
  if (/\.\.|[^0-9)\]]\s*[+\-*/]{2,}/.test(cleaned)) throw new Error('Expresión con operadores inválidos');
  const normalized = cleaned.replace(/,/g, '.');
  const result = Function(`"use strict"; return (${normalized})`)();
  if (typeof result !== 'number' || !isFinite(result)) throw new Error('Resultado no numérico');
  return result;
}