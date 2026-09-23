// ---------- helpers ----------
function fmtMoney(n) {
  if (!isFinite(n)) return '$0';
  return '$' + n.toLocaleString('es-AR', { maximumFractionDigits: 0 });
}
function fmtPct(n) {
  return n.toLocaleString('es-AR', { maximumFractionDigits: 2 }) + '%';
}
function showError(id, show) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle('show', show);
}

// ---------- préstamo (sistema francés) ----------
function calcularPrestamo() {
  const monto = parseFloat(document.getElementById('p-monto').value);
  const tna = parseFloat(document.getElementById('p-tasa').value);
  const plazo = parseInt(document.getElementById('p-plazo').value, 10);

  if (!(monto > 0) || !(tna >= 0) || !(plazo > 0)) {
    showError('p-error', true);
    document.getElementById('p-result').classList.remove('show');
    return;
  }
  showError('p-error', false);

  const rMensual = (tna / 100) / 12;
  let cuota;
  if (rMensual === 0) {
    cuota = monto / plazo;
  } else {
    cuota = monto * rMensual / (1 - Math.pow(1 + rMensual, -plazo));
  }
  const total = cuota * plazo;
  const intereses = total - monto;

  document.getElementById('p-cuota').textContent = fmtMoney(cuota);
  document.getElementById('p-total').textContent = fmtMoney(total);
  document.getElementById('p-intereses').textContent = fmtMoney(intereses);
  document.getElementById('p-tasames').textContent = fmtPct(rMensual * 100);
  document.getElementById('p-result').classList.add('show');
}

// ---------- sueldo neto ----------
function calcularSueldo() {
  const bruto = parseFloat(document.getElementById('s-bruto').value);
  let descuentoPct = parseFloat(document.getElementById('s-descuento').value);
  if (!(descuentoPct >= 0)) descuentoPct = 17;

  if (!(bruto > 0)) {
    showError('s-error', true);
    document.getElementById('s-result').classList.remove('show');
    return;
  }
  showError('s-error', false);

  const descuentos = bruto * (descuentoPct / 100);
  const neto = bruto - descuentos;

  document.getElementById('s-neto').textContent = fmtMoney(neto);
  document.getElementById('s-descuentos').textContent = fmtMoney(descuentos);
  document.getElementById('s-brutoresumen').textContent = fmtMoney(bruto);
  document.getElementById('s-result').classList.add('show');
}

// ---------- meta de ahorro ----------
function calcularAhorro() {
  const objetivo = parseFloat(document.getElementById('a-objetivo').value);
  const actual = parseFloat(document.getElementById('a-actual').value) || 0;
  const plazo = parseInt(document.getElementById('a-plazo').value, 10);
  const tasaPct = parseFloat(document.getElementById('a-tasa').value) || 0;

  if (!(objetivo > 0) || !(plazo > 0) || objetivo <= actual) {
    showError('a-error', true);
    document.getElementById('a-result').classList.remove('show');
    return;
  }
  showError('a-error', false);

  const i = tasaPct / 100;
  let cuota;
  let valorFuturoActual;

  if (i === 0) {
    cuota = (objetivo - actual) / plazo;
    valorFuturoActual = actual;
  } else {
    valorFuturoActual = actual * Math.pow(1 + i, plazo);
    const factor = (Math.pow(1 + i, plazo) - 1) / i;
    cuota = (objetivo - valorFuturoActual) / factor;
    if (cuota < 0) cuota = 0;
  }

  const aportado = actual + cuota * plazo;
  const generado = objetivo - aportado;

  document.getElementById('a-cuota').textContent = fmtMoney(cuota);
  document.getElementById('a-aportado').textContent = fmtMoney(aportado);
  document.getElementById('a-generado').textContent = fmtMoney(generado > 0 ? generado : 0);
  document.getElementById('a-result').classList.add('show');
}

// ---------- ajuste por inflación ----------
function calcularInflacion() {
  const monto = parseFloat(document.getElementById('i-monto').value);
  const inflacion = parseFloat(document.getElementById('i-inflacion').value);

  if (!(monto > 0) || isNaN(inflacion)) {
    showError('i-error', true);
    document.getElementById('i-result').classList.remove('show');
    return;
  }
  showError('i-error', false);

  const ajustado = monto * (1 + inflacion / 100);
  const diferencia = ajustado - monto;

  document.getElementById('i-ajustado').textContent = fmtMoney(ajustado);
  document.getElementById('i-diferencia').textContent = fmtMoney(diferencia);
  document.getElementById('i-result').classList.add('show');
}
