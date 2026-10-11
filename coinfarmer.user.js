// ==UserScript==
// @name         MagicGarden CoinFarmer
// @namespace    https://github.com/AnasaAyatan/MagicGarden-CoinFarmer
// @version      0.1.0
// @description  Manual Coin session tracker and crop-profit calculator.
// @author       AnasaAyatan
// @license      Custom Personal Use License; see repository LICENSE
// @match        https://magicgarden.gg/*
// @include      /^https:\/\/1227719606223765687\.discordsays\.com\/.*[?&]mc_shell_frame=1(&|#|$)/
// @run-at       document-idle
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
    <header><h2>CoinFarmer 0.1.0</h2><button id="toggle" aria-expanded="true">Minimize</button></header>
    <main><p class="muted">Manual input only. No automatic harvesting or balance changes.</p>
    <label>Current Coins (full number)<input id="balance" type="number" min="0" step="1" placeholder="22140000000"></label>
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
    try { GM_setValue('coinfarmer.session', session); }
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
  render();
})();
