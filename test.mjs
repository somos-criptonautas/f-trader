/* SPDX-License-Identifier: AGPL-3.0-or-later
   Copyright (C) 2026 Criptonautas */
/* Tests for the calculator's logic.
 *
 *   node test.mjs
 *
 * There is no copy of the code: everything above the DOM boundary in app.js is
 * imported as-is, so the tests cannot drift from what ships. Anything touching
 * the document is not covered here; that needs a real browser.
 *
 * Requires Node 20 or newer (global crypto and data: imports).
 */
import { readFileSync } from "node:fs";

const leer = (n) => readFileSync(new URL(`./${n}`, import.meta.url), "utf8");
const html = leer("index.html");
const app = leer("app.js");

/* app.js keeps every DOM-free definition above a marker line, so one split is
   enough. Anchored on that marker, never on prose that translation might reword. */
const MARCA = "/* ======================================================================";
function puro() {
  const i = app.indexOf(MARCA);
  if (i < 0) throw new Error("DOM boundary marker not found in app.js");
  return app.slice(0, i) + `
    export {calcRow, stats, avisos, ratio, nuevo, EJEMPLOS, cifrar, descifrar, dmyAIso, isoADmy,
            migra, parChoca, dirMal, faltantes, empezada, aNumero, aModelo, aPantalla, num,
            fmtPct, fmtMes, mesDe, isoADm, cfg,
            filasPegadas, numPegado, fechaPegada, campoDe, esCabecera, importar,
            decimalDe, diaPrimeroDe, ORDEN, serie, escala, indicesX, resumen, demoTrades, demoPedido};`;
}

const M = await import("data:text/javascript," + encodeURIComponent(puro()));
const { calcRow, stats, avisos, ratio, nuevo, EJEMPLOS, cifrar, descifrar, dmyAIso, isoADmy,
        migra, parChoca, dirMal, faltantes, empezada, aNumero, aModelo, aPantalla, num,
        fmtPct, fmtMes, mesDe, isoADm, cfg,
        filasPegadas, numPegado, fechaPegada, campoDe, esCabecera, importar,
        decimalDe, diaPrimeroDe, ORDEN, serie, escala, indicesX, resumen, demoTrades, demoPedido } = M;

cfg.locale = "es-AR";

let fallos = 0, total = 0;
const near = (a, b, e = 1e-9) => Math.abs(a - b) < e;
const ok = (name, cond, extra = "") => {
  total++;
  if (!cond) fallos++;
  console.log((cond ? "  PASS  " : "  FAIL  ") + name + (extra ? `   ${extra}` : ""));
};
const grupo = (t) => console.log(`\n${t}`);

const sinFee = { margen: "lineal", feesOn: false, feeLimit: -0.025, feeMarket: 0.225 };
const conFee = { ...sinFee, feesOn: true };
const inverso = { ...sinFee, margen: "inverso" };
const [btc, trx] = EJEMPLOS;

grupo("R by contract type");
ok("BTC LONG lineal = 40%", near(calcRow(btc, sinFee).r, 0.4));
ok("BTC LONG inverso = 37,037%", near(calcRow(btc, inverso).r, ((64800 - 60000) / 64800) * 5));
ok("TRX SHORT lineal = -6,0606%", near(calcRow(trx, sinFee).r, ((0.33 - 0.34) / 0.33) * 2));
ok("la unidad se cancela: sats o USDT dan el mismo R",
  near(calcRow({ ...trx, par: "BTC", entrada: aModelo({ par: "BTC" }, "33"),
    sl: aModelo({ par: "BTC" }, "35"), tp: aModelo({ par: "BTC" }, "26"),
    salida: aModelo({ par: "BTC" }, "34") }, sinFee).r,
    calcRow({ ...trx, par: "USDT", entrada: 33, sl: 35, tp: 26, salida: 34 }, sinFee).r));

grupo("Fees");
ok("Retorno BTC = 39%", near(calcRow(btc, conFee).retorno, 0.4 + 0.00025 * 5 - 0.00225 * 5));
ok("apagadas, Retorno = R", near(calcRow(btc, sinFee).retorno, calcRow(btc, sinFee).r));
ok("empeoran una pérdida (el bug de la hoja original)",
  calcRow(trx, conFee).retorno < calcRow(trx, sinFee).r,
  `${fmtPct(calcRow(trx, conFee).retorno)} < ${fmtPct(calcRow(trx, sinFee).r)}`);

