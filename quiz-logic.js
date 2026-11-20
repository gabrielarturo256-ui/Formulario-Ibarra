import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const $ = s => document.querySelector(s);
const DIFF = { easy: { label: 'Fácil', n: 15, pts: 10 }, normal: { label: 'Normal', n: 15, pts: 20 }, hard: { label: 'Difícil', n: 15, pts: 30 } };
const TOPIC = { norm: 'Normalización', keys: 'Tipos de claves', qs: 'QuickSQL' };

// ---------- Firebase ----------
const cfg = window.FIREBASE_CONFIG;
const configOK = cfg && !String(cfg.apiKey).startsWith('PON_');
const db = configOK ? getFirestore(initializeApp(cfg)) : null;

// ---------- Utilidades ----------
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
function shuffle(a) { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } return a; }
function show(id) { ['start', 'quiz', 'result'].forEach(s => $('#' + s).classList.toggle('hidden', s !== id)); }

// Preguntas distintas por partida: muestreo aleatorio + opciones barajadas
function buildQuiz(diff) {
    return shuffle(QUESTIONS[diff]).slice(0, DIFF[diff].n).map(q => {
        const correct = q.o[q.a];
        const opts = shuffle(q.o);
        return { t: q.t, q: q.q, opts, a: opts.indexOf(correct), e: q.e };
    });
}

// ---------- Juego ----------
let state = {};

function start() {
    const name = $('#name').value.trim().slice(0, 20);
    if (!name) { alert('Escribe tu nombre'); return; }
    const diff = $('#diff').value;
    state = { name, diff, qs: buildQuiz(diff), i: 0, score: 0, miss: {}, answered: false };
    show('quiz');
    renderQ();
}

function renderQ() {
    const s = state, q = s.qs[s.i];
    $('#prog').style.width = (s.i / s.qs.length * 100) + '%';
    $('#counter').textContent = `Pregunta ${s.i + 1} de ${s.qs.length} · ${DIFF[s.diff].label}`;
    $('#topic').textContent = TOPIC[q.t];
    $('#qtext').textContent = q.q;
    $('#opts').innerHTML = '';
    q.opts.forEach((o, k) => {
        const b = document.createElement('button');
        b.className = 'opt';
        b.textContent = o;
        b.onclick = () => answer(k);
        $('#opts').appendChild(b);
    });
    $('#expl').classList.add('hidden');
    $('#next').classList.add('hidden');
    s.answered = false;
}

function answer(k) {
    const s = state;
    if (s.answered) return;
    s.answered = true;
    const q = s.qs[s.i];
    const btns = [...$('#opts').children];
    btns.forEach(b => b.disabled = true);
    btns[q.a].classList.add('ok');
    if (k === q.a) {
        s.score += DIFF[s.diff].pts;
    } else {
        btns[k].classList.add('bad');
        s.miss[q.t] = (s.miss[q.t] || 0) + 1;
    }
    $('#expl').innerHTML = `<b>${k === q.a ? '¡Correcto!' : 'Incorrecto.'}</b> ${esc(q.e)}`;
    $('#expl').classList.remove('hidden');
    $('#next').textContent = s.i + 1 < s.qs.length ? 'Siguiente →' : 'Ver resultado';
    $('#next').classList.remove('hidden');
}

$('#next').onclick = () => {
    state.i++;
    if (state.i < state.qs.length) renderQ(); else finish();
};

async function finish() {
    const s = state;
    show('result');
    $('#who').textContent = s.name;
    $('#final').textContent = `${s.score} / ${s.qs.length * DIFF[s.diff].pts} puntos`;
    $('#review').innerHTML = Object.keys(THEORY).map(t => `
    <details class="card" ${s.miss[t] ? 'open' : ''}>
      <summary><b>${THEORY[t].title}</b>${s.miss[t] ? ` · ⚠ fallaste ${s.miss[t]}` : ''}</summary>
      <ul>${THEORY[t].points.map(p => `<li>${p}</li>`).join('')}</ul>
    </details>`).join('');
    await saveScore(s);
}

async function saveScore(s) {
    if (!db) { $('#save').textContent = 'Ranking no configurado: completa firebase-config.js.'; return; }
    $('#save').textContent = 'Guardando puntaje…';
    try {
        await addDoc(collection(db, 'scores'), { name: s.name, score: s.score, diff: s.diff, date: Date.now() });
        $('#save').textContent = 'Puntaje guardado ✔';
        await loadBoard();
    } catch (e) {
        $('#save').textContent = 'Error al guardar: ' + e.message;
    }
}

// ---------- Ranking ----------
let boardDiff = 'easy';

async function loadBoard() {
    const body = $('#board');
    document.querySelectorAll('#tabs button').forEach(b => b.classList.toggle('ghost', b.dataset.d !== boardDiff));
    if (!db) { body.innerHTML = '<tr><td colspan="3">Configura Firebase para ver el ranking.</td></tr>'; return; }
    body.innerHTML = '<tr><td colspan="3">Cargando…</td></tr>';
    try {
        const snap = await getDocs(query(collection(db, 'scores'),
            where('diff', '==', boardDiff), orderBy('score', 'desc'), limit(10)));
        const rows = snap.docs.map(d => d.data());
        body.innerHTML = rows.length
            ? rows.map((r, i) => `<tr><td>${i + 1}</td><td>${esc(r.name)}</td><td>${r.score}</td></tr>`).join('')
            : '<tr><td colspan="3">Aún no hay puntajes en este nivel.</td></tr>';
    } catch (e) {
        body.innerHTML = `<tr><td colspan="3">Error: ${esc(e.message)}</td></tr>`;
    }
}

document.querySelectorAll('#tabs button').forEach(b => {
    b.onclick = () => { boardDiff = b.dataset.d; loadBoard(); };
});
$('#go').onclick = start;
$('#name').addEventListener('keydown', e => { if (e.key === 'Enter') start(); });
$('#again').onclick = () => { show('start'); };

show('start');
loadBoard();