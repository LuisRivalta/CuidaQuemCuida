// Ícones desenhados em SVG (traço 2, cantos redondos), usados no lugar de emoji.
const TRACOS = {
  sol: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/>',
  calendario: '<rect x="3" y="5" width="18" height="16" rx="4"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  folha: '<path d="M5 19C5 11 10 5 19 5c0 9-6 14-14 14Z"/><path d="m5 19 7-7"/>',
  mais: '<rect x="4" y="4" width="6.5" height="6.5" rx="2"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="2"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="2"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="2"/>',
  sino: '<path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15Z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  pilula: '<path d="M13.5 3.5a4.95 4.95 0 0 1 7 7l-10 10a4.95 4.95 0 0 1-7-7Z"/><path d="m8.5 8.5 7 7"/>',
  pulso: '<path d="M3 12h4l2-5 4 10 2-5h6"/>',
  coracao: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/>',
  menos: '<path d="M7 12h10"/>',
  seta: '<path d="m8 10 4 4 4-4"/>',
  lua: '<path d="M20.8 15A8.6 8.6 0 0 1 9 3.2 8.7 8.7 0 1 0 20.8 15Z"/>',
  cadeado: '<rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2"/>',
  grafico: '<path d="M4 4v16h16M9 15v-4m5 4V7m5 8V4"/>',
  pessoas: '<circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2m1-15a3 3 0 0 1 0 6m1 3a4 4 0 0 1 4 4v2"/>',
  lista: '<rect x="5" y="5" width="14" height="16" rx="2"/><path d="M9 5V3h6v2m-6 5h6m-6 4h6m-6 4h4"/>',
  banco: '<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v12a8 3 0 0 0 16 0V6M4 12a8 3 0 0 0 16 0"/>',
  pessoa: '<circle cx="12" cy="7" r="4"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/>',
  alerta: '<path d="M10 4a2.3 2.3 0 0 1 4 0l7 12a2.3 2.3 0 0 1-2 3H5a2.3 2.3 0 0 1-2-3zM12 9v4m0 3h.01"/>',
};

/** Devolve um <span> com o ícone. Ex.: icone('pilula', 'icone-grande') */
export function icone(nome, classe = '') {
  const span = document.createElement('span');
  span.className = `icone ${classe}`.trim();
  span.setAttribute('aria-hidden', 'true');
  span.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${TRACOS[nome]}</svg>`;
  return span;
}