grupo("RRR");
ok('BTC = 1:2,5', calcRow(btc, sinFee).rrr === "1:2,5", calcRow(btc, sinFee).rrr);
ok('13/45 se normaliza', ratio(13, 45) === "1:3,46", ratio(13, 45));
ok('1:1 exacto', ratio(100, 100) === ratio(1, 1));
ok('sin datos = REVISAR', calcRow(nuevo(), sinFee).rrr === "REVISAR");

grupo("Decimal comma or point");
ok("0,33", aNumero("0,33") === 0.33);
ok("0.33", aNumero("0.33") === 0.33);
ok("1.234,56 (es)", aNumero("1.234,56") === 1234.56);
ok("1,234.56 (en)", aNumero("1,234.56") === 1234.56);
ok("-0,025", aNumero("-0,025") === -0.025);
ok("texto -> NaN", Number.isNaN(aNumero("abc")));
ok("num('') = 0", num("") === 0);
ok("muestra 0,33 en es-AR", aPantalla({ par: "USDT" }, 0.33) === "0,33");

grupo("Satoshis (PAIR = BTC)");
ok("33 sats -> 0,00000033", aModelo({ par: "BTC" }, "33") === 0.00000033);
ok("0,00000033 -> 33", aPantalla({ par: "BTC" }, 0.00000033) === "33");
ok("ida y vuelta sin ruido", aPantalla({ par: "BTC" }, aModelo({ par: "BTC" }, "3000000")) === "3000000");
ok("media sat", aModelo({ par: "BTC" }, "0,5") === 5e-9);
ok("SOLUSDT 180 queda 180", aModelo({ par: "USDT" }, "180") === 180, "(la macro vieja lo rompía)");

grupo("Row validation");
ok("BTC/BTC choca", parChoca({ cripto: "BTC", par: "BTC" }) === true);
ok("con espacios y minúsculas también", parChoca({ cripto: " btc ", par: "BTC" }) === true);
ok("choca -> sin Retorno", calcRow({ ...btc, cripto: "BTC", par: "BTC" }, conFee).retorno === null);
ok("LONG con SL arriba se marca", dirMal({ ...btc, sl: 62000 }).sl === true);
ok("SHORT con SL abajo se marca", dirMal({ ...trx, sl: 0.30 }).sl === true);
ok("dirección válida no se marca", !dirMal(btc).sl && !dirMal(btc).tp);
ok("dirección mala -> RRR REVISAR", calcRow({ ...btc, sl: 62000 }, conFee).rrr === "REVISAR");
ok("dirección mala mantiene Retorno", calcRow({ ...btc, sl: 62000 }, conFee).retorno !== null);
ok("fila vacía no se marca", empezada(nuevo()) === false);
ok("con ENTRADA ya está empezada", empezada({ ...nuevo(), entrada: 100 }) === true);
ok("faltan SALIDA y L/M", faltantes({ ...btc, salida: "", lm: "" }).sort().join(",") === "lm,salida");
ok("fila completa no tiene faltantes", faltantes(btc).length === 0);

grupo("Dates");
ok("01/09/26", dmyAIso("01/09/26") === "2026-09-01");
ok("1/9/2026", dmyAIso("1/9/2026") === "2026-09-01");
ok("29/02/24 bisiesto", dmyAIso("29/02/24") === "2024-02-29");
ok("rechaza 29/02/26", dmyAIso("29/02/26") === null);
ok("rechaza 31/02/26", dmyAIso("31/02/26") === null);
ok("rechaza 09/13/26", dmyAIso("09/13/26") === null);
ok("ISO -> DD/MM/AA", isoADmy("2026-09-01") === "01/09/26");
ok("vista de mes: 07/09", isoADm("2026-09-07") === "07/09");
ok("el día 1 no se corre de mes", isoADm("2026-03-01") === "01/03");
ok("sin fecha queda vacío", isoADm("") === "");
ok("mesDe", mesDe("2026-09-01") === "2026-09" && mesDe("") === "");
ok("fmtMes lleva el año", /2026/.test(fmtMes("2026-09", "es-AR")), fmtMes("2026-09", "es-AR"));

