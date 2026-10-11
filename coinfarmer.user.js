// ==UserScript==
// @name         MagicGarden CoinFarmer
// @namespace    https://github.com/AnasaAyatan/MagicGarden-CoinFarmer
// @version      0.3.0
// @description  Experimental live Coin tracking and crop-profit calculator.
// @author       AnasaAyatan
// @license      Custom Personal Use License; see repository LICENSE
// @match        https://magicgarden.gg/*
// @include      /^https:\/\/1227719606223765687\.discordsays\.com\/.*[?&]mc_shell_frame=1(&|#|$)/
// @run-at       document-idle
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

// Copyright (c) 2026 AnasaAyatan. See LICENSE for permissions.
(() => {
  'use strict';
  if (document.getElementById('mg-coinfarmer')) return;
  const host = document.createElement('div');
  host.id = 'mg-coinfarmer';
  host.style.cssText = 'position:fixed;right:16px;top:70px;z-index:2147483647';
  const root = host.attachShadow({mode:'open'});
  root.innerHTML = `<style>
    :host {color-scheme:dark} * {box-sizing:border-box}
    section {width:300px;max-width:90vw;max-height:75vh;overflow:auto;background:#14251d;color:#eef9ef;border:1px solid #68aa77;border-radius:12px;padding:16px;font:14px system-ui;box-shadow:0 8px 30px #0008}
    h2 {font-size:17px;margin:0} p {line-height:1.4} label {display:block;margin:10px 0}
    input,button {font:inherit;border-radius:6px;border:1px solid #659570;padding:7px}
    input {display:block;width:100%;margin-top:4px;background:#0e1913;color:white}
    button {background:#244e32;color:white;cursor:pointer;margin:3px 0}
    header {display:flex;justify-content:space-between;align-items:center;gap:10px}
    output {display:block;white-space:pre-line;margin:12px 0;line-height:1.5}
    .muted {color:#bbd0c0;font-size:12px} [hidden] {display:none!important}
  </style><section>
    <header><h2>CoinFarmer 0.3.0</h2><button id="toggle" aria-expanded="true">Minimize</button></header>
    <main><p class="muted">Automatic read-only tracking when connected. No harvesting or balance changes.</p>
    <output id="connection" aria-live="polite">Waiting for game data…</output><label>Current Coins (full number)<input id="balance" type="number" min="0" step="1" placeholder="22140000000"></label>
    <button id="start">Start new session</button> <button id="record">Record balance</button>
    <output id="session" aria-live="polite"></output>
    <p class="muted">Balance change is net income: spending reduces it. Rate is an estimate.</p>
    <label>Seed cost per planting<input id="cost" type="number" min="0" step="any" value="0"></label>
    <label>Total sale value per harvest<input id="sale" type="number" min="0" step="any" value="0"></label>
    <label>Minutes between harvests<input id="minutes" type="number" min="0" step="any" value="10"></label>
    <label>Number of identical plots<input id="plots" type="number" min="1" step="1" value="1"></label>
    <label><input id="replant" type="checkbox" checked style="display:inline;width:auto"> Pay seed cost every harvest</label>
    <button id="calculate">Calculate profit</button><output id="profit" aria-live="polite"></output>
    <p class="muted">For regrowing crops, uncheck seed cost: recurring profit excludes the initial planting cost. Enter the actual sale value to include mutations and bonuses.</p>
    <output id="message" aria-live="polite"></output></main>
  </section>`;
  document.body.append(host);
  const get = id => root.getElementById(id);
  const format = n => n.toLocaleString(undefined,{maximumFractionDigits:2});
  let session = null;
  try {
    const saved = GM_getValue('coinfarmer.session', null);
    if (saved && Number.isSafeInteger(saved.start) && saved.start >= 0 &&
        Number.isSafeInteger(saved.current) && saved.current >= 0 &&
        Number.isFinite(saved.time) && saved.time > 0 && saved.time <= Date.now() &&
        Number.isFinite(saved.recorded) && saved.recorded >= saved.time) session = saved;
  } catch { get('message').textContent = 'Storage unavailable; tracking works for this page only.'; }
  function render() {
    if (!session) { get('session').textContent = 'No session started.'; return; }
    const change = session.current - session.start;
    const hours = (session.recorded - session.time) / 3600000;
    get('session').textContent = `Net change: ${format(change)} Coins\nRate at last record: ${hours > 0 ? format(change / hours) + ' Coins/hour' : 'Record again later'}\nLast recorded: ${new Date(session.recorded).toLocaleString()}`;
  }
  function balance() {
    const raw = get('balance').value.trim();
    const n = Number(raw);
    if (!raw || !Number.isSafeInteger(n) || n < 0) throw Error('Enter a non-negative whole Coin balance using digits, not K or B.');
    return n;
  }
  function save() {
    try { GM_setValue(live && activeAccount ? 'coinfarmer.live.' + activeAccount : 'coinfarmer.session', session); }
    catch { get('message').textContent = 'Could not save; keep this page open to retain the session.'; }
    render();
  }
  get('start').onclick = () => {
    get('message').textContent = '';
    try {
      const n = balance();
      if (session && !window.confirm('Replace the current tracking session?')) return;
      const now = Date.now();
      session = {start:n,current:n,time:now,recorded:now}; save();
    } catch (e) { get('message').textContent = e.message; }
  };
  get('record').onclick = () => {
    get('message').textContent = '';
    try {
      if (!session) throw Error('Start a session first.');
      session.current = balance(); session.recorded = Date.now(); save();
    } catch (e) { get('message').textContent = e.message; }
  };
  get('calculate').onclick = () => {
    const ids = ['cost','sale','minutes','plots'];
    const values = ids.map(id => get(id).value.trim());
    const [cost,sale,minutes,plots] = values.map(Number);
    if (values.some(v => !v) || ![cost,sale,minutes,plots].every(Number.isFinite) || cost < 0 || sale < 0 || minutes <= 0 || !Number.isSafeInteger(plots) || plots < 1) {
      get('profit').textContent = 'Enter non-negative prices, positive minutes, and a positive whole plot count.'; return;
    }
    const profit = (sale - (get('replant').checked ? cost : 0)) * plots;
    const rate = profit * 60 / minutes;
    get('profit').textContent = Number.isFinite(profit) && Number.isFinite(rate)
      ? `Profit per harvest: ${format(profit)} Coins\nEstimated profit/hour: ${format(rate)} Coins\nAssumes all plots harvested on time.`
      : 'Values are too large to calculate.';
  };
  get('toggle').onclick = () => {
    const main = root.querySelector('main'); main.hidden = !main.hidden;
    get('toggle').textContent = main.hidden ? 'Open' : 'Minimize';
    get('toggle').setAttribute('aria-expanded', String(!main.hidden));
  };

  const page = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
  let reader = null;
  let captureActive = false;
  let nextAttempt = 0;
  let activeAccount = null;
  let live = false;
  let lastSaved = 0;
  let restoreCapture = () => {};
  function atomByName(name) {
    const cache = page.jotaiAtomCache?.cache;
    if (!cache || typeof cache.entries !== 'function') return null;
    for (const [key, atom] of cache.entries()) {
      if (atom && (atom.debugLabel === name || atom.label === name ||
          (typeof key === 'string' && key.endsWith('/' + name)))) return atom;
    }
    return null;
  }
  function accountId(player) {
    for (const key of ['userId', 'discordUserId', 'databaseUserId', 'id']) {
      const v = player?.[key];
      if (typeof v === 'string' && v && !v.startsWith('p_')) return v;
      if (typeof v === 'number' && Number.isSafeInteger(v) && v >= 0) return String(v);
    }
    return null;
  }
  function validCoins(data) {
    const value = data?.coinsCount ?? data?.coins;
    return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0 ? value : null;
  }
  // Capture the game's getter on its next normal atom write. Never call its setter.
  function attemptCapture() {
    if (captureActive || Date.now() < nextAttempt) return;
    const cache = page.jotaiAtomCache?.cache;
    if (!cache || typeof cache.values !== 'function') return;
    captureActive = true;
    nextAttempt = Date.now() + 30000;
    const patches = [];
    let timeout;
    restoreCapture = () => {
      clearTimeout(timeout);
      for (const [atom, original, wrapper] of patches) {
        try { if (atom.write === wrapper) atom.write = original; } catch {}
      }
      patches.length = 0;
      captureActive = false;
    };
    for (const atom of cache.values()) {
      if (!atom || typeof atom.write !== 'function' || patches.length >= 5000) continue;
      const original = atom.write;
      const wrapper = function(getter, ...args) {
        if (typeof getter === 'function') {
          reader = getter;
          restoreCapture();
        }
        return Reflect.apply(original, this, [getter, ...args]);
      };
      try {
        atom.write = wrapper;
        if (atom.write === wrapper) patches.push([atom, original, wrapper]);
      } catch {}
    }
    timeout = setTimeout(restoreCapture, 8000);
  }
  function setLiveControls(connected) {
    live = connected;
    get('balance').readOnly = connected;
    get('record').disabled = connected;
    get('record').textContent = connected ? 'Recording automatically' : 'Record balance';
  }
  function pollLive() {
    try {
      if (!reader) attemptCapture();
      const dataAtom = atomByName('myDataAtom');
      const playerAtom = atomByName('playerAtom');
      const player = reader && playerAtom ? reader(playerAtom) : null;
      const id = accountId(player);
      const coins = reader && dataAtom ? validCoins(reader(dataAtom)) : null;
      if (id === null || coins === null) {
        setLiveControls(false);
        get('connection').textContent = 'Not connected: waiting for your game data. Move your character after loading. Manual mode remains available.';
        return;
      }
      if (activeAccount !== id) {
        activeAccount = id;
        // Never carry another account's tracking baseline into this account.
        try {
          const saved = GM_getValue('coinfarmer.live.' + id, null);
          session = saved && Number.isSafeInteger(saved.start) && saved.start >= 0 &&
            Number.isSafeInteger(saved.current) && saved.current >= 0 &&
            Number.isFinite(saved.time) && saved.time > 0 && saved.time <= Date.now() &&
            Number.isFinite(saved.recorded) && saved.recorded >= saved.time ? saved : null;
        } catch { session = null; }
        lastSaved = 0;
      }
      const now = Date.now();
      const changed = session?.current !== coins;
      if (!session) session = {start:coins,current:coins,time:now,recorded:now};
      session.current = coins;
      session.recorded = now;
      setLiveControls(true);
      get('balance').value = String(coins);
      get('connection').textContent = 'Connected · live local-player balance · ' + new Date(now).toLocaleTimeString();
      render();
      if (changed || now - lastSaved >= 15000) { save(); lastSaved = now; }
    } catch {
      setLiveControls(false);
      reader = null;
      get('connection').textContent = 'Connection unavailable; retrying. Manual mode remains available.';
    }
  }
  const pollTimer = setInterval(pollLive, 1000);
  window.addEventListener('pagehide', () => {
    restoreCapture();
    clearInterval(pollTimer);
  }, {once:true});
  pollLive();

  render();
})();

