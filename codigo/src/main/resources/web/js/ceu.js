// Céu que muda com a hora do dia, usado no login e na tela Hoje.
import { deHtml } from './ui.js';

/** Madrugada (0h–5h59), manhã (6h–11h59), tarde (12h–17h59) ou noite (18h–23h59). */
export function periodoDoDia(data = new Date()) {
  const h = data.getHours();
  return h < 6 ? 'madrugada' : h < 12 ? 'manha' : h < 18 ? 'tarde' : 'noite';
}

export const ehNoite = (periodo) => periodo === 'noite' || periodo === 'madrugada';

export const semMovimento = () => !window.gsap || matchMedia('(prefers-reduced-motion: reduce)').matches;

export function estrelas() {
  return deHtml(`<svg class="estrelas" viewBox="0 0 390 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <circle cx="312" cy="38" r="1.6"/><circle cx="352" cy="96" r="1.1"/><circle cx="268" cy="118" r="1.3"/>
    <circle cx="198" cy="58" r="1"/><circle cx="36" cy="150" r="1.2"/><circle cx="96" cy="196" r="1"/>
    <circle cx="372" cy="176" r="1.5"/><circle cx="232" cy="20" r="1.1"/><circle cx="150" cy="128" r="0.9"/>
    <circle cx="20" cy="70" r="1"/></svg>`);
}

export function morros() {
  return deHtml(`<svg class="morros" viewBox="0 0 390 120" preserveAspectRatio="none" aria-hidden="true">
    <path class="m1" d="M0 58C62 22 128 20 196 46S328 80 390 36V120H0Z"/>
    <path class="m2" d="M0 84C78 54 158 64 230 80S338 72 390 64V120H0Z"/>
    <path class="m3" d="M0 108C120 98 262 98 390 108V120H0Z"/></svg>`);
}