grupo("Statistics");
const s5 = stats([0.4, 0.3, 0.5, -0.1, -0.1]);
ok("menos de 5 trades: sin esperanza", stats([0.39, -0.0646]).esperanza === null);
ok("5 trades: esperanza = 2", near(s5.esperanza, 2), s5.esperanza.toFixed(4));
ok("relación ganancia/pérdida = 4", near(s5.rw, 4));
ok("sin trades no rompe", stats([]).n === 0);
/* The tone is asserted, not the wording: the sentence is translated, the tone is
   what the icon is picked from. */
const tonos = (o) => avisos(o).map((a) => a.tono);
const baseAviso = { n: 6, winRate: 0.7, lossRate: 0.3, promedio: 0.2, esperanza: 2, rw: 3 };
ok("siempre un único aviso de F TRADER",
  tonos({ ...baseAviso, f: 0.03 })
    .filter((t) => ["agresiva", "neutral", "conservadora"].includes(t)).length === 1);
ok("por encima del piso: agresiva", tonos({ ...baseAviso, f: 0.03 }).includes("agresiva"));
ok("en el piso: neutral",           tonos({ ...baseAviso, f: 0.02 }).includes("neutral"));
ok("por debajo del piso: conservadora",
   tonos({ ...baseAviso, f: 0.01 }).includes("conservadora"));
ok("cada aviso trae texto y tono",
   avisos({ ...baseAviso, f: 0.03 }).every((a) => a.t && a.tono));
ok("sin trades no hay avisos", avisos({ n: 0 }).length === 0);

/* The old /10/2 divisor capped F at 5%: a 90% win rate at 10:1 reward still only
   reached 4.45%, so the number barely moved however well the run went. */
{
  const corrida = (w, n, win, loss) =>
    [...Array(Math.round(n * w)).fill(win), ...Array(n - Math.round(n * w)).fill(-loss)];
  const bueno = stats(corrida(0.7, 40, 0.15, 0.05));
  const genial = stats(corrida(0.9, 40, 0.3, 0.03));
  ok("una buena racha levanta F bastante por encima del piso", bueno.f > 0.08,
     fmtPct(bueno.f));
  ok("una racha excepcional se acerca al techo", genial.f > 0.12, fmtPct(genial.f));
  ok("nada pasa del techo del 15%", genial.f <= 0.15 && bueno.f <= 0.15);
  // Kelly cannot exceed 1, so the divisor alone is the ceiling.
  ok("F nunca pasa 15% ni con la ventaja máxima imaginable",
     stats(corrida(0.99, 200, 1, 0.001)).f <= 0.15);
  /* Downwards, F was pinned: nothing could produce a figure below the 2% default,
     so the conservative message was unreachable. Expectancy at or below zero is a
     record that lost money on average, and the formula's own answer there is a
     negative Kelly - "do not trade" - so the sheet says the least it can. */
  ok("sin ventaja demostrada sigue en el 2% de referencia",
     stats(corrida(0.6, 40, 0.06, 0.05)).f === 0.02, fmtPct(stats(corrida(0.6, 40, 0.06, 0.05)).f));
  ok("una racha perdedora baja al 1%", stats(corrida(0.5, 40, 0.05, 0.05)).f === 0.01);
  ok("perder de verdad también baja al 1%", stats(corrida(0.3, 40, 0.04, 0.08)).f === 0.01);
  ok("nunca por debajo del 1%",
     [corrida(0.1, 40, 0.01, 0.5), corrida(0.3, 40, 0.04, 0.08)]
       .every((r) => stats(r).f >= 0.01));
  // Under five trades there is no verdict either way, so it stays at the default.
  ok("con pocos trades no hay veredicto", stats([-0.2, -0.3]).f === 0.02);
}

grupo("Blank rows are scaffolding");
ok("una fila en blanco no cuenta", [nuevo(), btc].filter(empezada).length === 1);
ok("con un dato ya cuenta", [{ ...nuevo(), cripto: "BTC" }].filter(empezada).length === 1);
ok("dos en blanco no cuentan", [nuevo(), nuevo()].filter(empezada).length === 0);

