import './styles.css';
import { isValidExpression, safeEval } from './utils';

const root = document.getElementById('app');

function createApp() {
  const container = document.createElement('div');
  container.className = 'app';
  container.innerHTML = `
    <h1>Generador de Triplo/Cuádruplo</h1>
    <p class='small'>Ingresa una expresión matemática válida (ej. 2+3*4 / (1+1)).</p>
    <div class='grid'>
      <div class='card'>
        <label for='expr'>Expresión</label>
        <input id='expr' type='text' placeholder='Ej: 1+2*(3-4)/2' />
        <label for='mode' style='margin-top:10px'>Tipo de resultado</label>
        <select id='mode'>
          <option value='triplo'>Triplo</option>
          <option value='cuadruplo'>Cuádruplo</option>
          <option value='ambos'>Ambos</option>
        </select>
        <div style='margin-top:12px' class='row'>
          <button id='gen'>Generar</button>
          <button id='clear' class='secondary'>Limpiar formulario</button>
        </div>
        <div style='margin-top:12px'>
          <div><label>Desglose de operaciones</label><div id='breakdown' class='box'></div></div>
          <div style='margin-top:8px'><label>Resultado final</label><div id='final' class='box result'></div></div>
        </div>
      </div>
      <div class='card'>
        <label>Historial</label>
        <div id='history' class='history-list box'></div>
        <p class='note'>El historial se conserva aunque limpies el formulario.</p>
      </div>
    </div>`;
  attachEvents(container);
  return container;
}

function attachEvents(container) {
  const expr = container.querySelector('#expr');
  const mode = container.querySelector('#mode');
  const gen = container.querySelector('#gen');
  const clearBtn = container.querySelector('#clear');
  const breakdown = container.querySelector('#breakdown');
  const finalBox = container.querySelector('#final');
  const historyBox = container.querySelector('#history');

  const HISTORY_KEY = 'gen_history_v1';
  let history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');

  function renderHistory() {
    historyBox.innerHTML = '';
    if (history.length === 0) {
      historyBox.innerHTML = '<div class="small">Sin operaciones</div>';
      return;
    }
    history.slice().reverse().forEach((h) => {
      const it = document.createElement('div');
      it.className = 'item';
      it.innerHTML = `<div><strong>${h.expression}</strong> — <span class='meta'>${new Date(h.date).toLocaleString()}</span></div>
                      <div class='small'>Modo: ${h.mode} — Resultado: ${h.result}</div>`;
      historyBox.appendChild(it);
    });
  }

  function saveToHistory(entry) {
    history.push(entry);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    renderHistory();
  }

  renderHistory();

  gen.addEventListener('click', () => {
    const value = expr.value.trim();
    breakdown.innerText = '';
    finalBox.innerText = '';

    try {
      if (!value) throw new Error('La expresión no puede estar vacía');
      if (!isValidExpression(value)) throw new Error('Expresión inválida. Sólo dígitos, + - * / ( ) y puntos son permitidos');
      const evaluated = safeEval(value);
      const modeVal = mode.value;
      const outputs = {};
      if (modeVal === 'triplo' || modeVal === 'ambos') outputs.triplo = evaluated * 3;
      if (modeVal === 'cuadruplo' || modeVal === 'ambos') outputs.cuadruplo = evaluated * 4;
      const lines = [`Base: ${value} = ${evaluated}`];
      if (outputs.triplo) lines.push(`Triplo: ${evaluated} × 3 = ${outputs.triplo}`);
      if (outputs.cuadruplo) lines.push(`Cuádruplo: ${evaluated} × 4 = ${outputs.cuadruplo}`);
      breakdown.innerText = lines.join('\n');
      finalBox.innerText = Object.entries(outputs).map(([k,v]) => `${k}: ${v}`).join(' | ');
      saveToHistory({ expression: value, mode: modeVal, result: finalBox.innerText, date: Date.now() });
    } catch (err) {
      breakdown.innerText = err.message || 'Error';
      finalBox.innerText = '';
    }
  });

  clearBtn.addEventListener('click', () => {
    expr.value = '';
    breakdown.innerText = '';
    finalBox.innerText = '';
    expr.focus();
  });
}

root.appendChild(createApp());