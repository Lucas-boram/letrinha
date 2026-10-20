(() => {
  const KEY = 'letrinha.v1';
  const DAILY_GOAL_DEFAULT = 3;
  const VOWELS = ['A', 'E', 'I', 'O', 'U'];
  const set = (c, vs = VOWELS) => vs.map(v => c + v);

  const W = (pic, ...syl) => ({ pic, syl, word: syl.join('') });
  const W1 = [W('🏠', 'CA', 'SA'), W('🐱', 'GA', 'TO'), W('🌙', 'LU', 'A'), W('🍇', 'U', 'VA'), W('🐸', 'SA', 'PO')];
  const W2 = [W('⚽', 'BO', 'LA'), W('🦆', 'PA', 'TO'), W('🎲', 'DA', 'DO'), W('🥾', 'BO', 'TA'), W('🐺', 'LO', 'BO')];
  const W3 = [W('🧳', 'MA', 'LA'), W('🔥', 'FO', 'GO'), W('🐮', 'VA', 'CA'), W('🍲', 'SO', 'PA'), W('🎂', 'BO', 'LO'), W('🛏️', 'CA', 'MA')];
  const W4 = [W('🍌', 'BA', 'NA', 'NA'), W('🐴', 'CA', 'VA', 'LO'), W('🍅', 'TO', 'MA', 'TE'), W('🐵', 'MA', 'CA', 'CO'), W('👞', 'SA', 'PA', 'TO')];
  const W5 = [W('🪆', 'BO', 'NE', 'CA'), W('🐪', 'CA', 'ME', 'LO'), W('🥑', 'A', 'BA', 'CA', 'TE'), W('📞', 'TE', 'LE', 'FO', 'NE'), W('🏴‍☠️', 'PI', 'RA', 'TA')];
  const ALL_SYL = [...new Set([...W1, ...W2, ...W3, ...W4, ...W5].flatMap(w => w.syl))];

  const WORLD_ICON = { 1: '🅰️', 2: '🧩', 3: '📖', 4: '🚀' };
  const WORLDS = { 1: 'Mundo das vogais', 2: 'Mundo das sílabas', 3: 'Primeiras palavras', 4: 'Palavras grandes' };
  const LEVELS = [
    { id: 1, world: 1, title: 'Vogais A, E, I', sub: 'Escute e toque na letra', type: 'listen', pool: ['A', 'E', 'I'], from: VOWELS },
    { id: 2, world: 1, title: 'Vogais O e U', sub: 'Mais duas vogais', type: 'listen', pool: ['O', 'U'], from: VOWELS },
    { id: 3, world: 1, title: 'Todas as vogais', sub: 'Mistura de A a U', type: 'listen', pool: VOWELS, from: VOWELS },
    { id: 4, world: 2, title: 'Sílabas com B', sub: 'BA, BE, BI, BO, BU', type: 'listen', pool: set('B'), from: [...set('B'), ...set('P')] },
    { id: 5, world: 2, title: 'Sílabas com P e M', sub: 'PA, ME, PO, MU...', type: 'listen', pool: [...set('P'), ...set('M')], from: [...set('P'), ...set('M'), ...set('B')] },
    { id: 6, world: 2, title: 'Sílabas com L e T', sub: 'LA, TE, LO, TU...', type: 'listen', pool: [...set('L'), ...set('T')], from: [...set('L'), ...set('T'), ...set('M')] },
    { id: 7, world: 2, title: 'Sílabas com C, S e D', sub: 'CA, SE, DO...', type: 'listen', pool: [...set('C', ['A', 'O', 'U']), ...set('S'), ...set('D')], from: [...set('C', ['A', 'O', 'U']), ...set('S'), ...set('D'), ...set('T')] },
    { id: 8, world: 3, title: 'Primeiras palavras', sub: 'Junte as sílabas', type: 'build', pool: W1 },
    { id: 9, world: 3, title: 'Mais palavras', sub: 'Palavras novas', type: 'build', pool: W2 },
    { id: 10, world: 3, title: 'Qual sílaba falta?', sub: 'Complete a palavra', type: 'missing', pool: [...W1, ...W2] },
    { id: 11, world: 3, title: 'Palavras do dia a dia', sub: 'Casa, mala, sopa...', type: 'build', pool: W3 },
    { id: 12, world: 4, title: 'Três sílabas', sub: 'Banana, cavalo...', type: 'build', pool: W4 },
    { id: 13, world: 4, title: 'Falta uma sílaba', sub: 'Palavras maiores', type: 'missing', pool: [...W3, ...W4] },
    { id: 14, world: 4, title: 'Palavras grandes', sub: 'Com 3 e 4 sílabas', type: 'build', pool: W5 },
  ];

  /* ajuste por idade */
  const AGE = {
    2: { start: 1, opts: 2, extras: 1, rounds: 3, rate: 0.6 },
    3: { start: 1, opts: 2, extras: 1, rounds: 3, rate: 0.65 },
    4: { start: 1, opts: 2, extras: 1, rounds: 4, rate: 0.7 },
    5: { start: 1, opts: 3, extras: 2, rounds: 5, rate: 0.8 },
    6: { start: 4, opts: 3, extras: 2, rounds: 5, rate: 0.85 },
    7: { start: 8, opts: 4, extras: 3, rounds: 5, rate: 0.9 },
    8: { start: 12, opts: 4, extras: 3, rounds: 6, rate: 0.95 },
  };
  const cfg = () => AGE[S.age] || AGE[5];

  const $ = (s, r = document) => r.querySelector(s);
  const app = $('#app');
  const hud = $('#hud');
  const today = () => new Date().toISOString().slice(0, 10);
  const yesterday = () => new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const blank = () => ({ name: '', age: 0, consent: false, stars: 0, streak: 0, lastDay: '', day: today(), played: 0, done: {}, words: [], weak: {}, music: true, goal: 3, log: [] });
  const load = () => { try { return Object.assign(blank(), JSON.parse(localStorage.getItem(KEY))); } catch { return blank(); } };
  let S = load();
  if (S.day !== today()) { S.day = today(); S.played = 0; }
  const save = () => localStorage.setItem(KEY, JSON.stringify(S));

  const shuffle = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const star = (on = true) => `<svg class="${on ? '' : 'off'}" aria-hidden="true"><use href="#star"/></svg>`;

  /* voz e sons */
  /* Voz da Cora: arquivos em audio/ (gerados por tools/gen_audio.py), com a voz do aparelho como reserva */
  const MUSIC_VOL = 0.16, MUSIC_DUCK = 0.05;
  const music = new Audio('audio/music.mp3');
  music.loop = true; music.volume = MUSIC_VOL; music.preload = 'none';
  const applyMusic = () => { if (S.music) music.play().catch(() => {}); else music.pause(); };
  addEventListener('pointerdown', applyMusic, { once: true });

  let voiceEl = null, seq = 0;
  const ttsFallback = (text) => {
    if (!('speechSynthesis' in window) || !/^[a-zç]+$/.test(text)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'pt-BR'; u.rate = cfg().rate; u.pitch = 1.25;
    speechSynthesis.speak(u);
  };
  let sayTimer = 0;
  const sayLater = (ms, ...keys) => { clearTimeout(sayTimer); sayTimer = setTimeout(() => say(...keys), ms); };
  const say = (...keys) => {
    clearTimeout(sayTimer);
    const id = ++seq;
    if (voiceEl) voiceEl.pause();
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    music.volume = MUSIC_DUCK;
    const next = (i) => {
      if (id !== seq) return;
      if (i >= keys.length) { music.volume = MUSIC_VOL; return; }
      const key = keys[i].toLowerCase();
      const a = new Audio(`audio/${key}.mp3`);
      voiceEl = a;
      a.onended = () => next(i + 1);
      a.onerror = () => { ttsFallback(key); next(i + 1); };
      a.play().catch(() => { music.volume = MUSIC_VOL; });
    };
    next(0);
  };
  const stopVoice = () => { seq++; if (voiceEl) voiceEl.pause(); music.volume = MUSIC_VOL; };
  const okKey = () => ['ok1', 'ok2', 'ok3', 'ok5'][Math.floor(Math.random() * 4)];
  let ac;
  const tone = (freqs, dur = 0.12) => {
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      freqs.forEach((f, i) => {
        const o = ac.createOscillator(), g = ac.createGain();
        o.type = 'triangle'; o.frequency.value = f;
        const t = ac.currentTime + i * dur;
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.25, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        o.connect(g).connect(ac.destination); o.start(t); o.stop(t + dur + 0.02);
      });
    } catch { /* sem áudio */ }
  };
  const ok = () => tone([523, 659, 784]);
  const bad = () => tone([220, 196], 0.15);

  /* confete */
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cv = $('#confetti');
  const ctx = cv.getContext('2d');
  const COLORS = ['#ffc83d', '#d63a1f', '#2fb67c', '#4da8ff', '#ff7ab6', '#ffffff'];
  let bits = [], raf = 0;
  function fit() { cv.width = innerWidth * devicePixelRatio; cv.height = innerHeight * devicePixelRatio; }
  addEventListener('resize', fit); fit();
  function confetti(x = innerWidth / 2, y = innerHeight / 3, count = 60, spread = 1) {
    if (reduceMotion) return;
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2, v = (4 + Math.random() * 9) * spread;
      bits.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 6, w: 6 + Math.random() * 7, h: 9 + Math.random() * 8, r: Math.random() * 6, vr: (Math.random() - .5) * .4, c: COLORS[i % COLORS.length], life: 0 });
    }
    if (!raf) raf = requestAnimationFrame(tick);
  }
  function tick() {
    const d = devicePixelRatio;
    ctx.clearRect(0, 0, cv.width, cv.height);
    bits = bits.filter(b => b.life < 110 && b.y < innerHeight + 30);
    for (const b of bits) {
      b.life++; b.vy += 0.38; b.vx *= 0.985; b.x += b.vx; b.y += b.vy; b.r += b.vr;
      ctx.save(); ctx.translate(b.x * d, b.y * d); ctx.rotate(b.r); ctx.globalAlpha = Math.min(1, (110 - b.life) / 30);
      ctx.fillStyle = b.c; ctx.fillRect(-b.w * d / 2, -b.h * d / 2, b.w * d, b.h * d); ctx.restore();
    }
    raf = bits.length ? requestAnimationFrame(tick) : 0;
    if (!raf) ctx.clearRect(0, 0, cv.width, cv.height);
  }
  const burstAt = (el, n = 50) => { const r = el.getBoundingClientRect(); confetti(r.left + r.width / 2, r.top + r.height / 2, n); };

  function renderHud(showHome) {
    hud.innerHTML = `
      ${showHome ? '<button class="home" id="homeBtn" type="button">Início</button>' : '<a class="home" href="./">Sair</a>'}
      <div class="pills">
        <button class="pill music-btn" id="musicBtn" type="button" aria-pressed="${S.music}" aria-label="${S.music ? 'Desligar a música' : 'Ligar a música'}"><svg aria-hidden="true"><use href="#${S.music ? 'note' : 'note-off'}"/></svg><span>${S.music ? 'Música' : 'Sem música'}</span></button>
        <span class="pill" title="Sequência de dias"><svg aria-hidden="true"><use href="#fire"/></svg>${S.streak}<span style="position:absolute;left:-9999px"> dias seguidos</span></span>
        <span class="pill" title="Estrelas"><svg aria-hidden="true"><use href="#star"/></svg>${S.stars}<span style="position:absolute;left:-9999px"> estrelas</span></span>
      </div>`;
    const h = $('#homeBtn'); if (h) h.onclick = home;
    $('#musicBtn').onclick = () => { S.music = !S.music; save(); applyMusic(); renderHud(showHome); };
  }

  const coach = (text, cls = '') => `<div class="coach ${cls}"><svg aria-hidden="true"><use href="#owl"/></svg><p class="say">${text}</p></div>`;
  const isUnlocked = (l) => l.id <= cfg().start || (S.done[l.id - 1] || 0) > 0;

  function home() {
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    renderHud(false);
    const goal = S.goal || DAILY_GOAL_DEFAULT;
    const pct = Math.min(100, Math.round((S.played / goal) * 100));
    const left = Math.max(0, goal - S.played);
    const next = LEVELS.find(l => isUnlocked(l) && !(S.done[l.id] > 0)) || LEVELS[LEVELS.length - 1];
    const worlds = Object.keys(WORLDS).map(Number).map(w => {
      const ls = LEVELS.filter(l => l.world === w);
      const done = ls.filter(l => S.done[l.id] > 0).length;
      const open = ls.some(isUnlocked);
      return `<li><button class="world-card" data-w="${w}" ${open ? '' : 'disabled'} aria-label="${WORLDS[w]}, ${done} de ${ls.length} fases${open ? '' : ', bloqueado'}">
        <span class="w-ico" aria-hidden="true">${open ? WORLD_ICON[w] : '🔒'}</span>
        <span class="w-name">${WORLDS[w]}</span>
        <span class="w-prog">${done} de ${ls.length} fases</span>
        <span class="w-bar" aria-hidden="true"><i style="width:${Math.round(done / ls.length * 100)}%"></i></span>
      </button></li>`;
    }).join('');
    const pause = left === 0
      ? `<div class="pause"><strong>Meta de hoje cumprida! 🎉</strong><p>Que tal uma pausa da tela? Peça um desafio fora do jogo aos pais: <a href="pais.html#fora">ver brincadeiras</a>.</p></div>`
      : `<div class="goal"><strong>Faltam ${left} fase${left > 1 ? 's' : ''} para a meta de hoje</strong>
        <div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><i style="width:${pct}%"></i></div></div>`;
    app.innerHTML = `
      ${coach(`Oi, ${esc(S.name)}! Vamos brincar com as letras?`)}
      <button class="btn go" id="go" type="button">${S.played || Object.keys(S.done).length ? 'Continuar' : 'Começar'}<span>Fase ${next.id}: ${next.title}</span></button>
      ${pause}
      <h2 class="section">Escolha um mundo</h2>
      <ul class="worlds">${worlds}</ul>
      <p class="foot-link"><a href="pais.html">Painel dos pais</a></p>`;
    $('#go').onclick = () => play(next.id);
    app.querySelectorAll('.world-card').forEach(b => b.onclick = () => worldScreen(+b.dataset.w));
  }

  function worldScreen(w) {
    renderHud(true);
    const items = LEVELS.filter(l => l.world === w).map(l => {
      const st = S.done[l.id] || 0, un = isUnlocked(l);
      const rec = l.id === cfg().start && !st ? '<span class="rec">Para você</span>' : '';
      return `<li><button class="level" data-id="${l.id}" ${un ? '' : 'disabled'} aria-label="Fase ${l.id}: ${l.title}${un ? '' : ', bloqueada'}">
        <span class="num">${un ? l.id : '🔒'}</span>
        <span class="name">${l.title}${rec}<span class="sub">${l.sub}</span></span>
        <span class="stars">${[1, 2, 3].map(n => star(n <= st)).join('')}</span>
      </button></li>`;
    }).join('');
    app.innerHTML = `
      <h2 class="section">${WORLD_ICON[w]} ${WORLDS[w]}</h2>
      <ol class="path">${items}</ol>
      <p class="foot-link"><button class="linkbtn" id="allWorlds" type="button">‹ Todos os mundos</button></p>`;
    app.querySelectorAll('.level').forEach(b => b.onclick = () => play(+b.dataset.id));
    $('#allWorlds').onclick = home;
  }

  /* jogo */
  let run;
  function play(id) {
    const level = LEVELS.find(l => l.id === id);
    const n = cfg().rounds;
    const items = [];
    while (items.length < n) items.push(...shuffle(level.pool));
    run = { level, items: items.slice(0, n), i: 0, mistakes: 0, n };
    round();
  }

  const dots = () => `<div class="progress" aria-label="Rodada ${run.i + 1} de ${run.n}">${run.items.map((_, k) => `<i class="${k < run.i ? 'done' : k === run.i ? 'now' : ''}"></i>`).join('')}</div>`;
  const weak = (key) => { S.weak[key] = (S.weak[key] || 0) + 1; };
  const advance = () => { run.i++; run.i >= run.n ? finish() : round(); };

  function round() {
    renderHud(true);
    ({ listen: listenRound, build: buildRound, missing: missingRound })[run.level.type]();
  }

  function listenRound() {
    const target = run.items[run.i];
    const distract = shuffle(run.level.from.filter(x => x !== target)).slice(0, cfg().opts - 1);
    const opts = shuffle([target, ...distract]);
    app.innerHTML = `
      ${dots()}
      ${coach('Toque no que eu falar!')}
      <button class="btn listen-btn" id="again" type="button"><svg width="28" height="28" aria-hidden="true"><use href="#sound"/></svg>Ouvir de novo</button>
      <div class="options">${opts.map(o => `<button class="opt" type="button" data-v="${o}" aria-label="${o}">${o}</button>`).join('')}</div>`;
    sayLater(350, ...(run.i === 0 ? ['intro_listen', target] : [target]));
    $('#again').onclick = () => say(target);
    app.querySelectorAll('.opt').forEach(b => b.onclick = () => {
      if (b.dataset.v === target) {
        app.querySelectorAll('.opt').forEach(x => x.disabled = true);
        b.classList.add('right'); ok(); burstAt(b);
        $('.coach').classList.add('happy'); $('.say').textContent = 'Muito bem!';
        sayLater(150, okKey());
        setTimeout(advance, 1800);
      } else {
        b.classList.add('wrong'); b.disabled = true; bad();
        run.mistakes++; weak(target);
        $('.say').textContent = 'Quase! Escute de novo.';
        sayLater(350, 'err' + (1 + Math.floor(Math.random() * 2)), target);
      }
    });
  }

  function buildRound() {
    const w = run.items[run.i];
    const extras = shuffle(ALL_SYL.filter(s => !w.syl.includes(s))).slice(0, cfg().extras);
    const bank = shuffle([...w.syl, ...extras]);
    let pos = 0;
    app.innerHTML = `
      ${dots()}
      ${coach('Monte a palavra!')}
      <div class="pic" role="img" aria-label="Figura da palavra">${w.pic}</div>
      <button class="btn listen-btn" id="again" type="button"><svg width="28" height="28" aria-hidden="true"><use href="#sound"/></svg>Ouvir a palavra</button>
      <div class="slots">${w.syl.map(() => '<div class="slot"></div>').join('')}</div>
      <div class="bank">${bank.map(s => `<button class="opt" type="button" data-v="${s}">${s}</button>`).join('')}</div>`;
    sayLater(350, ...(run.i === 0 ? ['intro_build', w.word] : [w.word]));
    $('#again').onclick = () => say(w.word);
    const slots = app.querySelectorAll('.slot');
    app.querySelectorAll('.bank .opt').forEach(b => b.onclick = () => {
      if (b.dataset.v === w.syl[pos]) {
        slots[pos].textContent = b.dataset.v; slots[pos].classList.add('filled');
        b.classList.add('used'); b.disabled = true; pos++; tone([660], 0.1);
        if (pos === w.syl.length) wordDone(w);
      } else {
        b.classList.add('wrong'); bad(); run.mistakes++; weak(b.dataset.v);
        setTimeout(() => b.classList.remove('wrong'), 450);
        $('.say').textContent = 'Hmm, tente outra sílaba.';
      }
    });
  }

  function missingRound() {
    const w = run.items[run.i];
    const k = Math.floor(Math.random() * w.syl.length);
    const target = w.syl[k];
    const distract = shuffle(ALL_SYL.filter(s => s !== target)).slice(0, cfg().opts - 1);
    const opts = shuffle([target, ...distract]);
    app.innerHTML = `
      ${dots()}
      ${coach('Qual sílaba está faltando?')}
      <div class="pic" role="img" aria-label="Figura da palavra">${w.pic}</div>
      <button class="btn listen-btn" id="again" type="button"><svg width="28" height="28" aria-hidden="true"><use href="#sound"/></svg>Ouvir a palavra</button>
      <div class="slots">${w.syl.map((s, n) => n === k ? '<div class="slot" id="gap"></div>' : `<div class="slot filled">${s}</div>`).join('')}</div>
      <div class="bank">${opts.map(s => `<button class="opt" type="button" data-v="${s}">${s}</button>`).join('')}</div>`;
    sayLater(350, ...(run.i === 0 ? ['intro_missing', w.word] : [w.word]));
    $('#again').onclick = () => say(w.word);
    app.querySelectorAll('.bank .opt').forEach(b => b.onclick = () => {
      if (b.dataset.v === target) {
        app.querySelectorAll('.bank .opt').forEach(x => x.disabled = true);
        const gap = $('#gap'); gap.textContent = target; gap.classList.add('filled');
        wordDone(w);
      } else {
        b.classList.add('wrong'); b.disabled = true; bad(); run.mistakes++; weak(target);
        $('.say').textContent = 'Quase! Escute a palavra de novo.';
        sayLater(350, 'err1', w.word);
      }
    });
  }

  function wordDone(w) {
    ok(); burstAt($('.pic'), 70);
    if (!S.words.includes(w.word)) S.words.push(w.word);
    $('.coach').classList.add('happy'); $('.say').textContent = `${w.word}! Você leu!`;
    sayLater(150, w.word, okKey());
    setTimeout(advance, 2800);
  }

  function finish() {
    const ratio = run.mistakes / run.n;
    const stars = ratio <= 0.2 ? 3 : ratio <= 0.6 ? 2 : 1;
    const id = run.level.id;
    S.stars += Math.max(0, stars - (S.done[id] || 0));
    S.done[id] = Math.max(S.done[id] || 0, stars);
    S.played++;
    S.log = [...(S.log || []), { d: today(), l: id, s: stars, m: run.mistakes }].slice(-120);
    if (S.lastDay !== today()) { S.streak = S.lastDay === yesterday() ? S.streak + 1 : 1; S.lastDay = today(); }
    save();
    renderHud(true);
    const next = LEVELS.find(l => l.id === id + 1);
    app.innerHTML = `
      <div class="result">
        ${coach('Fase completa!', 'happy')}
        <div class="big-stars">${[1, 2, 3].map(n => star(n <= stars)).join('')}</div>
        <h2>${stars === 3 ? 'Perfeito!' : stars === 2 ? 'Muito bom!' : 'Boa tentativa!'}</h2>
        <div class="btns">
          ${next ? '<button class="btn" id="next" type="button">Próxima fase</button>' : ''}
          <button class="btn ghost" id="redo" type="button">Jogar de novo</button>
          <button class="btn ghost" id="back" type="button">Início</button>
        </div>
      </div>`;
    tone([523, 659, 784, 1047], 0.13);
    if (stars >= 2) { confetti(innerWidth * 0.25, innerHeight * 0.4, 70, 1.2); confetti(innerWidth * 0.75, innerHeight * 0.4, 70, 1.2); }
    setTimeout(() => confetti(innerWidth / 2, innerHeight * 0.3, 110, 1.4), 350);
    sayLater(400, stars === 3 ? 'perfect' : stars === 2 ? 'good' : 'try');
    if (next) $('#next').onclick = () => play(next.id);
    $('#redo').onclick = () => play(id);
    $('#back').onclick = home;
  }

  /* cadastro: nome, idade e autorização */
  function start() {
    if (S.consent && S.name && AGE[S.age]) return home();
    renderHud(false);
    const dlg = $('#welcome');
    $('#childName').value = S.name || '';
    if (AGE[S.age]) $('#childAge').value = S.age;
    dlg.addEventListener('cancel', (e) => e.preventDefault());
    dlg.showModal();
    $('#welcomeForm').addEventListener('submit', () => {
      S.name = $('#childName').value.trim().slice(0, 20) || 'amiguinho';
      S.age = +$('#childAge').value;
      S.consent = true; save();
      home();
    });
  }
  start();
})();