grupo("Migration of saved data");
ok("fila sin PAR -> USDT", migra({ cripto: "SOL" }).par === "USDT");
// Rows saved before the ceiling existed are brought under it on load.
ok("apalancamiento guardado por encima del tope se recorta", migra({ x: 50 }).x === 20);
ok("apalancamiento dentro del tope no se toca", migra({ x: 5 }).x === 5);
ok("apalancamiento vacío sigue vacío", migra({ x: "" }).x === "");
ok("no pisa un PAR existente", migra({ par: "BTC" }).par === "BTC");
ok('"LIMIT (*)" -> LIMIT', migra({ ml: "LIMIT (*)" }).ml === "LIMIT");
ok("POSICION vacía -> LONG", migra({}).posicion === "LONG");

grupo("Encryption");
const datos = { v: 1, cfg: sinFee, trades: EJEMPLOS };
const t0 = Date.now();
const blob = await cifrar(datos, "contraseña-de-prueba");
const ms = Date.now() - t0;
ok("round-trip", JSON.stringify(await descifrar(blob, "contraseña-de-prueba")) === JSON.stringify(datos));
let malPass = false;
try { await descifrar(blob, "contraseña-equivocada"); } catch { malPass = true; }
ok("contraseña incorrecta falla", malPass);
let alterado = false;
const roto = blob.slice(0, -4) + (blob.slice(-4) === "AAAA" ? "BBBB" : "AAAA");
try { await descifrar(roto, "contraseña-de-prueba"); } catch { alterado = true; }
ok("payload alterado falla (AES-GCM autenticado)", alterado);
ok("dos cifrados del mismo dato difieren", blob !== await cifrar(datos, "contraseña-de-prueba"));
ok("base64url, apto para una URL", /^[A-Za-z0-9_-]+$/.test(blob));

grupo("Markup integrity");
const ids = new Set([...html.matchAll(/id="([A-Za-z0-9_-]+)"/g)].map((m) => m[1]));
const usados = new Set([...app.matchAll(/\$\("([A-Za-z0-9_-]+)"\)/g)].map((m) => m[1]));
const sinDom = [...usados].filter((i) => !ids.has(i));
// A missing id throws on load and aborts the whole script: that happened once.
ok("every $(id) exists in the DOM", sinDom.length === 0, sinDom.join(" "));
const iconos = new Set([...html.matchAll(/<use href="#([a-z0-9-]+)"/g)].map((m) => m[1]));
const simbolos = new Set([...html.matchAll(/<symbol[^>]*id="([a-z0-9-]+)"/g)].map((m) => m[1]));
const sinSimbolo = [...iconos].filter((i) => !simbolos.has(i));
ok("every icon exists in the sprite", sinSimbolo.length === 0, sinSimbolo.join(" "));

/* ---------- import: pasted cells ---------- */
{
  const f = filasPegadas("a\tb\n\nc\td\t\n");
  ok("paste splits on tabs and drops blank lines", f.length === 2 && f[1][1] === "d", JSON.stringify(f));
}

/* The whole point of the decimal choice: the same cell reads two ways, and the
   reading is the user's, never a per-cell guess. */
ok("60.000 is sixty thousand with comma decimals", numPegado("60.000", ",") === 60000);
ok("60.000 is sixty with period decimals",         numPegado("60.000", ".") === 60);
ok("2.410,50 with comma decimals",  numPegado("2.410,50", ",") === 2410.5);
ok("2,410.50 with period decimals", numPegado("2,410.50", ".") === 2410.5);
ok("0,33 with comma decimals",      numPegado("0,33", ",") === 0.33);
ok("currency and spaces are stripped", numPegado("$ 60.000 USDT", ",") === 60000);
ok("an empty cell is not a number",   Number.isNaN(numPegado("", ",")));
ok("text is not a number",            Number.isNaN(numPegado("n/a", ",")));
ok("a negative survives",             numPegado("-1.234,5", ",") === -1234.5);

// ISO is a format, not a guess: it must never reach the day/month choice.
ok("ISO ignores the day/month choice",
   fechaPegada("2026-09-01", true) === "2026-09-01" &&
   fechaPegada("2026-09-01", false) === "2026-09-01");
ok("01/09/2026 as day first", fechaPegada("01/09/2026", true)  === "2026-09-01");
ok("01/09/2026 as month first", fechaPegada("01/09/2026", false) === "2026-01-09");
ok("two-digit years become 20xx", fechaPegada("01/09/26", true) === "2026-09-01");
ok("31/02 is refused, not normalised", fechaPegada("31/02/2026", true) === null);
ok("13/13 is refused",                 fechaPegada("13/13/2026", true) === null);
ok("junk is refused",                  fechaPegada("hola", true) === null);

ok("locale decides the decimal default", decimalDe("es-AR") === "," && decimalDe("en-US") === ".");
ok("locale decides the date default", diaPrimeroDe("es-AR") === true && diaPrimeroDe("en-US") === false);

ok("headers map in Spanish", campoDe("STOP LOSS") === "sl" && campoDe(" Cripto ") === "cripto");
ok("headers map in English", campoDe("Entry") === "entrada" && campoDe("Leverage") === "x");
ok("an unknown header maps to nothing", campoDe("comentarios") === "");
ok("a header row is recognised", esCabecera(["DIA","CRIPTO","ENTRADA"]) === true);
ok("a data row is not a header", esCabecera(["01/09/2026","BTC","60.000"]) === false);
ok("one name alone is not a header", esCabecera(["cripto","x1","x2"]) === false);
ok("the column order comes from nuevo()", ORDEN[0] === "dia" && ORDEN[5] === "entrada");

{
  const filas = [["01/09/2026","BTC","USDT","LONG","5","60.000","L","58.000","65.000","64.800","M"],
                 ["02/09/2026","TRX","USDT","Short","2","0,33","l","0,35","0,26","0,34","m"]];
  const {nuevos, salteadas} = importar(filas, ORDEN, ",", true);
  ok("a pasted sheet round-trips", nuevos.length === 2 && salteadas.length === 0);
  ok("numbers land in the model", nuevos[0].entrada === 60000 && nuevos[0].sl === 58000);
  // A pasted sheet can carry 50x; the ceiling applies to it just the same.
  ok("pasted leverage is capped",
     importar([["01/09/2026", "BTC", "USDT", "LONG", "50"]], ORDEN.slice(0, 5), ",", true)
       .nuevos[0].x === 20);
  ok("order types are normalised", nuevos[0].ml === "LIMIT" && nuevos[0].lm === "MARKET");
  ok("SHORT is recognised in either language", nuevos[1].posicion === "SHORT");
  ok("the crypto is upper-cased", nuevos[1].cripto === "TRX");
  ok("dates reach the model as ISO", nuevos[1].dia === "2026-09-02");
  // A trade filed under the wrong date hides behind the month filter, so a row
  // with no readable date is refused instead of defaulted to today.
  const sin = importar([["","BTC"], ["01/09/2026","ETH"]], ORDEN, ",", true);
  ok("a row with no date is skipped, not dated today",
     sin.nuevos.length === 1 && sin.salteadas.length === 1);
  // A BTC pair shows sats in the table, so a pasted cell is read as sats too.
  const sats = importar([["01/09/2026","ETH","BTC","LONG","1","2.500"]], ORDEN.slice(0, 6), ",", true);
  ok("a BTC pair reads the price as sats", sats.nuevos[0].entrada === 0.000025,
     String(sats.nuevos[0].entrada));
  // An unmapped column must contribute nothing at all.
  const ign = importar([["01/09/2026","nota suelta"]], ["dia", ""], ",", true);
  ok("an unmapped column is ignored", ign.nuevos[0].cripto === "");
}


/* ---------- chart series ---------- */
{
  const p = (dia, retorno) => ({dia, retorno});
  const tres = [p("2026-09-01", 0.10), p("2026-09-20", -0.04), p("2026-10-05", 0.06)];

  const porTrade = serie(tres, false);
  /* The first point is an origin at zero: starting the line on the first trade put
     it at +30% with nothing to read that against. */
  ok("the line starts from zero", porTrade[0].inicio === true && porTrade[0].res === 0);
  ok("F starts at the default, not at zero", porTrade[0].f === 0.02);
  ok("the origin counts no trades", porTrade[0].n === 0);
  ok("one point per trade after the origin", porTrade.length === 4);

  const reales = porTrade.slice(1);
  /* Nothing is accumulated. Three earlier versions were wrong: summing `retorno`
     gave figures like +529%, because a leveraged return on one trade's margin says
     nothing about the account; and a running average could only decay towards its
     own mean. The cards report an average, so the chart reports the same kind of
     thing they do. */
  ok("a point is the trade's own result", near(reales[0].res, 0.10));
  ok("a loss shows as a loss, not a dip in a total", near(reales[1].res, -0.04));
  ok("nothing carries over between points", near(reales[2].res, 0.06));

  // Rolled up, a point is the month's average - the same figure the card shows.
  const porMes = serie(tres, true);
  ok("one point per month after the origin", porMes.length === 3,
     porMes.map((q) => q.x).join(" "));
  ok("the origin never absorbs a trade", porMes[0].inicio === true && porMes[0].n === 0);
  ok("a month point is that month's average", near(porMes[1].res, 0.03),
     String(porMes[1].res));
  ok("a month with one trade is that trade", near(porMes[2].res, 0.06));
  ok("the roll-up keeps every trade in the count", porMes[2].n === 3);

  // F is always the running one: every trade so far, not just this month's.
  ok("every point carries an F", porTrade.every((q) => q.f > 0));
  // F is computed from the hit rate, so a point that shows one shows the other.
  ok("every real point carries the hit rate too",
     reales.every((q) => q.win >= 0 && q.loss >= 0 && near(q.win + q.loss, 1)));
  ok("the hit rate is the running one", near(reales[1].win, 0.5) && near(reales[2].win, 2 / 3),
     `${reales[1].win} / ${reales[2].win}`);

  // One trade is an origin plus that trade: two points, which is a line.
  ok("one trade is still a line", serie([tres[0]], false).length === 2);
  ok("no trades, no series", serie([], true).length === 0);

  /* Dragging across the chart picks a stretch. Its average is over that stretch
     alone, while F and the hit rate are as of its last trade - what the sheet
     would have suggested at the time, not a figure recomputed as though the
     earlier history had never happened. */
  const rs = resumen(tres, 0, 2);
  ok("a full selection averages everything", near(rs.res, 0.12 / 3), String(rs.res));
  ok("a full selection counts everything", rs.n === 3);
  const medio = resumen(tres, 1, 2);
  ok("a partial selection averages only its own trades", near(medio.res, 0.01),
     String(medio.res));
  ok("a partial selection counts only its own trades", medio.n === 2);
  ok("the hit rate is as of the end of the stretch, not of the stretch",
     near(medio.win, 2 / 3), String(medio.win));
  ok("F is as of the end of the stretch",
     near(medio.f, stats(tres.slice(0, 3).map((q) => q.retorno)).f));
  ok("one point selected is that trade", near(resumen(tres, 1, 1).res, -0.04));
  // A selection dragged past the ends, or backwards, must not read off the array.
  ok("a selection past the end is clamped",
     resumen(tres, 1, 99).n === 2 && resumen(tres, -5, 1).n === 2);
  ok("a backwards selection still reads forwards", resumen(tres, 2, 0).n === 1);
  ok("no trades, no summary", resumen([], 0, 1) === null);

  /* The axis lands on round steps a reader can measure a point against, instead of
     running from one raw extreme to the other with nothing in between. */
  const e = escala([0, 0.37]);
  ok("zero is always in the scale", e.lo === 0);
  ok("the top is rounded out to a whole step", e.hi >= 0.37 && e.pasos.includes(e.hi),
     `${e.hi} / ${e.paso}`);
  ok("a negative run keeps zero in view", escala([-0.2, -0.05]).hi === 0);
  ok("both signs are covered when the run swings",
     escala([-0.18, 0.42]).lo < 0 && escala([-0.18, 0.42]).hi > 0);
  const chico = escala([0, 0.15]);
  ok("small ranges get small steps", chico.paso <= 0.05 && chico.hi >= 0.15,
     `${chico.paso} / ${chico.hi}`);
  ok("steps do not drift with floating point",
     chico.pasos.every((v) => near(v / chico.paso, Math.round(v / chico.paso))));
  const plano = escala([0, 0]);
  ok("a flat series still has a height", plano.hi > plano.lo);
  /* A trading diary is read by date, so the x axis carries several, not just its
     two ends - but not one per trade either. */
  ok("few points, every one labelled", indicesX(4).join(" ") === "0 1 2 3");
  ok("many points, about five labels", indicesX(40).length >= 4 && indicesX(40).length <= 6,
     indicesX(40).join(" "));
  ok("the last point is always labelled",
     [2, 7, 15, 40, 137].every((n) => indicesX(n).at(-1) === n - 1));
  ok("the first point is always labelled",
     [2, 7, 15, 40, 137].every((n) => indicesX(n)[0] === 0));
  ok("labels never repeat or go backwards",
     [7, 15, 40, 137].every((n) => indicesX(n).every((v, k, a) => k === 0 || v > a[k - 1])));
  ok("no label is crammed against the last one",
     [15, 40, 137].every((n) => {
       const a = indicesX(n);
       return a.at(-1) - a.at(-2) > (n - 1) / 12;
     }));
  ok("no points, no labels", indicesX(0).length === 0);

  ok("three to seven labels, never a wall of them",
     [escala([0, 0.37]), escala([-0.12, 0.47]), escala([0, 0.15])]
       .every((q) => q.pasos.length >= 3 && q.pasos.length <= 7));
}


/* ---------- ?demo data ----------
   A demo that trips the sheet's own warnings teaches the wrong thing, so every
   generated row has to pass the same checks a typed one does.

   demoTrades takes its randomness as an argument, so the suite feeds it a seeded
   generator: the invariants are checked over many draws without a test that fails
   once in a few thousand CI runs. */
{
  const lcg = (semilla) => () => (semilla = (semilla * 1103515245 + 12345) % 2147483648) / 2147483648;
  const dibujos = Array.from({length: 60}, (_, k) => demoTrades("2026-09-25", lcg(k + 1)));

  ok("three months are covered",
     dibujos.every((f) => new Set(f.map((t) => mesDe(t.dia))).size === 3));
  ok("the months are the three most recent",
     dibujos.every((f) => [...new Set(f.map((t) => mesDe(t.dia)))].sort().join(" ")
                          === "2026-07 2026-08 2026-09"));
  ok("a journal, not a log dump",
     dibujos.every((f) => f.length >= 12 && f.length <= 18),
     String(Math.min(...dibujos.map((f) => f.length))));
  ok("no future dates", dibujos.every((f) => f.every((t) => t.dia <= "2026-09-25")));
  /* Leverage is capped by convention, not by any exchange's limit: past 20x a
     stop-out and a liquidation are the same event. */
  ok("nothing is generated above the leverage ceiling",
     dibujos.every((f) => f.every((t) => t.x <= 20)),
     String(Math.max(...dibujos.flat().map((t) => t.x))));
  ok("every row is complete",
     dibujos.every((f) => f.every((t) => faltantes(t).length === 0)));
  ok("CRYPTO never equals PAIR", dibujos.every((f) => f.every((t) => !parChoca(t))));
  ok("STOP LOSS and TAKE PROFIT are on the right side",
     dibujos.every((f) => f.every((t) => !dirMal(t).sl && !dirMal(t).tp)));
  ok("every row yields a result",
     dibujos.every((f) => f.every((t) => calcRow(t, cfg).retorno !== null)));
  // Without both outcomes the statistics and the chart would have nothing to say.
  ok("wins and losses both occur", dibujos.every((f) => {
    const r = f.map((t) => calcRow(t, cfg).retorno);
    return r.some((v) => v > 0) && r.some((v) => v < 0);
  }));

  /* The query picks both the span and the kind of record, because the sheet says
     something different for each: a positive run lifts F off the 2% default, a
     negative one drives it to the 1% floor, a neutral one leaves it undecided. */
  ok("?demo alone is three neutral months",
     demoPedido("?demo").meses === 3 && demoPedido("?demo").sesgo === "neutral");
  ok("?demo-6months is six", demoPedido("?demo-6months").meses === 6);
  ok("?demo-1year is twelve", demoPedido("?demo-1year").meses === 12);
  ok("?demo-2years is twenty-four", demoPedido("?demo-2years").meses === 24);
  ok("the span can be written in Spanish", demoPedido("?demo-6meses").meses === 6);
  ok("no demo asked for, nothing generated",
     demoPedido("?otra=1") === null && demoPedido("") === null);
  ok("an absurd span is capped", demoPedido("?demo-99years").meses === 60);
  ok("a demo flag alongside others is still found", demoPedido("?x=1&demo-1year").meses === 12);
  ok("the bias is read", demoPedido("?demo-3months-positive").sesgo === "positivo"
                      && demoPedido("?demo-1year-negative").sesgo === "negativo");
  ok("a bias without a span still means three months",
     demoPedido("?demo-positive").meses === 3
     && demoPedido("?demo-positive").sesgo === "positivo");
  ok("the span reaches the generator",
     new Set(demoTrades("2026-09-25", lcg(2), 12).map((t) => mesDe(t.dia))).size === 12);

  /* The bias has to reach the verdict, not just the win rate: that is the whole
     point of being able to ask for a losing record. */
  /* A year, not three months: over a short span a run can genuinely fail to
     establish an edge - the formula needs five trades and expectancy above 1 - and
     staying undecided there is correct behaviour, not a broken bias. */
  const semillas = Array.from({ length: 20 }, (_, k) => k + 1);
  const veredicto = (sesgo, semilla) =>
    stats(demoTrades("2026-09-25", lcg(semilla), 12, sesgo)
      .map((t) => calcRow(t, cfg).retorno).filter((v) => v !== null)).f;
  const cuantos = (sesgo, pred) => semillas.filter((k) => pred(veredicto(sesgo, k))).length;
  /* A majority, not every draw: the bias is a probability, so a run can honestly
     fail to establish an edge. Asserting all twenty would be asserting the seeds,
     not the behaviour. */
  ok("a positive run usually lifts F off the default",
     cuantos("positivo", (f) => f > 0.02) >= 16,
     `${cuantos("positivo", (f) => f > 0.02)}/20`);
  ok("a negative run drives F to the floor",
     cuantos("negativo", (f) => f === 0.01) >= 18,
     `${cuantos("negativo", (f) => f === 0.01)}/20`);
  ok("a neutral run mostly stays undecided",
     cuantos("neutral", (f) => f === 0.02) >= 12,
     `${cuantos("neutral", (f) => f === 0.02)}/20`);
  ok("an unknown bias falls back to neutral",
     demoTrades("2026-09-25", lcg(1), 3, "ninguno").length > 0);

  // Crossing a year boundary is what a naive month subtraction gets wrong.
  ok("the three months cross the year cleanly",
     [...new Set(demoTrades("2026-01-10", lcg(7)).map((t) => mesDe(t.dia)))].sort().join(" ")
     === "2025-11 2025-12 2026-01");
  // Early in the month there are barely any days to place a trade on.
  const apretado = demoTrades("2026-03-02", lcg(3));
  ok("a near-empty month still produces valid rows",
     apretado.length >= 9 && apretado.every((t) => t.dia <= "2026-03-02"),
     String(apretado.length));
}


/* A helper shadowed by a local of the same name throws only on the path that hits
   it. It happened twice: `t` (the translation helper) against `t` the row in the
   render loops, and `txt` against a destructured `[caja, txt]`.
   Only real binding sites count: arrow and function parameters, array
   destructuring and for-of. Passing a function as a callback is not shadowing. */
const helpers = [...app.matchAll(/^(?:function|const)\s+([a-zA-Z_$][\w$]*)\s*(?:=\s*(?:\(|async|function)|\()/gm)]
  .map((m) => m[1]);
const ligados = new Set();
for (const m of app.matchAll(/\(([^()]*)\)\s*=>/g))            // (a, b) =>
  for (const p of m[1].split(",")) ligados.add(p.trim().replace(/[[\]{}.]/g, ""));
for (const m of app.matchAll(/^\s*function\s+[\w$]+\s*\(([^)]*)\)/gm))
  for (const p of m[1].split(",")) ligados.add(p.trim());
for (const m of app.matchAll(/(?:const|let)\s*\[([^\]]*)\]/g))  // const [a, b] =
  for (const p of m[1].split(",")) ligados.add(p.trim());
for (const m of app.matchAll(/for\s*\(\s*(?:const|let)\s+([\w$]+)\s+(?:of|in)\b/g))
  ligados.add(m[1]);
const sombreados = helpers.filter((h) => ligados.has(h));
ok("no helper is shadowed by a local of the same name", sombreados.length === 0, sombreados.join(" "));
for (const t of ["div", "section", "dialog", "footer", "table", "nav"]) {
  const abre = (html.match(new RegExp(`<${t}[ >]`, "g")) || []).length;
  const cierra = (html.match(new RegExp(`</${t}>`, "g")) || []).length;
  ok(`<${t}> balanced`, abre === cierra, `${abre}/${cierra}`);
}

console.log(`\nPBKDF2 600k: ${ms} ms`);
console.log(fallos ? `\n${fallos} of ${total} FAILED` : `\nAll passing (${total} checks)`);
process.exit(fallos ? 1 : 0);
