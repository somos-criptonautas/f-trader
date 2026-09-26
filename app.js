/* SPDX-License-Identifier: AGPL-3.0-or-later
   Copyright (C) 2026 Criptonautas */
"use strict";

const LIMIT = "LIMIT", MARKET = "MARKET";
/* Ceiling on leverage, by convention rather than by any exchange's limit: past
   this a stop-out and a liquidation are the same event, and the sheet exists to
   keep sizing grounded in what a retail account survives. It is stated in the
   glossary, the column tooltip and the README, and it is enforced here rather
   than left to discipline. */
const X_MAX = 20;

const LOCALES = ["es-AR","es-CL","es-CO","es-ES","es-MX","es-PE","es-UY","es-VE"];
const KEY = "registro-trades-v1", KEY_TEMA = "registro-trades-tema";


/* ---------- language ----------
   Spanish is the source; English is a full parallel set. The picker defaults to
   whatever the browser reports and is remembered per browser. Keys live on the
   elements as data-i18n (text), -html (text with markup), -title and -al (aria).
   Named txt(), not t(): `t` is the row variable in the render loops. */
const TX = {
/* Spanish shown in the HTML is harvested from the DOM by guardarEs(). Strings
   built at runtime have no element to read from, so they are listed here. */
es:{
"mes.todos":"TODO",
"f.agresiva":"POSICIÓN AGRESIVA: la fórmula sugiere tradear más porque las probabilidades son favorables.",
"f.neutral":"TAMAÑO DE POSICIÓN NEUTRAL: todavía no hay ventaja estadística demostrada y la fórmula se queda en el mínimo de referencia del 2%.",
"f.conservadora":"POSICIÓN CONSERVADORA: hay ventaja, pero es chica, y la fórmula sugiere arriesgar por debajo del mínimo de referencia.",
"a.masSl":"Más STOP LOSS que TAKE PROFIT.","a.slCerca":"¿STOP LOSS muy cercano a la ENTRADA?",
"a.leverage":"¿Apalancamiento muy alto en las pérdidas? ¿RRR bajo?",
"t.quitar":"quitar trade","t.quitarTxt":"Si eliminas el registro, deberás reingresarlo manualmente o ya no lo podrás ver.",
"t.vaciar":"vaciar la tabla","t.vaciarTxt":"Se quitan todos los trades cargados.",
"t.faltaRRR":"Faltan ENTRADA, STOP LOSS o TAKE PROFIT.",
"t.dirRRR":"El STOP LOSS o el TAKE PROFIT están del lado equivocado de la ENTRADA.",
"t.faltan":"Faltan: ","t.faltanTrade":"Faltan datos del trade",
"t.choca":"{c} no cotiza contra sí mismo. Cambia el PAR o la CRIPTO.",
"t.dir":"En {d} el {f} va {l} de la ENTRADA.","t.arriba":"por encima","t.abajo":"por debajo",
"t.parAl":"Moneda en que cotiza el par. Con BTC los precios se cargan en satoshis.",
"t.cal":"Elegir en el calendario",
"demo.h":"Reemplazar los trades cargados",
"demo.txt":"?demo genera tres meses de trades de ejemplo y pisa los que están en este navegador. Guardá el archivo cifrado antes si los querés conservar.",
"g.res":"resultado del trade","g.resMes":"promedio del mes",
"g.nota":"Cada trade cerrado, en orden: así llegaron las cifras de arriba a donde están hoy. Arrastrar o hacer clic sobre el gráfico para leer un período.",
"g.notaMes":"El promedio de cada mes, en orden: así llegaron las cifras de arriba a donde están hoy. Arrastrar o hacer clic sobre el gráfico para leer un período.",
"g.wl":"aciertos / pérdidas",
"g.ejeDia":"fecha","g.ejeMes":"mes","g.inicio":"inicio",
"g.ejeRes":"resultado\ndel trade","g.ejeResMes":"promedio\ndel mes",
"g.pista":"Clic o arrastre sobre el gráfico para ver un período.",
"g.pistaAbierta":"Clic de nuevo para cerrar el período.",
"g.pistaCerrada":"Período seleccionado. Clic en el gráfico para volver a verlo entero.",
"g.trades":"{n} trades",
"g.alt":"{n} trades cerrados: último resultado {a}, F TRADER {f}.",
/* Import. The static copy is harvested from the dialog in the HTML; these are
   the strings built at runtime, with no element to read them from. */
"imp.add":"agregar",
"imp.col":"columna {n}",
"imp.conteo":"{n} filas leídas.",
"imp.salteadas":"{n} sin fecha legible.",
"imp.mala":"no se lee",
"imp.hecho":"{n} trades importados",
"imp.salteadasTxt":"Se saltearon {n} filas porque no tienen una fecha que se pueda leer.",
"t.x":"Apalancamiento. Tope de 20x por convención: más allá, un stop y una liquidación son el mismo evento.",
"t.fila":"fila","t.sinFecha":"sin fecha",
"tbl.vacia":"Sin trades cargados.",
"tbl.vaciaSub":"Completar la primera fila: DIA, CRIPTO, PAR y ENTRADA alcanzan para empezar.",
"tbl.vaciaMes":"Sin trades en {m}.",
/* Field names for the screen reader: the table headers are not read per cell. */
"lb.dia":"DIA","lb.cripto":"CRIPTO","lb.par":"PAR","lb.posicion":"POSICION",
"lb.x":"Apalancamiento","lb.entrada":"ENTRADA","lb.ml":"Tipo de orden de entrada",
"lb.sl":"STOP LOSS","lb.tp":"TAKE PROFIT","lb.salida":"SALIDA","lb.lm":"Tipo de orden de salida",
"add.falta":"falta completar un trade","add.choca":"Hay una fila con la misma CRIPTO y PAR.",
"add.dir":"Hay un STOP LOSS o TAKE PROFIT del lado equivocado de la ENTRADA.",
"add.faltan":"Hay una fila con datos sin completar: ",
"p.guardar":"guardar archivo cifrado","p.guardarTxt":"El archivo se cifra en el navegador. Sin la contraseña no hay forma de recuperarlo.",
"p.cargar":"cargar archivo cifrado","p.cargarTxt":"Contraseña con la que se cifró el archivo.",
"p.enlace":"copiar enlace cifrado","p.enlaceTxt":"Los datos viajan cifrados dentro del enlace. La contraseña se comparte aparte.",
"p.abrir":"abrir enlace cifrado","p.abrirTxt":"Contraseña con la que se cifró el enlace.",
"p.corta":"La contraseña necesita al menos 8 caracteres.","p.noCoincide":"Las dos contraseñas no coinciden.","p.falta":"Falta la contraseña.",
"e.noAbre":"no se pudo abrir","e.noAbreTxt":"Contraseña incorrecta, o el archivo fue alterado.",
"e.formato":"archivo no reconocido","e.formatoTxt":"No tiene el formato esperado.",
"e.enlaceLargo":"enlace demasiado largo",
"e.enlaceLargoTxt":"El enlace tiene {n} caracteres y es probable que se corte al compartirlo. Conviene usar el archivo cifrado, o filtrar por un mes antes de copiar.",
"e.copiado":"enlace copiado","e.copiadoTxt":"Ya está en el portapapeles.","e.copiarMano":"copiar a mano",
"e.vaciarNav":"vaciar el navegador",
"e.vaciarNavTxt":"La descarga ya se disparó. Al vaciar se quitan los trades guardados en este navegador y sólo quedan dentro del archivo descargado.",
"e.sinCripto":"El cifrado necesita un contexto seguro (https:// o file://).",
"tema.auto":"automático","tema.claro":"claro","tema.oscuro":"oscuro",
"fee.raras":"{k} por encima del 1%. ¿Querías escribir 0,05 en vez de 5?",
"i.volver":"Volver a los campos","cfg.info":"INFO","i.ocultar":"OCULTAR","acc.comCorto":"comisiones",
"h1.corto":"F TRADER","h1.largo":" — CON CUÁNTO TRADEAR","cfg.info.t":"Cómo funciona cada campo"
},
en:{
"njs.h":"JavaScript required",
"njs.p1":"The sheet computes, stores and encrypts <strong>inside your browser</strong>: no server does the maths, which is also why no data ever leaves this machine. Without JavaScript there is nothing to show.",
"njs.p2":"If an extension is blocking it, allow it just for this site.",
"sub":"A sheet to log trades and know how much to trade with. A formula built by traders, for traders — and worth sticking to.",
"menu.h":"OPTIONS","menu.datos":"Data","menu.ajustes":"Settings","menu.ayuda":"Help",
"acc.save":"save encrypted file","acc.load":"load encrypted file","acc.link":"copy encrypted link",
"acc.com":"fees and contract types","acc.tema":"theme","acc.como":"how to use it",
"cerrar":"Close","cancelar":"cancel",
"ayuda.h":"HOW TO USE IT",
"ayuda.1":"Fill in the exchange data: fees, contract type and number format.",
"ayuda.2":"Log paper-trading and/or real positions, depending on your stage.",
"ayuda.3":"Watch how your results move the amount the formula suggests trading.",
"glos.h":"TABLE GLOSSARY",
"g.dia":"DAY","g.dia.d":"Date of the trade. With a month selected it shows the weekday; under «all months», the DD/MM/YY format.",
"g.cripto":"CRYPTO","g.cripto.d":"Asset traded: BTC, NANO, XMR.",
"g.par":"PAIR","g.par.d":"Currency the pair is quoted in. USDT for BTCUSDT or NANOUSDT. BTC for pairs like TRXBTC: prices are then entered and shown in <strong>satoshis</strong>.",
"g.pos":"POSITION","g.pos.d":"LONG for a buy expecting to sell higher; SHORT for a sell expecting to close lower.",
"g.x":"X","g.x.d":"Leverage (margin). At 1 it is off; it multiplies gains and losses alike. <strong>Capped at 20x</strong>: past that a stop-out and a liquidation are the same event.",
"g.entrada":"ENTRY","g.entrada.d":"Opening price of the position.",
"g.ml":"M/L","g.ml.d":"Entry order type. <strong>M</strong> = market, <strong>L</strong> = limit. Determines which fee applies.",
"g.sl":"STOP LOSS","g.sl.d":"Price limit for when the trade moves against the position.",
"g.tp":"TAKE PROFIT","g.tp.d":"Expected closing price in profit. The plan set before the trade.",
"g.salida":"EXIT","g.salida.d":"Actual closing price. This is what defines the result.",
"g.lm":"L/M","g.lm.d":"Exit order type. <strong>M</strong> = market, <strong>L</strong> = limit.",
"g.rrr":"RRR","g.rrr.d":"Risk/reward ratio, the percentage gap between STOP LOSS and TAKE PROFIT.",
"g.ret":"RETURN","g.ret.d":"Final result on margin, fees already deducted (when enabled).",
"cfg.h":"FEES AND CONTRACT TYPES","cfg.info.t":"How each field works","cfg.info":"INFO","i.ocultar":"OCULTAR","cfg.listo":"save and continue",
"pass.1":"password","pass.2":"repeat password","pass.limpiar":"clear the browser after downloading",
"sec1":"EXCHANGE DATA","sec2":"POSITIONS TABLE","sec3":"FORMULAS & RESULTS",
"lbl.margen":"CONTRACT TYPE","opt.lineal":"Linear (USDT)","opt.inverso":"Inverse (crypto)",
"lbl.num":"NUMBER FORMAT","lbl.com":"FEES %","sw.aplicar":"apply","sw.title":"Deduct fees from the Return",
"i.contrato":"CONTRACT TYPE","i.com":"FEES","i.num":"NUMBER FORMAT","i.como":"How does it work?","i.neg":"Negative value",
"i.contrato.p":"Defines how the return on margin is measured. It is a property of the exchange contract, separate from each row's PAIR.",
"i.lineal.d":"Margin is posted in USDT and the return divides by ENTRY. This is the norm for USDⓈ-M contracts on Binance, Bybit, MEXC or OKX.",
"i.inverso.d":"Margin is posted in the crypto itself and the return divides by EXIT. This matches coin-margined contracts.",
"i.com.p":"Expressed as a % per trade and charged on notional, not on the result: at X times leverage the cost is <code>rate × X</code>. It is deducted twice, once on entry and once on exit, according to each side's order type.",
"i.como.p":"With <strong>apply</strong> on, entry and exit fees are deducted. Unchecked, fees are ignored and the fields are disabled.",
"i.com.p2":"Set them to match your exchange and your tier there.",
"i.limit.d":"Rate for adding liquidity to the order book (maker). Usually the cheaper one.",
"i.market.d":"Rate for taking liquidity out (taker). Usually the dearer one.",
"i.neg.d":"That is a <em>rebate</em>: the exchange pays you for providing liquidity, so it adds to the Return instead of subtracting.",
"i.num.p":"Defines how thousands and decimals are separated across the sheet. The same number, in three conventions:",
"th.dia":"DAY","th.cripto":"CRYPTO","th.par":"PAIR","th.pos":"POSITION","th.x":"X",
"t.x":"Leverage. Capped at 20x by convention: past that a stop-out and a liquidation are the same event.",
"th.entrada":"ENTRY","th.sl":"STOP LOSS","th.tp":"TAKE PROFIT","th.salida":"EXIT",
"th.rrr":"RRR","th.ret":"RETURN",
"th.ml.t":"Entry order type. M = market, L = limit.","th.lm.t":"Exit order type. M = market, L = limit.",
"mes.al":"Month to show","add":"add","clear":"clear",
"hint.tabla":"With PAIR set to BTC prices are entered in satoshis; with USDT, in the pair's currency.",
"st.prom":"AVERAGE RESULT","st.wl":"WINS / LOSSES","st.f":"F TRADER – CAPITAL TO TRADE",
"st.prom.t":"Plain average of the Return across all closed trades.\nRead alongside mathematical expectancy and the RRR.",
"st.wl.t":"Share of trades closed in profit and at a loss. Ideally above 50% wins.",
"st.f.t":"Indicative reference for how much capital to risk per trade.",
"pie.h":"YOUR DATA",
"pie.1":"The sheet is open source and lives in your browser session — it can be lost if you share devices or clear their history.",
"pie.2":"From the buttons above you can download an encrypted file and copy a link to send.",
"pie.fina":"Encryption is AES-GCM 256 with PBKDF2-SHA256 and happens in the browser. Without the password the log is lost and there is no recovery.",
/* runtime strings */
"mes.todos":"ALL",
"f.agresiva":"AGGRESSIVE POSITION: the formula suggests trading more because the odds are in your favour.",
"f.neutral":"NEUTRAL POSITION SIZE: no statistical edge has been shown yet, so the formula stays at the 2% reference floor.",
"f.conservadora":"CONSERVATIVE POSITION: there is an edge, but a small one, so the formula suggests risking below the reference floor.",
"a.masSl":"More STOP LOSS than TAKE PROFIT.","a.slCerca":"Is the STOP LOSS too close to the ENTRY?",
"a.leverage":"Is leverage too high on the losses? Is the RRR low?",
"t.quitar":"remove trade","t.quitarTxt":"If you delete the record you will have to enter it again by hand, or you will no longer see it.",
"t.vaciar":"clear the table","t.vaciarTxt":"All logged trades are removed.",
"t.faltaRRR":"ENTRY, STOP LOSS or TAKE PROFIT are missing.","t.dirRRR":"The STOP LOSS or TAKE PROFIT is on the wrong side of the ENTRY.",
"t.faltan":"Missing: ","t.faltanTrade":"Trade data missing","t.choca":"{c} is not quoted against itself. Change the PAIR or the CRYPTO.",
"t.dir":"In {d} the {f} goes {l} the ENTRY.","t.arriba":"above","t.abajo":"below",
"t.parAl":"Currency the pair is quoted in. With BTC, prices are entered in satoshis.",
"t.cal":"Pick from the calendar",
"demo.h":"Replace the trades already here",
"demo.txt":"?demo generates three months of sample trades and overwrites the ones in this browser. Save the encrypted file first if you want to keep them.",
"g.res":"trade result","g.resMes":"monthly average","g.f":"F TRADER","g.wl":"wins / losses","g.ejeDia":"date","g.ejeMes":"month","g.inicio":"start",
"g.ejeRes":"trade\nresult","g.ejeResMes":"monthly\naverage",
"g.pista":"Click or drag across the chart to read a period.",
"g.pistaAbierta":"Click again to close the period.",
"g.pistaCerrada":"Period selected. Click the chart to see all of it again.",
"g.limpiar":"clear the selection","g.trades":"{n} trades",
"g.h":"HISTORY",
"est.h":"CURRENT STATE",
"est.p":"A summary of every closed trade so far: what they return on average, how many of them win, and how much capital the formula suggests trading with.",
"g.nota":"Every closed trade, in order: this is how the figures above arrived where they are today. Drag or click across the chart to read a period.",
"g.notaMes":"Each month's average, in order: this is how the figures above arrived where they are today. Drag or click across the chart to read a period.",
"g.alt":"{n} closed trades: latest result {a}, F TRADER {f}.",
"acc.imp":"import by pasting cells",
"imp.h":"IMPORT TRADES",
"imp.p":"Copy the cells in the spreadsheet and paste them here. Nothing leaves the browser.",
"imp.ayuda":"Works from LibreOffice, Excel, Google Sheets, .xlsx, .xlsm and .ods: the cells are copied, the file is never opened.",
"imp.zona":"Paste the cells",
"imp.ph":"Paste here (Ctrl+V)",
"imp.fecha":"date",
"imp.dma":"day/month/year",
"imp.mda":"month/day/year",
"imp.numero":"number",
"imp.add":"add",
"imp.col":"column {n}",
"imp.conteo":"{n} rows read.",
"imp.salteadas":"{n} with no readable date.",
"imp.mala":"unreadable",
"imp.hecho":"{n} trades imported",
"imp.salteadasTxt":"{n} rows were skipped because they have no readable date.",
"t.fila":"row","t.sinFecha":"no date",
"tbl.vacia":"No trades logged yet.",
"tbl.vaciaSub":"Fill in the first row: DAY, CRYPTO, PAIR and ENTRY are enough to start.",
"tbl.vaciaMes":"No trades in {m}.",
"lb.dia":"DAY","lb.cripto":"CRYPTO","lb.par":"PAIR","lb.posicion":"POSITION",
"lb.x":"Leverage","lb.entrada":"ENTRY","lb.ml":"Entry order type",
"lb.sl":"STOP LOSS","lb.tp":"TAKE PROFIT","lb.salida":"EXIT","lb.lm":"Exit order type",
"add.falta":"a trade is incomplete","add.choca":"A row has the same CRYPTO and PAIR.",
"add.dir":"A STOP LOSS or TAKE PROFIT is on the wrong side of the ENTRY.","add.faltan":"A row has missing data: ",
"p.guardar":"save encrypted file","p.guardarTxt":"The file is encrypted in the browser. Without the password there is no way back.",
"p.cargar":"load encrypted file","p.cargarTxt":"The password the file was encrypted with.",
"p.enlace":"copy encrypted link","p.enlaceTxt":"The data travels encrypted inside the link. Share the password separately.",
"p.abrir":"open encrypted link","p.abrirTxt":"The password the link was encrypted with.",
"p.corta":"The password needs at least 8 characters.","p.noCoincide":"The two passwords do not match.","p.falta":"Password missing.",
"e.noAbre":"could not open","e.noAbreTxt":"Wrong password, or the file has been tampered with.",
"e.formato":"file not recognised","e.formatoTxt":"It is not in the expected format.",
"e.enlaceLargo":"link too long","e.enlaceLargoTxt":"The link is {n} characters long and will most likely be cut when shared. Use the encrypted file instead, or filter to a single month first.",
"e.copiado":"link copied","e.copiadoTxt":"It is on the clipboard now.","e.copiarMano":"copy it by hand",
"e.vaciarNav":"clear the browser","e.vaciarNavTxt":"The download has started. Clearing removes the trades stored in this browser, leaving them only inside the downloaded file.",
"e.sinCripto":"Encryption needs a secure context (https:// or file://).",
"tema.auto":"automatic","tema.claro":"light","tema.oscuro":"dark",
"fee.raras":"{k} above 1%. Did you mean 0,05 instead of 5?",
"i.volver":"Back to the fields","i.ocultar":"HIDE","acc.comCorto":"fees",
"h1.corto":"F TRADER","h1.largo":" — HOW MUCH TO TRADE"
}};

let idioma = "es";
const txt = (k, vars) => {
  let v = (TX[idioma] && TX[idioma][k]) || TX.es[k] || k;
  if(vars) for(const [n, val] of Object.entries(vars)) v = v.replaceAll(`{${n}}`, val);
  return v;
};

/* ---------- state ---------- */
const cfg = { margen:"lineal", feesOn:true, feeLimit:0.02, feeMarket:0.05, locale:"", listo:false };
let trades = [];

/* ---------- dates: ISO in the model, DD/MM/YY on screen ---------- */
const hoy = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};
const isoADmy = iso => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
  return m ? `${m[3]}/${m[2]}/${m[1].slice(2)}` : "";
};
// DD/MM for the month view: "Lunes 7" was wide and repeated what the month picker
// already says. The year is redundant once a month is chosen.
const isoADm = iso => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
  return m ? `${m[3]}/${m[2]}` : "";
};

function armarIso(y, mo, d){
  const dt = new Date(Date.UTC(y, mo - 1, d));
  // rejects 31/02 and out-of-range months: Date would silently normalise them
  if(dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d) return null;
  return `${y}-${String(mo).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
}

function dmyAIso(s){
  const m = /^\s*(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{2}|\d{4})\s*$/.exec(s || "");
  if(!m) return null;
  let y = +m[3];
  if(y < 100) y += 2000;
  return armarIso(y, +m[2], +m[1]);
}

let mesFiltro = "todos";                 // "todos" o "YYYY-MM"
const mesDe = iso => (iso || "").slice(0, 7);

// Same cache, same reason: the month picker rebuilds every option on every render.
const FMT_MES = new Map();
function fmtFecha(loc, opts){
  const clave = (loc || "") + "|" + JSON.stringify(opts);
  let f = FMT_MES.get(clave);
  if(!f) FMT_MES.set(clave, f = new Intl.DateTimeFormat(loc || undefined, opts));
  return f;
}

function fmtMes(ym, loc){
  const t = fmtFecha(loc, {month:"long", year:"numeric", timeZone:"UTC"})
    .format(new Date(ym + "-01T00:00:00Z"));
  // English capitalises month names, Spanish does not. Lower case everywhere by
  // design: these are labels in a filter, not sentences.
  return t.charAt(0).toLowerCase() + t.slice(1);
}

/* The picker groups months under their year, so repeating it in every option was
   noise. Short form, lower case, same reasoning as fmtMes. */
function fmtMesCorto(ym, loc){
  const t = fmtFecha(loc, {month:"short", timeZone:"UTC"})
    .format(new Date(ym + "-01T00:00:00Z"));
  return t.charAt(0).toLowerCase() + t.slice(1).replace(/\.$/, "");
}

const nuevo = () => ({dia:hoy(),cripto:"",par:"USDT",posicion:"LONG",x:"",entrada:"",ml:"",sl:"",tp:"",salida:"",lm:""});

/* The two trades from the original sheet, as examples only. */
const EJEMPLOS = [
  {dia:"2026-09-01",cripto:"BTC",par:"USDT",posicion:"LONG", x:5,entrada:60000,ml:LIMIT,sl:58000,tp:65000,salida:64800,lm:MARKET},
  {dia:"2026-09-02",cripto:"TRX",par:"USDT",posicion:"SHORT",x:2,entrada:0.33, ml:LIMIT,sl:0.35, tp:0.26, salida:0.34,  lm:MARKET},
];

/* ---------- calculation ---------- */
/* <input type="number"> only accepts a period as the decimal mark, so anyone typing
   0,33 gets "" and the price silently becomes 0. The numeric fields are text and are
   parsed here, accepting both conventions.
   With a lone comma the decimal reading is assumed (0,33 -> 0.33), which is what a
   Spanish speaker expects. */
function aNumero(v){
  if(typeof v === "number") return isFinite(v) ? v : NaN;
  const t = String(v ?? "").trim().replace(/\s|\u00a0/g, "");
  if(!t) return NaN;
  const coma = t.lastIndexOf(","), punto = t.lastIndexOf(".");
  let limpio;
  if(coma > -1 && punto > -1)                       // el último separador manda
    limpio = coma > punto ? t.replace(/\./g, "").replace(",", ".") : t.replace(/,/g, "");
  else if(coma > -1) limpio = t.replace(",", ".");
  else limpio = t;
  if(!/^-?\d*\.?\d*$/.test(limpio)) return NaN;
  const n = Number(limpio);
  return isFinite(n) ? n : NaN;
}
const num = v => { const n = aNumero(v); return isFinite(n) ? n : 0; };

/* RRR normalised to 1:N, which is how a risk/reward is read.
   Reducing by greatest common divisor produced things like 13:45 — exact but
   unreadable; 1:3,46 says the same at a glance. */
function ratio(a, b){
  if(!isFinite(a) || !isFinite(b) || a === 0 || b === 0) return "REVISAR";
  return "1:" + nf(0, 2).format(Math.abs(b) / Math.abs(a));
}

// Fee for one side, as a fraction of margin. Negative = rebate.
function fee(tipo, X, c){
  if(!c.feesOn || !tipo) return 0;
  const tasa = tipo === LIMIT ? c.feeLimit : c.feeMarket;
  return (tasa / 100) * X;
}

/* Fields required by `completo`. If the row has been started but one is missing,
   it gets a faint border instead of leaving the Return blank without saying why. */
const REQ_NUM = ["x", "entrada", "sl", "tp", "salida"];
const REQ_SEL = ["ml", "lm"];
function faltantes(t){
  return [...REQ_NUM.filter(c => num(t[c]) === 0), ...REQ_SEL.filter(c => !t[c])];
}
// "Started" = something has been entered beyond the defaults.
const empezada = t => !!(t.cripto || "").trim() || faltantes(t).length < REQ_NUM.length + REQ_SEL.length;

/* In LONG the STOP LOSS sits below the ENTRY and the TAKE PROFIT above;
   in SHORT, the reverse. With the direction flipped the RRR means nothing. */
function dirMal(t){
  const ent = num(t.entrada), sl = num(t.sl), tp = num(t.tp);
  const long = t.posicion !== "SHORT";
  return {
    sl: !!(ent > 0 && sl > 0 && (long ? sl >= ent : sl <= ent)),
    tp: !!(ent > 0 && tp > 0 && (long ? tp <= ent : tp >= ent)),
  };
}

// BTC quoted against BTC is not a pair: the row drops out of the calculation.
const parChoca = t => !!(t.cripto && t.par && t.cripto.trim().toUpperCase() === t.par);

function calcRow(t, c){
  const choca = parChoca(t);
  const ent = num(t.entrada), sal = num(t.salida), sl = num(t.sl), tp = num(t.tp), X = num(t.x);

  const risk   = (ent > 0 && sl > 0) ? ent - sl : 0;
  const reward = (tp > 0 && ent > 0) ? tp - ent : 0;
  const mal    = dirMal(t);
  const rrr    = (mal.sl || mal.tp) ? "REVISAR"
               : (risk !== 0 && reward !== 0) ? ratio(risk, reward) : "REVISAR";

  let r = NaN;
  if(ent > 0 && sal > 0 && X > 0 && t.posicion){
    // inverse (margin in the crypto): ÷EXIT. linear (margin in USDT): ÷ENTRY.
    const den = c.margen === "inverso" ? sal : ent;
    r = (t.posicion === "LONG" ? (sal - ent) : (ent - sal)) / den * X;
  }

  // Flat fee on notional, not proportional to R: it cannot shrink a loss.
  const r2 = isFinite(r) ? r - fee(t.ml, X, c) : NaN;

  const completo = !!(t.posicion && ent && t.ml && sl && tp && sal && t.lm && X) && !choca;
  const retorno  = (completo && isFinite(r2)) ? r2 - fee(t.lm, X, c) : null;

  return {risk, reward, rrr, r, r2, retorno, completo, choca, mal, faltan: faltantes(t), empezada: empezada(t)};
}

/* Most a really good run may risk per trade, and the divisor that gets Kelly
   there. Kelly maxes out at 1, so F_DIV = 1 / F_MAX. */
const F_MAX = 0.15, F_DIV = 1 / F_MAX;
/* What to risk once the record says the edge is gone. The 2% default is the
   "no verdict yet" figure; this is the verdict. It is what makes the
   conservative message reachable - until now nothing could produce an F below
   the default, so that branch was dead. */
const F_MIN = 0.01;

function stats(rets){
  const n = rets.length;
  if(!n) return {n:0};
  const wins = rets.filter(v => v > 0), losses = rets.filter(v => v < 0);
  const mean = a => a.reduce((s, v) => s + v, 0) / a.length;

  const winRate  = wins.length / n;
  const lossRate = losses.length / n;
  const promedio = mean(rets);
  const avgWin   = wins.length ? mean(wins) : 0;
  const avgLoss  = losses.length ? Math.abs(mean(losses)) : 0;
  const rw       = avgLoss > 0 ? avgWin / avgLoss : null;   // era #REF!/#REF! en la hoja

  // Reconstructed: expectancy = win% × (avg win / |avg loss|) − loss%
  const esperanza = (n >= 5 && rw !== null) ? winRate * rw - lossRate : null;

  /* F trader: Kelly, divided down as a safety factor.
     The sheet's original divisor was /10/2, i.e. /20. Since a Kelly fraction can
     never exceed 1, that capped F at 5% - a 90% win rate at 10:1 reward still
     only reached 4.45%, so the number barely moved however well the run went.
     F_DIV is set so full Kelly lands on F_MAX instead. The shape of the formula
     is unchanged; only the divisor is. */
  let f = 0.02;
  if(esperanza !== null && esperanza > 1 && winRate > 0.5 && rw)
    f = Math.min((winRate - (1 - winRate) / rw) / F_DIV, F_MAX);
  // Expectancy at or below zero is a record that lost money on average. The
  // formula's own answer there is a negative Kelly - "do not trade" - so the
  // sheet says the least it can instead of repeating the neutral default.
  else if(esperanza !== null && esperanza <= 0)
    f = F_MIN;

  return {n, winRate, lossRate, promedio, avgWin, avgLoss, rw, esperanza, f};
}

/* Each line carries its tone, so the list can show what kind of message it is
   without the reader having to parse the sentence first. `aviso` is the neutral
   warning the other checks already were. */
function avisos(s){
  const out = [];
  if(!s.n) return out;
  const di = (t, tono) => out.push({t: txt(t), tono});
  if(s.winRate < 0.5 && s.promedio < 0)  di("a.masSl", "aviso");
  if(s.esperanza !== null && s.lossRate > 0.9) di("a.slCerca", "aviso");
  if(s.f > 0.02)       di("f.agresiva", "agresiva");
  else if(s.f === 0.02) di("f.neutral", "neutral");
  else                  di("f.conservadora", "conservadora");
  if(s.esperanza !== null && s.promedio < 0 && s.rw && (s.rw - 1) < -0.2 && s.winRate >= s.lossRate)
    di("a.leverage", "aviso");
  return out;
}

/* ---------- satoshis ----------
   Replaces the TableDivideOnChange macro. That one keyed off the CRYPTO (if it
   was not BTC, anything above 1 got divided by 1e8), which today corrupts any
   USDT pair: SOLUSDT at 180 would have been stored as 0.0000018.
   The correct trigger is the quote currency, not the asset traded.
   With PAIR = BTC the price is typed and shown in sats; the model stores BTC. */
const enSats = t => t?.par === "BTC";
// Declared here rather than beside CAMPOS: the importer below the same boundary
// needs it, and unlike CAMPOS it carries no markup.
const PRECIOS = ["entrada","sl","tp","salida"];

// 0.00000033 * 1e8 yields 33.000000000000004 in floating point: it must be rounded.
const btcASats = v => Math.round(Number(v) * 1e8 * 1e6) / 1e6;
const satsABtc = v => Number(v) / 1e8;

// model (quote unit) -> what the cell shows
// No thousands grouping: the field is for editing, not reading.
/* Constructing an Intl.NumberFormat costs ~274us; calling .format() on one that
   already exists costs ~5us. These run per price cell and per row on every
   keystroke, so the formatters are built once per (locale, shape) and kept.
   The locale is part of the key, so changing it simply lands on a new entry. */
const FMT = new Map();
function fmt(opts){
  const clave = (cfg.locale || "") + "|" + JSON.stringify(opts);
  let f = FMT.get(clave);
  if(!f) FMT.set(clave, f = new Intl.NumberFormat(cfg.locale || undefined, opts));
  return f;
}

const plano = n => fmt({useGrouping:false, maximumFractionDigits:12}).format(n);

const aPantalla = (t, v) => {
  if(v === "" || v === null || v === undefined) return "";
  const n = aNumero(v);
  if(!isFinite(n)) return "";
  return plano(enSats(t) ? btcASats(n) : n);
};
// what was typed -> model
const aModelo = (t, v) => {
  if(v === "" || v === null || String(v).trim() === "") return "";
  const n = aNumero(v);
  if(!isFinite(n)) return "";
  return enSats(t) ? satsABtc(n) : n;
};

/* ---------- formatting ---------- */
const nf = (d, x) => fmt({minimumFractionDigits:d,
                          maximumFractionDigits:x === undefined ? d : x});
const fmtPrecio = v => nf(2, 8).format(v);
const fmtPct    = v => nf(2).format(v * 100) + "%";
const fmtNum    = v => nf(2).format(v);
const fmtSats   = v => nf(0).format(Math.round(v * 1e8)) + " sats";


/* ---------- demo data ----------
   Opening the page with ?demo fills it with three months of plausible trades, so
   the statistics, the warnings and the chart have something to say without typing
   fifteen rows by hand. Not a fixture for the tests: those import the pure
   functions directly and assert on numbers they state themselves.

   Every row is deliberately valid - STOP LOSS and TAKE PROFIT on the right side
   of ENTRY for the direction, CRYPTO never equal to PAIR - because a demo that
   trips the sheet's own warnings teaches the wrong thing. */
const DEMO_BASE = {BTC:62000, ETH:2450, SOL:145, LINK:16.4, ADA:0.62, TRX:0.33};

// Price decimals follow the magnitude, the way an exchange quotes them.
const redondeo = v => v >= 100 ? Math.round(v)
                    : v >= 1   ? Math.round(v * 100) / 100
                               : Math.round(v * 1e4) / 1e4;

/* How long a demo to generate. `?demo` alone keeps the original three months;
   `?demo-6months` and `?demo-1year` say so outright. Returns months, 0 when the
   page was not asked for a demo at all. */
const DEMO_LAPSO = /(\d+)-?\s*(y|a|m)/i;
function demoPedido(busqueda){
  for(const clave of new URLSearchParams(busqueda || "").keys()){
    if(!/^demo(-|$)/i.test(clave)) continue;
    const resto = clave.slice(4).toLowerCase();
    const lapso = DEMO_LAPSO.exec(resto);
    // Capped: past five years the generator is making noise, not a journal.
    const meses = lapso
      ? Math.max(1, Math.min(/^[ya]/.test(lapso[2]) ? +lapso[1] * 12 : +lapso[1], 60))
      : 3;
    const sesgo = /positiv/.test(resto) ? "positivo"
                : /negativ/.test(resto) ? "negativo" : "neutral";
    return {meses, sesgo};
  }
  return null;
}

/* Three records worth looking at, because the sheet says something different in
   each: a positive run lifts F off the 2% default, a negative one drives it to the
   1% floor, and a neutral one leaves it undecided. A demo that only ever shows the
   middle case hides two thirds of what the page does. */
const DEMO_SESGO = {
  positivo: {gana:0.75, rr:[2.2, 3.5]},
  neutral:  {gana:0.55, rr:[1.5, 3.0]},
  negativo: {gana:0.28, rr:[0.7, 1.2]},
};

function demoTrades(hoyIso = hoy(), azar = Math.random, meses = 3, sesgo = "neutral"){
  const {gana: pGana, rr: [rrMin, rrMax]} = DEMO_SESGO[sesgo] || DEMO_SESGO.neutral;
  const entre = (a, b) => a + azar() * (b - a);
  const elegir = a => a[Math.floor(azar() * a.length)];
  const criptos = Object.keys(DEMO_BASE);
  const out = [];
  const [ay, am, ad] = hoyIso.split("-").map(Number);

  // Back to front, so the newest trades are the current month's.
  for(let atras = meses - 1; atras >= 0; atras--){
    const d = new Date(Date.UTC(ay, am - 1 - atras, 1));
    const y = d.getUTCFullYear(), mo = d.getUTCMonth() + 1;
    // Four to six a month: enough for the statistics to mean something, few
    // enough that the table still reads as a journal rather than a log dump.
    const tope = atras === 0 ? Math.max(1, ad - 1) : 28;   // never a future date
    const cuantos = Math.min(Math.floor(entre(4, 7)), tope);
    /* Spread across the month with jitter rather than drawn at random: picking
       days independently collides, and a deduplicated draw silently yields fewer
       trades than intended - worst of all early in the month, when there are few
       days to draw from. */
    const dias = Array.from({length:cuantos},
      (_, k) => 1 + Math.floor((k + entre(0.05, 0.95)) * tope / cuantos));

    for(const dia of dias){
      const cripto = elegir(criptos);
      const largo = azar() < 0.5;
      const entrada = redondeo(DEMO_BASE[cripto] * entre(0.85, 1.15));
      const riesgo = entre(0.02, 0.05);              // 2-5% away from entry
      const rr = entre(rrMin, rrMax);                // risk/reward the trade aimed at
      const signo = largo ? 1 : -1;
      const sl = redondeo(entrada * (1 - signo * riesgo));
      const tp = redondeo(entrada * (1 + signo * riesgo * rr));
      const gana = azar() < pGana;
      // A real exit lands near the target it hit, never exactly on it.
      const salida = redondeo(gana ? entrada + (tp - entrada) * entre(0.8, 1)
                                   : entrada + (sl - entrada) * entre(0.8, 1.1));
      out.push({
        dia: armarIso(y, mo, dia),
        cripto, par:"USDT", posicion: largo ? "LONG" : "SHORT",
        x: elegir([2, 3, 5, 10, 20]),
        entrada, ml: elegir([LIMIT, MARKET]), sl, tp, salida, lm: elegir([LIMIT, MARKET]),
      });
    }
  }
  return out;
}

/* ---------- chart series ----------
   Two lines, two axes, and nothing accumulated. The result line is each trade's
   own return; the F trader line is what the sheet would have suggested risking at
   that point in the history. Watching the second rise as the first settles is the
   question this whole page exists to answer.

   Nothing is summed. Three earlier attempts all failed on the same fact: `retorno`
   is the leveraged return on one trade's own margin, so a running total produced
   figures like +529% that describe no real account, and a running average could
   only decay towards its own mean. The cards report an average, not a total, and
   the chart now says the same kind of thing they do.

   One point per completed trade, or one per month - the month's average result -
   once there are too many to read. */
function serie(pares, porMes){
  if(!pares.length) return [];
  /* An origin at zero. Starting the line on the first trade put it at +30% with
     nothing to read that against; every point is now a move away from nothing.
     At zero trades the sheet's own answer for F is the 2% default, so that is
     where the second line starts - not at zero, which it never suggests. */
  const pts = [{x: porMes ? mesDe(pares[0].dia) : pares[0].dia,
                res:0, f:0.02, win:0, loss:0, n:0, del:0, i0:0, i1:-1, inicio:true}];
  const rets = [];
  let suma = 0, cuantos = 0;
  for(const p of pares){
    rets.push(p.retorno);
    /* ponytail: stats() re-reduces the whole prefix at every point, so this is
       O(n^2). At journal sizes it is microseconds; make stats incremental only if
       it ever shows up. */
    const st = stats(rets);
    const x = porMes ? mesDe(p.dia) : p.dia;
    // The origin never absorbs a trade: it is not a month, it is where the line begins.
    const ultimo = pts[pts.length - 1];
    const mismo = porMes && !ultimo.inicio && ultimo.x === x;
    if(mismo){ suma += p.retorno; cuantos++; } else { suma = p.retorno; cuantos = 1; }
    // F is always the running one: every trade so far, not just this month's.
    // The hit rate is carried too: F is computed from it, so reading one without
    // the other says nothing about why the suggestion moved.
    const punto = {x, res: suma / cuantos, f: st.f, win: st.winRate, loss: st.lossRate,
                   n: rets.length, del: cuantos,
                   // Which raw trades this point covers, so a selected range can be
                   // recomputed from the source rather than averaged out of averages.
                   i0: rets.length - cuantos, i1: rets.length - 1};
    if(mismo) pts[pts.length - 1] = punto; else pts.push(punto);
  }
  return pts;
}

/* What a selected stretch of the chart says. The average result is over that
   stretch alone; F and the hit rate are as of its last trade, because that is what
   the sheet would have suggested at the time - not a figure recomputed as though
   the earlier history had never happened. */
function resumen(pares, i0, i1){
  if(!pares.length) return null;
  const a = Math.max(0, Math.min(i0, pares.length - 1));
  const b = Math.max(a, Math.min(i1, pares.length - 1));
  const tramo = pares.slice(a, b + 1).map(p => p.retorno);
  const hasta = stats(pares.slice(0, b + 1).map(p => p.retorno));
  return {res: tramo.reduce((t, v) => t + v, 0) / tramo.length,
          f: hasta.f, win: hasta.winRate, loss: hasta.lossRate,
          n: tramo.length, i0: a, i1: b};
}

/* A trading diary is read by date, so the axis carries several, not just the two
   ends. About five, spread over the points, each landing on its own gridline. */
function indicesX(n, max = 5){
  if(n <= 0) return [];
  if(n <= max) return [...Array(n).keys()];
  const paso = Math.ceil((n - 1) / (max - 1));
  const out = [];
  for(let i = 0; i < n - 1; i += paso) out.push(i);
  // The last point always gets a label; drop the one before it if they collide.
  if(out[out.length - 1] > n - 1 - Math.ceil(paso / 2)) out.pop();
  out.push(n - 1);
  return out;
}

/* Round numbers a reader can use as a reference: 1, 2, 2.5 or 5 times a power of
   ten. An axis running from -10,57% to 12,15% with nothing in between gives
   nothing to measure a point against. */
const pasoLindo = bruto => {
  const pot = Math.pow(10, Math.floor(Math.log10(bruto)));
  return (([1, 2, 2.5, 5].find(mu => pot * mu >= bruto)) || 10) * pot;
};

/* The domain is widened to land on whole steps, which also gives the curve its
   headroom - so the drawing needs no vertical padding of its own and the HTML
   labels can sit at plain percentages of the box. */
function escala(vals, divisiones = 5){
  let lo = Math.min(...vals, 0), hi = Math.max(...vals, 0);
  if(hi === lo){ hi += 1; lo -= 1; }
  const paso = pasoLindo((hi - lo) / divisiones);
  lo = Math.floor(lo / paso) * paso;
  hi = Math.ceil(hi / paso) * paso;
  const pasos = [];
  // Built by multiplication, not repeated addition, which would drift.
  for(let k = 0; lo + k * paso <= hi + paso * 1e-9; k++) pasos.push(lo + k * paso);
  return {lo, hi, paso, pasos};
}

/* ---------- import: cells pasted from a spreadsheet ----------
   No file is ever read. Whatever the source app - LibreOffice, Excel, Sheets,
   .xlsx, .xlsm, .ods - the clipboard hands over tab-separated rows, so one
   parser covers every format without a ZIP reader or an XML walker. */

const MAX_FILAS = 5000;   // a paste far past this is a mistake, not a journal

function filasPegadas(texto){
  return String(texto || "").replace(/\r\n?/g, "\n").replace(/\n+$/, "")
    .split("\n").filter(l => l.trim() !== "")
    .slice(0, MAX_FILAS)
    .map(l => l.split("\t").map(c => c.trim()));
}

/* aNumero() reads what a person types, and nobody types thousands separators, so
   it takes "60.000" as 60. A spreadsheet cell does carry them, and which mark is
   the decimal one cannot be told from the cell alone: "60.000" is sixty thousand
   or sixty depending on the convention. So it is chosen once for the whole import
   and applied to every row - never guessed per cell, which is where silent
   mixed-parse bugs live. */
function numPegado(s, decimal){
  // currency symbols, % and stray letters come along with the cell text
  let t = String(s ?? "").trim().replace(/[^\d,.\-]/g, "");
  if(!t) return NaN;
  t = t.split(decimal === "," ? "." : ",").join("");
  if(decimal === ",") t = t.replace(",", ".");
  if(!/^-?\d*\.?\d*$/.test(t) || !/\d/.test(t)) return NaN;
  const n = Number(t);
  return isFinite(n) ? n : NaN;
}

/* ISO is a format, not a guess: a four-digit leading group can only be read one
   way, so it never reaches the day/month choice. Everything else is two numbers
   and a year, and which one is the day is the user's call - the same choice for
   every row. Getting it wrong is silent (the trade files into the wrong month and
   the filter then hides it), which is why the dialog previews the result. */
function fechaPegada(s, diaPrimero){
  const t = String(s ?? "").trim();
  const iso = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(t);
  if(iso) return armarIso(+iso[1], +iso[2], +iso[3]);
  const m = /^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{2}|\d{4})$/.exec(t);
  if(!m) return null;
  let y = +m[3];
  if(y < 100) y += 2000;
  return diaPrimero ? armarIso(y, +m[2], +m[1]) : armarIso(y, +m[1], +m[2]);
}

// Which order the locale writes, so the default matches what the sheet likely holds.
const diaPrimeroDe = loc => {
  const p = new Intl.DateTimeFormat(loc || undefined, {day:"2-digit", month:"2-digit", year:"numeric"})
    .formatToParts(new Date(Date.UTC(2026, 8, 1)));
  return p.findIndex(x => x.type === "day") < p.findIndex(x => x.type === "month");
};
const decimalDe = loc => new Intl.NumberFormat(loc || undefined)
  .formatToParts(1.1).find(p => p.type === "decimal")?.value || ".";

/* The field order of the table, taken from nuevo() so the two can never drift.
   A selection copied out of this sheet maps onto itself with no header row. */
const ORDEN = Object.keys(nuevo());

/* Header names as the original sheet, this one, and the usual exchange exports
   write them, in both languages. Anything unrecognised is left for the user. */
const ALIAS = {
  dia:["dia","día","day","fecha","date","time","hora"],
  cripto:["cripto","crypto","moneda","coin","activo","asset","symbol","simbolo","símbolo","ticker","mercado","market"],
  par:["par","pair","quote","cotizacion","cotización"],
  posicion:["posicion","posición","position","lado","side","direccion","dirección","tipo"],
  x:["x","apalancamiento","leverage","lev","apalanc"],
  entrada:["entrada","entry","precio de entrada","entry price","open","apertura","precio"],
  ml:["ml","orden de entrada","entry order","tipo de orden de entrada","tipo de entrada"],
  sl:["sl","stop loss","stoploss","stop","stop-loss"],
  tp:["tp","take profit","takeprofit","take-profit","target","objetivo"],
  salida:["salida","exit","precio de salida","exit price","close","cierre","exit price"],
  lm:["lm","orden de salida","exit order","tipo de orden de salida","tipo de salida"],
};
const canon = s => String(s ?? "").trim().toLowerCase().replace(/\s+/g, " ");
function campoDe(cabecera){
  const c = canon(cabecera);
  if(!c) return "";
  for(const campo of ORDEN) if(ALIAS[campo].includes(c)) return campo;
  return "";
}
/* A first row counts as a header only if it names two fields and holds no date.
   One match is a coincidence; a date means it is already data. */
function esCabecera(fila){
  if(!fila) return false;
  const nombrados = new Set(fila.map(campoDe).filter(Boolean));
  return nombrados.size >= 2 && !fila.some(c => fechaPegada(c, true) || fechaPegada(c, false));
}

/* Rows in, trades out. Returns the rows it refused instead of filing them under
   today: a trade with no readable date would land in the wrong month silently. */
function importar(filas, mapa, decimal, diaPrimero){
  const nuevos = [], salteadas = [];
  filas.forEach((fila, n) => {
    const cru = {};
    mapa.forEach((campo, k) => {
      if(campo && fila[k] !== undefined && fila[k] !== "") cru[campo] = fila[k];
    });
    const dia = fechaPegada(cru.dia, diaPrimero);
    if(!dia){ salteadas.push(n + 1); return; }
    const t = nuevo();
    t.dia = dia;
    if(cru.cripto) t.cripto = String(cru.cripto).toUpperCase().slice(0, 12);
    if(cru.par) t.par = /btc|sat/i.test(cru.par) ? "BTC" : "USDT";
    if(cru.posicion) t.posicion = /^(s|short|venta|sell|corto)/i.test(cru.posicion) ? "SHORT" : "LONG";
    for(const campo of ["ml", "lm"]) if(cru[campo])
      t[campo] = /^(m|market|mercado)/i.test(cru[campo]) ? MARKET
               : /^(l|lim)/i.test(cru[campo])            ? LIMIT : "";
    // A pasted sheet can carry 50x; the ceiling applies to it just the same.
    if(cru.x !== undefined){
      const v = numPegado(cru.x, decimal);
      if(isFinite(v)) t.x = Math.min(v, X_MAX);
    }
    /* Prices arrive in the unit the cell shows. For a BTC pair that is sats, both
       here and in the old sheet, so the conversion the table applies to typed
       input applies to a pasted cell too. */
    for(const campo of PRECIOS) if(cru[campo] !== undefined){
      const v = numPegado(cru[campo], decimal);
      if(isFinite(v)) t[campo] = enSats(t) ? satsABtc(v) : v;
    }
    nuevos.push(t);
  });
  return {nuevos, salteadas};
}

/* ---------- encryption (WebCrypto, no dependencies) ---------- */
const te = new TextEncoder(), td_ = new TextDecoder();
const b64u  = b => btoa(String.fromCharCode(...b)).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
const ub64u = s => Uint8Array.from(atob(s.replace(/-/g,"+").replace(/_/g,"/")), c => c.charCodeAt(0));

async function derivar(pass, salt){
  const km = await crypto.subtle.importKey("raw", te.encode(pass), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    {name:"PBKDF2", salt, iterations:600000, hash:"SHA-256"},
    km, {name:"AES-GCM", length:256}, false, ["encrypt","decrypt"]);
}
async function cifrar(obj, pass){
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv   = crypto.getRandomValues(new Uint8Array(12));
  const key  = await derivar(pass, salt);
  const ct   = new Uint8Array(await crypto.subtle.encrypt({name:"AES-GCM", iv}, key, te.encode(JSON.stringify(obj))));
  const out  = new Uint8Array(16 + 12 + ct.length);
  out.set(salt, 0); out.set(iv, 16); out.set(ct, 28);
  return b64u(out);
}
async function descifrar(s, pass){
  const raw = ub64u(s);
  const key = await derivar(pass, raw.slice(0, 16));
  const pt  = await crypto.subtle.decrypt({name:"AES-GCM", iv:raw.slice(16, 28)}, key, raw.slice(28));
  return JSON.parse(td_.decode(pt));
}


// Compatibility with data saved when the order types carried " (*)".
const limpiaOrden = v => v === "LIMIT (*)" ? LIMIT : v === "MARKET (*)" ? MARKET : v;
// Rows predating the PAIR column: assumed USDT, which leaves the stored number as is.
// With no empty option in POSITION, a blank saved row would have no possible representation.
const migra = t => ({...t, par:t.par || "USDT", posicion:t.posicion || "LONG",
                     // Rows saved before the ceiling existed are brought under it.
                     x: t.x !== "" && t.x !== undefined && +t.x > X_MAX ? X_MAX : t.x,
                     ml:limpiaOrden(t.ml), lm:limpiaOrden(t.lm)});


/* ======================================================================
   Everything above this line is free of the DOM and is what test.mjs imports.
   Everything below touches the document.
   ====================================================================== */

/* The Spanish copy is read from the DOM once, so there is a single source. */
function guardarEs(){
  for(const el of document.querySelectorAll("[data-i18n],[data-i18n-html],[data-i18n-title],[data-i18n-al],[data-i18n-ph]")){
    const d = el.dataset;
    if(d.i18n      && !(d.i18n      in TX.es)) TX.es[d.i18n]      = el.textContent.trim();
    if(d.i18nHtml  && !(d.i18nHtml  in TX.es)) TX.es[d.i18nHtml]  = el.innerHTML.trim();
    if(d.i18nTitle && !(d.i18nTitle in TX.es)) TX.es[d.i18nTitle] = el.getAttribute("title") || "";
    if(d.i18nAl    && !(d.i18nAl    in TX.es)) TX.es[d.i18nAl]    = el.getAttribute("aria-label") || "";
    if(d.i18nPh    && !(d.i18nPh    in TX.es)) TX.es[d.i18nPh]    = el.getAttribute("placeholder") || "";
  }
}

function aplicarIdioma(){
  document.documentElement.lang = idioma;
  document.title = txt("h1.corto") + txt("h1.largo");
  for(const el of document.querySelectorAll("[data-i18n],[data-i18n-html],[data-i18n-title],[data-i18n-al],[data-i18n-ph]")){
    const d = el.dataset;
    if(d.i18n)      el.textContent = txt(d.i18n);
    if(d.i18nHtml)  el.innerHTML   = txt(d.i18nHtml);
    if(d.i18nTitle) el.title       = txt(d.i18nTitle);
    if(d.i18nAl)    el.setAttribute("aria-label", txt(d.i18nAl));
    if(d.i18nPh)    el.placeholder = txt(d.i18nPh);
  }
  if(typeof pintarMeses === "function" && $("mes")) pintarMeses();
  if(typeof aplicarTema === "function") aplicarTema();
  if(typeof render === "function" && $("tbody")){ render(); refresh(); }
}

/* ---------- render ---------- */
const $ = id => document.getElementById(id);
const tbody = $("tbody");

const CAMPOS = [
  ["dia","fecha","w-dia"], ["cripto","text","w-cri"], ["par","sel-par","w-par"], ["posicion","sel-pos","w-pos"],
  ["x","number","w-x"], ["entrada","precio","w-pri pegado"], ["ml","sel-ord","w-ord"],
  ["sl","precio","w-pri"], ["tp","precio","w-pri"], ["salida","precio","w-pri w-sal pegado"],
  ["lm","sel-ord","w-ord"],
];
// Without this a screen reader announces eleven unnamed text fields per row.
// The names live in TX so they follow the language, like everything else read aloud.
const etiqueta = campo => txt("lb." + campo);
// RISK/REWARD live inside RRR; R/R2 inside RETURN. Still computed, shown in the tooltip.
const VISIBLES = ["rrr","retorno"];

const enFiltro = t => mesFiltro === "todos" || mesDe(t.dia) === mesFiltro;

// Sorted on load and when a date is confirmed, never while another field is being typed:
// reordering under the cursor would be worse than the disorder.
function ordenar(){
  trades.sort((a, b) => (a.dia || "9999").localeCompare(b.dia || "9999"));
}

/* refresh() ran a querySelector per field per row on every keystroke: with 100 trades
   that is over a thousand DOM lookups per character. References are cached at build time. */
let refs = [];

function render(){
  tbody.replaceChildren();
  refs = [];
  trades.forEach((t, i) => {
    if(!enFiltro(t)) return;              // el índice i sigue siendo el del array completo
    const ref = refs[i] = {campo:{}, calc:{}};
    const tr = document.createElement("tr");
    CAMPOS.forEach(([campo, tipo, cls]) => {
      const td = document.createElement("td");
      td.className = cls;
      let el;
      if(tipo === "sel-pos" || tipo === "sel-ord" || tipo === "sel-par"){
        el = document.createElement("select");
        const opts = tipo === "sel-pos" ? [["LONG","LONG"], ["SHORT","SHORT"]]
                   : tipo === "sel-par" ? [["USDT","USDT"], ["BTC","BTC"]]
                   // M/L: the letter is shown, the stored value stays MARKET/LIMIT
                   : [["", ""], ["M", MARKET], ["L", LIMIT]];
        opts.forEach(([etiqueta, valor]) => el.add(new Option(etiqueta, valor)));
        if(tipo === "sel-ord") el.title = "M = market, L = limit";
        el.value = t[campo] || (tipo === "sel-par" ? "USDT" : tipo === "sel-pos" ? "LONG" : "");
        if(tipo === "sel-par") el.title = txt("t.parAl");
      } else {
        el = document.createElement("input");
        if(tipo === "fecha"){
          el.type = "text";
          if(mesFiltro === "todos"){
            el.inputMode = "numeric"; el.maxLength = 10;
            el.placeholder = "DD/MM/AA"; el.value = isoADmy(t[campo]);
          } else {
            // With a month pinned, free text does not apply: editing goes through the calendar.
            el.readOnly = true; el.placeholder = txt("t.sinFecha");
            el.value = isoADm(t[campo]);
          }
        } else if(tipo === "precio"){
          el.type = "text"; el.inputMode = "decimal";
          el.placeholder = enSats(t) ? "sats" : "";
          el.value = aPantalla(t, t[campo]);
        } else if(tipo === "number"){
          el.type = "text"; el.inputMode = "decimal";
          el.value = t[campo] === "" || t[campo] == null ? "" : plano(aNumero(t[campo]));
          // The ceiling is stated on the field where it is met, not only in the glossary.
          if(campo === "x") el.title = txt("t.x");
        } else {
          el.type = "text";
          if(campo === "cripto") el.placeholder = "BTC";
          el.value = t[campo] ?? "";
        }
      }
      el.dataset.i = i; el.dataset.campo = campo;
      el.setAttribute("aria-label", `${etiqueta(campo)}, ${txt("t.fila")} ${i + 1}`);
      ref.campo[campo] = el;

      if(tipo === "fecha"){
        // The text field pins the DD/MM/YY format; the native picker comes back
        // as a button, because type=date renders the date in the system locale.
        const caja = document.createElement("div");
        caja.className = "fecha";
        const picker = document.createElement("input");
        picker.type = "date"; picker.className = "oculto-picker"; picker.tabIndex = -1;
        picker.value = t[campo] || "";
        // A trade cannot be from tomorrow: the ceiling is always today.
        picker.max = hoy();
        if(mesFiltro !== "todos"){          // y además, sólo días del mes que se está viendo
          const ini = new Date(mesFiltro + "-01T00:00:00Z");
          const fin = new Date(Date.UTC(ini.getUTCFullYear(), ini.getUTCMonth() + 1, 0))
            .toISOString().slice(0, 10);
          picker.min = mesFiltro + "-01";
          picker.max = fin < hoy() ? fin : hoy();
        }
        picker.onchange = () => {
          trades[i].dia = picker.value;
          el.value = mesFiltro === "todos" ? isoADmy(picker.value) : isoADm(picker.value);
          el.classList.remove("malo");
          refresh();
        };
        const abrirCal = () => {
          picker.value = trades[i].dia || "";
          if(picker.showPicker) picker.showPicker(); else picker.focus();
        };
        const bt = document.createElement("button");
        bt.type = "button"; bt.className = "calbtn";
        bt.title = txt("t.cal"); bt.setAttribute("aria-label", txt("t.cal"));
        bt.innerHTML = '<svg class="ph"><use href="#ph-dt-calendar-blank"/></svg>';
        bt.onclick = abrirCal;
        // Tapping anywhere in the cell opens the calendar, not just the icon.
        // To type the date by hand, Tab into it: that does not fire the click.
        el.onclick = abrirCal;
        caja.onclick = e => { if(e.target === caja) abrirCal(); };
        caja.append(bt, el, picker);      // icono a la izquierda del día
        td.append(caja);
      } else td.append(el);
      tr.append(td);
    });
    for(const c of VISIBLES){
      const td = document.createElement("td");
      td.className = "calc " + (c === "retorno" ? "w-ret out" : "w-rrr");
      td.dataset.i = i; td.dataset.calc = c;
      ref.calc[c] = td;
      tr.append(td);
    }
    const tdDel = document.createElement("td");
    tdDel.className = "w-del";
    const b = document.createElement("button");
    b.className = "del";
    // The cross read as "close"; a bin says delete without ambiguity.
    b.innerHTML = '<svg class="ph"><use href="#ph-dt-trash"/></svg>';
    b.title = txt("t.quitar");
    b.setAttribute("aria-label", txt("t.quitar"));
    b.onclick = async () => {
      // Only asks when there is something to lose: autosave is immediate and there is no undo.
      if(empezada(trades[i]) &&
         !await confirmar(txt("t.quitar"), txt("t.quitarTxt"))) return;
      trades.splice(i, 1);
      ordenar(); pintarMeses(); render(); refresh();
    };
    tdDel.append(b); tr.append(tdDel);
    tbody.append(tr);
  });
  vacia();
}

/* The scaffolding row means the table is never literally empty, so a first-time
   visitor sees column headers and nothing else. This says what to do with them. */
function vacia(){
  if(trades.some(t => enFiltro(t) && empezada(t))) return;
  const tr = document.createElement("tr");
  tr.className = "vacia";
  const td = document.createElement("td");
  td.colSpan = document.querySelector("#tabla thead tr").cells.length;
  const h = document.createElement("strong");
  h.textContent = mesFiltro === "todos"
    ? txt("tbl.vacia") : txt("tbl.vaciaMes", {m: fmtMes(mesFiltro, cfg.locale)});
  const p = document.createElement("span");
  p.textContent = txt("tbl.vaciaSub");
  td.append(h, p); tr.append(td); tbody.append(tr);
}

function pinta(td, v, tipo){
  td.classList.remove("pos", "neg", "na");
  // No value is always a dash: the warnings live in the tooltip and the row borders,
  // so RRR and RETURN need no width for "REVISAR" or "COMPLETAR".
  if(v === null || v === undefined || v === "REVISAR" ||
     (typeof v === "number" && !isFinite(v))){
    td.textContent = "—"; td.classList.add("na"); return;
  }
  if(typeof v === "string"){ td.textContent = v; return; }
  td.textContent = fmtPct(v);
  td.classList.add(v >= 0 ? "pos" : "neg");
}

function refresh(){
  const rets = [], retsMes = [], paresMes = [];
  trades.forEach((t, i) => {
    const c = calcRow(t, cfg);
    if(c.retorno !== null){
      rets.push(c.retorno);
      // trades is kept sorted by date, so the chart inherits the order for free
      if(enFiltro(t)){ retsMes.push(c.retorno); paresMes.push({dia:t.dia, retorno:c.retorno}); }
    }
    const ref = refs[i];
    if(!ref) return;                     // fila fuera del filtro: no hay celdas que pintar

    const tdR = ref.calc.rrr;
    if(tdR){
      pinta(tdR, c.rrr, "rrr");
      // RISK and REWARD are price differences: they carry the pair's unit.
      const uni = v => enSats(t) ? `${nf(0,6).format(btcASats(v))} sats` : `${fmtPrecio(v)} ${t.par || "USDT"}`;
      tdR.title = (c.mal.sl || c.mal.tp)
          ? txt("t.dirRRR")
        : c.rrr === "REVISAR" ? txt("t.faltaRRR")
        : `RISK ${uni(c.risk)}\nREWARD ${uni(c.reward)}`;
    }
    const tdQ = ref.calc.retorno;
    if(tdQ){
      pinta(tdQ, c.retorno, "retorno");
      tdQ.title = c.retorno !== null ? `R ${fmtPct(c.r)}\nR2 ${fmtPct(c.r2)}`
        : c.faltan.length ? txt("t.faltan") + c.faltan.join(", ").toUpperCase()
        : txt("t.faltanTrade");
    }
    // CRYPTO equal to PAIR: flagged red and the row stays out of the statistics.
    const elCri = ref.campo.cripto, elPar = ref.campo.par;
    if(elCri) elCri.classList.toggle("malo", c.choca);
    if(elPar) elPar.classList.toggle("malo", c.choca);
    if(c.choca && tdQ){
      tdQ.textContent = "—";
      tdQ.classList.remove("pos", "neg"); tdQ.classList.add("na");
      tdQ.title = txt("t.choca", {c: t.cripto});
    }
    // Prevents the clash: the option matching the CRYPTO is disabled.
    if(elPar) for(const o of elPar.options)
      o.disabled = o.value !== t.par && o.value === (t.cripto || "").trim().toUpperCase();

    // Required fields left empty, only once the row has been started.
    for(const campo of [...REQ_NUM, ...REQ_SEL]){
      const el = ref.campo[campo];
      if(el) el.classList.toggle("falta", c.empezada && !c.completo && c.faltan.includes(campo));
    }

    // STOP LOSS / TAKE PROFIT on the wrong side of the ENTRY for the chosen direction.
    const dir = t.posicion === "SHORT" ? "SHORT" : "LONG";
    for(const [campo, lado] of [["sl", txt(dir === "LONG" ? "t.abajo" : "t.arriba")],
                                ["tp", txt(dir === "LONG" ? "t.arriba" : "t.abajo")]]){
      const el = ref.campo[campo];
      if(!el) continue;
      const roto = c.mal[campo];
      el.classList.toggle("malo", roto);
      if(roto) el.title = txt("t.dir", {d: dir, f: campo === "sl" ? "STOP LOSS" : "TAKE PROFIT", l: lado});
    }

    // With PAIR = BTC the cell shows sats; the tooltip gives the BTC decimal.
    for(const campo of PRECIOS){
      const el = ref.campo[campo];
      const v = num(t[campo]);
      // do not overwrite the direction warning set by the previous block
      if(el && !el.classList.contains("malo"))
        el.title = (enSats(t) && v > 0) ? `${nf(2,8).format(v)} BTC` : "";
    }
  });

  const s = stats(rets), sm = stats(retsMes);
  const na = "—";
  const val = (o, k) => !o.n ? na
    : k === "esperanza" ? (o.esperanza === null ? "agregar trades" : fmtNum(o.esperanza))
    : fmtPct(o[k]);

  // Large figure: the whole history. Smaller, below: the filtered month.
  // Mathematical expectancy no longer has a card: it feeds F TRADER and nothing else.
  $("s-f").textContent    = val(s, "f");
  $("s-prom").textContent = val(s, "promedio");
  $("s-win").textContent  = val(s, "winRate");
  $("s-loss").textContent = val(s, "lossRate");

  for(const [caja, linea] of [
        [$("s-f"),    () => `${nombreMes()}: ${val(sm, "f")}`],
        [$("s-prom"), () => `${nombreMes()}: ${val(sm, "promedio")}`],
        [$("s-win"),  () => `${nombreMes()}: ${val(sm, "winRate")} / ${val(sm, "lossRate")}`]]){
    const bajo = caja.closest(".stat").querySelector(".mesval");
    if(mesFiltro === "todos") bajo.hidden = true;
    else { bajo.hidden = false; bajo.textContent = linea(); }
  }

  dibujarGrafico(paresMes);
  marcarScroll();
  const box = $("avisos");
  box.replaceChildren();
  const ICONO = {agresiva:"#ph-dt-arrow-circle-up", neutral:"#ph-dt-minus-circle",
                 conservadora:"#ph-dt-arrow-circle-down", aviso:"#ph-dt-warning-circle"};
  for(const a of avisos(s)){
    const d = document.createElement("div");
    d.className = "aviso " + a.tono;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "ph");
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", ICONO[a.tono]);
    svg.append(use);
    const sp = document.createElement("span");
    sp.textContent = a.t;
    d.append(svg, sp);
    box.append(d);
  }
  guardarLocal();
}

/* ---------- table events ---------- */
tbody.addEventListener("input", e => {
  const {i, campo} = e.target.dataset;
  if(campo === undefined || campo === "dia") return;   // la fecha se valida al salir
  if(PRECIOS.includes(campo)) trades[i][campo] = aModelo(trades[i], e.target.value);
  else if(campo === "x"){
    const n = aNumero(e.target.value);
    trades[i].x = e.target.value.trim() === "" || !isFinite(n) ? "" : n;
  }
  else trades[i][campo] = e.target.value;
  refresh();
});

tbody.addEventListener("change", e => {
  const {i, campo} = e.target.dataset;
  if(campo === undefined) return;
  const t = trades[i];

  if(campo === "dia"){
    const iso = dmyAIso(e.target.value);
    if(iso){ t.dia = iso; e.target.value = isoADmy(iso); e.target.classList.remove("malo"); }
    else if(e.target.value.trim() === ""){ t.dia = ""; e.target.classList.remove("malo"); }
    else { e.target.classList.add("malo"); return; }
    ordenar(); pintarMeses(); render(); refresh();
    return;
  }

  // On blur the field is rewritten with the chosen locale's separator.
  if(PRECIOS.includes(campo)) e.target.value = aPantalla(t, t[campo]);
  if(campo === "x"){
    if(t.x !== "" && t.x > X_MAX) t.x = X_MAX;
    e.target.value = t.x === "" ? "" : plano(t.x);
  }

  // Changing PAIR keeps the number on screen and reinterprets it
  // in the new unit: 33 stays 33, now in the other currency.
  if(campo === "par"){
    const vistos = PRECIOS.map(c => aPantalla(t, t[c]));
    t.par = e.target.value;
    PRECIOS.forEach((c, k) => { t[c] = aModelo(t, vistos[k]); });
    render();
    refs[i]?.campo.par?.focus();
  }
  refresh();
});

function nombreMes(){ return mesFiltro === "todos" ? "" : fmtMes(mesFiltro, cfg.locale); }

/* A month with nothing in it opened onto an empty table with no obvious way in.
   It now starts with a blank row dated the 1st, exactly as if "agregar" had been
   pressed. It is not saved, shared or counted until something is typed into it:
   snapshot() keeps only rows that empezada() considers started. */
function asegurarFila(){
  if(mesFiltro === "todos") return;
  if(trades.some(t => mesDe(t.dia) === mesFiltro && empezada(t))) return;
  if(trades.some(t => mesDe(t.dia) === mesFiltro && !empezada(t))) return;
  trades.push({...nuevo(), dia: `${mesFiltro}-01`});
  ordenar();
}

function pintarMeses(){
  const sel = $("mes");
  const conTrades = new Set(trades.map(t => mesDe(t.dia)).filter(Boolean));
  const hoyYM = hoy().slice(0, 7);
  const anioAct = +hoyYM.slice(0, 4);
  // All 12 months of the last 3 years are offered so old trades can be filed,
  // plus any month outside that range that already has trades.
  const anios = new Set([anioAct, anioAct - 1, anioAct - 2]);
  for(const m of conTrades) anios.add(+m.slice(0, 4));

  sel.replaceChildren();
  sel.add(new Option(txt("mes.todos"), "todos"));
  for(const a of [...anios].sort((x, y) => y - x)){
    const g = document.createElement("optgroup");
    g.label = a;
    for(let m = 12; m >= 1; m--){
      const ym = `${a}-${String(m).padStart(2, "0")}`;
      if(ym > hoyYM && !conTrades.has(ym)) continue;      // no se ofrecen meses futuros vacíos
      const o = new Option(fmtMesCorto(ym, cfg.locale), ym);
      if(conTrades.has(ym)) o.text += " ·";               // marca los que ya tienen trades
      g.append(o);
    }
    if(g.children.length) sel.append(g);
  }
  sel.value = mesFiltro;
  if(sel.value !== mesFiltro){ mesFiltro = "todos"; sel.value = "todos"; }
}
$("mes").onchange = e => { mesFiltro = e.target.value; asegurarFila(); render(); refresh(); };

$("add").onclick = async () => {
  // A half-filled row does not count in the statistics: adding another on top only
  // multiplies the broken rows.
  const malas = trades.map((t, i) => [t, i, calcRow(t, cfg)])
    .filter(([t, , c]) => c.choca || c.mal.sl || c.mal.tp || (c.empezada && !c.completo));
  if(malas.length){
    const [, i, c] = malas[0];
    await aviso(txt("add.falta"),
      c.choca ? txt("add.choca")
      : (c.mal.sl || c.mal.tp) ? txt("add.dir")
      : txt("add.faltan") + c.faltan.join(", ").toUpperCase() + ".");
    const primero = refs[i]?.campo[c.faltan[0]] || refs[i]?.campo.cripto;
    primero?.focus();
    primero?.scrollIntoView({block:"center", behavior:"smooth"});
    return;
  }
  const t = nuevo();
  // With a month filtered, the new row is born inside it so it does not appear then vanish.
  if(mesFiltro !== "todos" && mesDe(t.dia) !== mesFiltro) t.dia = mesFiltro + "-01";
  trades.push(t); ordenar(); pintarMeses(); render(); refresh();
};
$("clear").onclick = async () => {
  if(!await confirmar(txt("t.vaciar"), txt("t.vaciarTxt"))) return;
  trades = [nuevo()]; pintarMeses(); render(); refresh();
};

/* ---------- config: inline at first, then in the bar ---------- */
function leerCfg(){
  cfg.margen    = $("margen").value;
  cfg.feesOn    = $("feesOn").checked;
  cfg.feeLimit  = num($("feeLimit").value);
  cfg.feeMarket = num($("feeMarket").value);
  cfg.locale    = $("locale").value;

  document.querySelector(".tasas")?.classList.toggle("off", !cfg.feesOn);
  $("feeLimit").disabled = $("feeMarket").disabled = !cfg.feesOn;
  pintarMuestra();

  // 5 instead of 0.05 silently ruins every Return. Read after assignment.
  const raras = [["LIMIT", cfg.feeLimit], ["MARKET", cfg.feeMarket]]
    .filter(([, v]) => Math.abs(v) > 1).map(([k]) => k);
  const av = $("avisoFee");
  av.hidden = !raras.length;
  av.textContent = raras.length
    ? txt("fee.raras", {k: raras.join(" / ")}) : "";

  refresh();
}
for(const id of ["margen","feesOn","feeLimit","feeMarket","locale"]){
  $(id).addEventListener("input", leerCfg);
  $(id).addEventListener("change", leerCfg);
}

function colocarCfg(){
  // a single block of controls, moved between the section and the dialog
  (cfg.listo ? $("ranuraDlg") : $("ranuraSec")).append($("cfgCuerpo"));
  $("secCfg").hidden = cfg.listo;
  $("btnCom").hidden = !cfg.listo;
  $("mCom").hidden = !cfg.listo;
}
$("cfgListo").onclick = () => {
  alternarInfo(false);   // do not park the panel on the help view
  cfg.listo = true; colocarCfg(); guardarLocal();
};
$("btnCom").onclick      = () => abrir($("dlgCfg"));
$("btnCampos").onclick   = () => abrir($("dlgCampos"));
/* The help runs about three screens: expanding it below the controls stretched the
   dialog and pushed OK out of sight. It replaces the fields instead, keeping the
   same height and the buttons still. */
/* The help unfolds under the fields rather than replacing them. It used to swap
   views, which meant OK had two meanings — go back, then close — and two presses
   to leave one dialog. With the footer pinned on mobile, length is no longer a
   reason to hide the fields, so OK can go back to meaning only "close". */
function alternarInfo(abrirlo){
  const info = $("cfgInfo");
  const ver = abrirlo === undefined ? info.hidden : abrirlo;
  info.hidden = !ver;
  for(const id of ["btnInfo", "btnInfo2"]){
    $(id).textContent = ver ? txt("i.ocultar") : txt("cfg.info");
    $(id).setAttribute("aria-expanded", String(ver));
  }
  /* No scrollIntoView here. The button that was just clicked is on screen by
     definition, and pulling the panel into view moved the page out from under
     the pointer. Expanding grows downwards; nothing above the button shifts. */
}
for(const id of ["btnInfo", "btnInfo2"]) $(id).onclick = () => alternarInfo();

$("cfgOk").onclick = () => $("dlgCfg").close();

// Collapse after the dialog is gone, so the reflow is never on screen.
$("dlgCfg").addEventListener("close", () => {
  requestAnimationFrame(() => alternarInfo(false));
});
for(const b of document.querySelectorAll("[data-cierra]")) b.onclick = e => e.target.closest("dialog").close();

/* Toggle the scroll hints. Passive listener: this only paints, never blocks. */
/* ---------- chart ----------
   Inline SVG, no library and no canvas. preserveAspectRatio="none" plus
   vector-effect on the strokes makes it responsive with no resize handler, at the
   cost of distorting anything with its own shape - so there are no dots and no
   text inside the SVG. Labels are HTML around it; the only elements inside are
   lines and invisible hit areas. */
const G_W = 640, G_H = 180, G_PAD = 14;
/* The selected stretch, as point indices. Kept outside dibujarGrafico so a
   keystroke that redraws the chart does not silently drop what was selected. */
let gSel = null, gArrastre = null, gPares = [];
// Past this many trades the per-trade line is a hairball, so it rolls up by month.
const G_MAX_PTS = 60;

const svgEl = (t, attrs) => {
  const el = document.createElementNS("http://www.w3.org/2000/svg", t);
  for(const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
};

function dibujarGrafico(pares){
  const fig = $("grafico"), svg = $("g-svg");
  gPares = pares;
  /* The roll-up is about how many points there are, not about which month is
     filtered. Keyed on the filter, a three-month journal on VER TODO drew three
     points and the curve was two straight segments. */
  const porMes = pares.length > G_MAX_PTS;
  const pts = serie(pares, porMes);
  // One point is not a line, and a chart of it would say less than the cards do.
  fig.hidden = pts.length < 2;
  if(fig.hidden) return;

  /* An axis each: a trade's result swings in tens of percent, F trader moves in
     ones, so on a shared axis the F line would lie flat and say nothing. Both are
     cut into the same number of steps, so the right-hand labels land on the
     left-hand gridlines instead of floating. */
  const ejeR = escala(pts.map(p => p.res));
  const ejeF = escala(pts.map(p => p.f));
  const px = i => G_PAD + (i / (pts.length - 1)) * (G_W - 2 * G_PAD);
  // No vertical padding: escala() already rounded the domain outwards.
  const py = (v, e) => G_H - ((v - e.lo) / (e.hi - e.lo)) * G_H;
  const linea = (sel, e) => pts.map((p, i) => `${px(i)},${py(sel(p), e)}`).join(" ");

  const idx = indicesX(pts.length);
  // A selection from a longer journal cannot survive the list getting shorter.
  if(gSel && gSel.b >= pts.length) gSel = null;

  svg.replaceChildren();
  if(gSel || gArrastre) pintarBanda(svg, px, gSel || gArrastre, !gSel);
  for(const v of ejeR.pasos)
    svg.append(svgEl("line", {class: v === 0 ? "g-cero" : "g-grid", x1:0, x2:G_W,
                              y1:py(v, ejeR), y2:py(v, ejeR), "vector-effect":"non-scaling-stroke"}));
  for(const i of idx)
    svg.append(svgEl("line", {class:"g-grid", x1:px(i), x2:px(i), y1:0, y2:G_H,
                              "vector-effect":"non-scaling-stroke"}));
  /* Per-trade over a long span, a month is otherwise invisible. A fainter line
     where the month turns keeps the diary readable without labelling every point. */
  if(!porMes)
    pts.forEach((p, i) => {
      if(i === 0 || mesDe(p.x) === mesDe(pts[i - 1].x)) return;
      const x = (px(i) + px(i - 1)) / 2;
      svg.append(svgEl("line", {class:"g-mes", x1:x, x2:x, y1:0, y2:G_H,
                                "vector-effect":"non-scaling-stroke"}));
    });
  svg.append(svgEl("polyline", {class:"g-linea g-lf", points:linea(p => p.f, ejeF),
                                "vector-effect":"non-scaling-stroke"}));
  svg.append(svgEl("polyline", {class:"g-linea g-la", points:linea(p => p.res, ejeR),
                                "vector-effect":"non-scaling-stroke"}));

  /* An invisible band per point. It carries a <title> for the native tooltip and,
     on hover or keyboard focus, writes that point into the readout above the
     chart - which is a modal's worth of detail without a modal: nothing to open,
     nothing to dismiss, and it works the same under a finger. */
  const ancho = (G_W - 2 * G_PAD) / Math.max(1, pts.length - 1);
  pts.forEach((p, i) => {
    const r = svgEl("rect", {class:"g-hit", x:px(i) - ancho / 2, y:0, rx:4,
                             width:ancho, height:G_H, tabindex:"0", role:"button"});
    const detalle = `${p.inicio ? txt("g.inicio") : etiquetaX(p.x, porMes)}`
                  + ` · ${txt(porMes ? "g.resMes" : "g.res")}`
                  + ` ${fmtPct(p.res)} · ${txt("g.f")} ${fmtPct(p.f)}`
                  + ` · ${txt("g.wl")} ${fmtPct(p.win)} / ${fmtPct(p.loss)}`
                  + ` · ${txt("g.trades", {n:p.n})}`;
    const tl = svgEl("title", {});
    tl.textContent = detalle;
    r.append(tl);
    r.setAttribute("aria-label", detalle);
    const ver = () => { if(!gSel && !gArrastre) leerPunto(p, porMes); };
    const volver = () => { if(!gSel && !gArrastre) leerPunto(pts[pts.length - 1], porMes); };
    r.addEventListener("mouseenter", ver);
    r.addEventListener("focus", ver);
    r.addEventListener("mouseleave", volver);
    r.addEventListener("blur", volver);
    /* Press and drag across to select a stretch; a press that does not move is a
       click, and a click clears. Pointer events cover mouse, pen and finger alike. */
    r.addEventListener("pointerdown", e => {
      e.preventDefault();
      // Three states, and a click moves between all of them: nothing -> open at
      // this point -> closed here. Dragging is the same thing done in one motion,
      // which is why it needs no separate handling.
      // A click on a closed period only clears it. Starting the next one on the
      // same click meant the chart never came back to plain, so there was no way
      // to see it whole again without hunting for the clear button.
      if(gSel)           { gSel = null; }
      else if(gArrastre) { gSel = {a:gArrastre.a, b:i}; gArrastre = null; }
      else               { gArrastre = {a:i, b:i}; }
      dibujarGrafico(gPares);
    });
    r.addEventListener("pointerenter", () => {
      if(!gArrastre) return;
      // The open end follows the pointer, so the period grows as it is chosen.
      gArrastre.b = i;
      pintarBanda(svg, px, gArrastre, true);
      pintarSel(pares, pts, porMes, gArrastre);
    });
    svg.append(r);
  });

  pintarEje($("g-izq"), ejeR, fmtPct);
  pintarEje($("g-der"), ejeF, fmtPct);
  pintarEjeX($("g-x"), idx, pts, porMes, px);
  // Two axes in different units: each one says which is which.
  $("g-rotIzq").textContent = txt(porMes ? "g.ejeResMes" : "g.ejeRes");
  $("g-rotDer").textContent = txt("g.f");
  $("g-rotX").textContent   = txt(porMes ? "g.ejeMes" : "g.ejeDia");
  $("g-pista").textContent  = txt(gArrastre ? "g.pistaAbierta"
                                  : gSel     ? "g.pistaCerrada" : "g.pista");
  const fg = $("grafico");
  fg.classList.toggle("con-sel", !!gSel);
  fg.classList.toggle("abriendo", !!gArrastre);
  // The label follows the roll-up: a month point is that month's average.
  $("g-resRot").textContent = txt(porMes ? "g.resMes" : "g.res");
  /* The cards and the message above are where the sheet stands now; this is how
     it got there. Without saying so the two read as one claim. */
  $("g-nota").textContent = txt(porMes ? "g.notaMes" : "g.nota");
  if(gSel || gArrastre) pintarSel(pares, pts, porMes, gSel || gArrastre);
  else leerPunto(pts[pts.length - 1], porMes);
  // A line chart is nothing to a screen reader, so the figure states its outcome.
  const ult = pts[pts.length - 1];
  $("g-alt").textContent = txt("g.alt", {n:ult.n, a:fmtPct(ult.res), f:fmtPct(ult.f)});
}

/* Redrawn on its own while the period is being chosen, so following the pointer
   does not rebuild the whole chart on every band it crosses. */
function pintarBanda(svg, px, sel, abierta){
  svg.querySelector(".g-banda")?.remove();
  const [a, b] = [Math.min(sel.a, sel.b), Math.max(sel.a, sel.b)];
  const banda = svgEl("rect", {class:"g-banda" + (abierta ? " abierta" : ""),
                               x:px(a), y:0, rx:4,
                               width:Math.max(px(b) - px(a), 2), height:G_H});
  svg.prepend(banda);
}

/* A selected stretch replaces the single-point readout. The figures come from
   resumen(), which goes back to the raw trades rather than averaging averages. */
function pintarSel(pares, pts, porMes, sel){
  const [a, b] = [Math.min(sel.a, sel.b), Math.max(sel.a, sel.b)];
  const r = resumen(pares, pts[a].inicio ? 0 : pts[a].i0, pts[b].i1);
  if(!r) return;
  escribirLectura(r);
  $("g-cuando").textContent =
    `${pts[a].inicio ? txt("g.inicio") : etiquetaX(pts[a].x, porMes)} – `
    + `${etiquetaX(pts[b].x, porMes)} · ${txt("g.trades", {n:r.n})}`;
}

/* Registered once, on the <svg> itself: it survives replaceChildren(), so doing
   this inside the redraw stacked a new copy of each listener on every keystroke.
   A pointer released outside the bands still has to end the drag, or the selection
   would go on following the cursor around the page. */
/* Registered once, on the <svg> itself: it survives replaceChildren(), so doing
   this inside the redraw stacked a new copy of each listener on every keystroke.
   A drag is closed on release; a plain click leaves the period open for a second
   click, which is what works with a finger. */
$("g-svg").addEventListener("pointerup", () => {
  if(!gArrastre || gArrastre.a === gArrastre.b) return;
  gSel = {a:gArrastre.a, b:gArrastre.b};
  gArrastre = null;
  dibujarGrafico(gPares);
});
const limpiarSel = () => {
  if(!gSel && !gArrastre) return;
  gSel = gArrastre = null;
  dibujarGrafico(gPares);
};
$("g-svg").addEventListener("pointercancel", limpiarSel);
$("g-limpiar").onclick = limpiarSel;
// Escape is what people try first to get out of a selection.
$("grafico").addEventListener("keydown", e => { if(e.key === "Escape") limpiarSel(); });

// The readout doubles as the legend: the last point until one is pointed at.
function leerPunto(p, porMes){
  escribirLectura(p);
  $("g-cuando").textContent = (p.inicio ? txt("g.inicio") : etiquetaX(p.x, porMes))
                            + " · " + txt("g.trades", {n:p.n});
}

function escribirLectura(p){
  const v = $("g-resVal");
  v.textContent = fmtPct(p.res);
  v.className = p.res > 0 ? "pos" : p.res < 0 ? "neg" : "";
  $("g-fVal").textContent = fmtPct(p.f);
  $("g-wlVal").textContent = fmtPct(p.win) + " / " + fmtPct(p.loss);
}

/* Labels are HTML, not SVG text: preserveAspectRatio="none" would stretch glyphs
   with the box. They are placed at plain percentages, which line up because the
   drawing has no vertical padding of its own. */
/* Same idea sideways. The ends are pinned inside the box instead of centred on
   their gridline, so neither date hangs off the edge of the figure. */
function pintarEjeX(caja, idx, pts, porMes, px){
  caja.replaceChildren();
  let previo = null;
  for(const i of idx){
    const etq = pts[i].inicio ? txt("g.inicio") : etiquetaX(pts[i].x, porMes);
    // Several trades on one day would otherwise print the same date twice.
    if(etq === previo && i !== pts.length - 1) continue;
    previo = etq;
    const sp = document.createElement("span");
    sp.textContent = etq;
    sp.style.left = (px(i) / G_W * 100) + "%";
    if(i === 0) sp.style.transform = "translateX(0)";
    else if(i === pts.length - 1) sp.style.transform = "translateX(-100%)";
    caja.append(sp);
  }
}

function pintarEje(caja, eje, formato){
  caja.replaceChildren();
  for(const v of eje.pasos){
    const sp = document.createElement("span");
    sp.textContent = formato(v);
    sp.style.top = (100 - ((v - eje.lo) / (eje.hi - eje.lo)) * 100) + "%";
    caja.append(sp);
  }
}

const etiquetaX = (x, porMes) => porMes ? fmtMesCorto(x, cfg.locale) : isoADm(x);

function marcarScroll(){
  const c = document.querySelector(".scroll"), caja = c?.closest(".scroll-caja");
  if(!caja) return;
  const resto = c.scrollWidth - c.clientWidth - c.scrollLeft;
  caja.classList.toggle("hay-izq", c.scrollLeft > 2);
  caja.classList.toggle("hay-der", resto > 2);
}
document.querySelector(".scroll")?.addEventListener("scroll", marcarScroll, {passive:true});
addEventListener("resize", marcarScroll, {passive:true});

/* ---------- options sheet ----------
   Each row delegates to the button that already exists in the bar: the logic lives
   in one place and there are not two paths to keep in sync. */
$("btnMenu").onclick = () => abrir($("dlgMenu"));
/* Nothing opens a dialog from inside the sheet: the help unfolds in place, and
   the one block of copy is moved between the sheet and the desktop dialog so
   there is never a second copy to keep in step. */
$("mAyuda").onclick = () => {
  const slot = $("ranuraAyudaHoja"), abrirlo = slot.hidden;
  if(abrirlo) slot.append($("ayudaCuerpo"));
  slot.hidden = !abrirlo;
  $("mAyuda").setAttribute("aria-expanded", String(abrirlo));
  if(abrirlo) slot.scrollIntoView({block:"nearest", behavior:"smooth"});
};
$("btnAyuda").onclick = () => {
  $("ranuraAyudaDlg").append($("ayudaCuerpo"));
  abrir($("dlgAyuda"));
};

for(const [fila, real] of [["mSave","save"], ["mLoad","load"], ["mLink","link"],
                           ["mImp","btnImp"], ["mCom","btnCom"], ["mTema","btnTema"]]){
  $(fila).onclick = () => {
    // The theme changes in place, so the sheet stays open to show it.
    if(fila === "mTema"){ $(real).click(); return; }
    // Everything else closes the sheet first and runs on its own. Reopening the
    // sheet afterwards used to stack the password and confirm dialogs on top of
    // it, which is the nesting this is meant to avoid.
    $("dlgMenu").close();
    $(real).click();
    // Fees is the exception: it opens nothing further, so closing it returns to
    // the sheet the user came from instead of dropping them on the page.
    if(fila === "mCom") $("dlgCfg").addEventListener("close",
      () => abrir($("dlgMenu")), {once:true});
  };
}

/* ---------- import dialog ----------
   One interpretation of dates and of decimals per import, chosen once and shown
   applied to real cells: a wrong reading is visible before it is committed
   rather than discovered a month later in the wrong month. */
let impFilas = [], impMapa = [];

const impDiaPrimero = () => document.querySelector("input[name=impDia]:checked").value === "dma";
const impDecimal    = () => document.querySelector("input[name=impDec]:checked").value;

function abrirImp(){
  $("impPegar").value = "";
  impFilas = []; impMapa = [];
  // Defaults follow the sheet's own number format, which is the best available
  // guess at what the file it came from holds.
  document.querySelector(`input[name=impDec][value="${decimalDe(cfg.locale) === "," ? "," : "."}"]`).checked = true;
  document.querySelector(`input[name=impDia][value="${diaPrimeroDe(cfg.locale) ? "dma" : "mda"}"]`).checked = true;
  $("impCuerpo").hidden = true;
  $("impOk").disabled = true;
  $("impOk").textContent = txt("imp.add");
  abrir($("dlgImp"));
  $("impPegar").focus();
}

$("impPegar").addEventListener("input", () => {
  const filas = filasPegadas($("impPegar").value);
  if(esCabecera(filas[0])){
    impMapa = filas[0].map(campoDe);
    impFilas = filas.slice(1);
  } else {
    // No header: assume this sheet's own column order, so a selection copied
    // out of the table below maps back onto itself.
    const ancho = Math.max(0, ...filas.map(f => f.length));
    impMapa = ORDEN.slice(0, ancho);
    impFilas = filas;
  }
  pintarImp();
});

for(const r of document.querySelectorAll("input[name=impDia],input[name=impDec]"))
  r.addEventListener("change", pintarImp);

function pintarImp(){
  const tabla = $("impTabla");
  $("impCuerpo").hidden = !impFilas.length;
  if(!impFilas.length){ $("impOk").disabled = true; return; }

  const ancho = Math.max(impMapa.length, ...impFilas.map(f => f.length));
  const dec = impDecimal(), diaP = impDiaPrimero();

  // Header row of <select>s: every guess is visible and every one is overridable.
  const thead = document.createElement("thead");
  const trh = document.createElement("tr");
  for(let k = 0; k < ancho; k++){
    const th = document.createElement("th");
    const sel = document.createElement("select");
    sel.add(new Option("—", ""));
    for(const campo of ORDEN) sel.add(new Option(etiqueta(campo), campo));
    sel.value = impMapa[k] || "";
    sel.setAttribute("aria-label", txt("imp.col", {n: k + 1}));
    sel.onchange = () => {
      // A field can only come from one column, so picking it elsewhere frees it.
      if(sel.value) impMapa = impMapa.map(c => c === sel.value ? "" : c);
      impMapa[k] = sel.value;
      pintarImp();
    };
    th.append(sel); trh.append(th);
  }
  thead.append(trh);

  // Three rows is enough to see whether the reading is right.
  const tb = document.createElement("tbody");
  for(const fila of impFilas.slice(0, 3)){
    const tr = document.createElement("tr");
    for(let k = 0; k < ancho; k++){
      const td = document.createElement("td");
      const cruda = document.createElement("span");
      cruda.className = "imp-cruda";
      cruda.textContent = fila[k] ?? "";
      td.append(cruda);
      const leido = impLeido(impMapa[k], fila[k], dec, diaP);
      if(leido !== null){
        const p = document.createElement("span");
        p.className = "imp-leido";
        p.textContent = "→ " + leido;
        td.append(p);
      }
      tr.append(td);
    }
    tb.append(tr);
  }
  tabla.replaceChildren(thead, tb);

  // Each choice is only offered when the data actually depends on it.
  $("impFsFecha").hidden = !impMapa.includes("dia");
  $("impFsNum").hidden   = !impMapa.some(c => c === "x" || PRECIOS.includes(c));

  const {nuevos, salteadas} = importar(impFilas, impMapa, dec, diaP);
  $("impConteo").textContent = txt("imp.conteo", {n: impFilas.length})
    + (salteadas.length ? " " + txt("imp.salteadas", {n: salteadas.length}) : "");
  $("impOk").disabled = !nuevos.length;
  $("impOk").textContent = (txt("imp.add") + " " + nuevos.length).trim();
}

// What a cell turns into, for the preview line under it. null = nothing to show.
function impLeido(campo, celda, dec, diaP){
  if(!campo || celda === undefined || celda === "") return null;
  if(campo === "dia"){ const d = fechaPegada(celda, diaP); return d ? isoADmy(d) : txt("imp.mala"); }
  if(campo === "x" || PRECIOS.includes(campo)){
    const v = numPegado(celda, dec);
    return isFinite(v) ? plano(v) : txt("imp.mala");
  }
  return null;
}

$("impCancel").onclick = () => $("dlgImp").close();
$("impOk").onclick = () => {
  const {nuevos, salteadas} = importar(impFilas, impMapa, impDecimal(), impDiaPrimero());
  if(!nuevos.length) return;
  // Append only. There is no "replace everything" here on purpose: nothing this
  // dialog does can lose a trade, so it needs no undo.
  trades.push(...nuevos);
  // An imported month that is not the one being filtered would land out of sight.
  mesFiltro = "todos";
  ordenar(); pintarMeses(); render(); refresh(); guardarLocal();
  $("dlgImp").close();
  if(salteadas.length)
    aviso(txt("imp.hecho", {n: nuevos.length}), txt("imp.salteadasTxt", {n: salteadas.length}));
};
$("btnImp").onclick = abrirImp;

/* ---------- theme: system by default, manual override ---------- */
function aplicarTema(){
  // `modo`, not `t`: a local `t` would shadow the translation helper.
  const modo = localStorage.getItem(KEY_TEMA) || "auto";
  const oscuroSistema = matchMedia("(prefers-color-scheme:dark)").matches;
  const oscuro = modo === "dark" || (modo === "auto" && oscuroSistema);
  if(modo === "auto") document.documentElement.removeAttribute("data-theme");
  else document.documentElement.setAttribute("data-theme", modo);
  const nombre = txt({auto:"tema.auto", light:"tema.claro", dark:"tema.oscuro"}[modo]);
  const b = $("btnTema");
  // Auto gets its own icon: dimming the sun or the moon said "disabled", not
  // "following the system". The half-filled circle is the state, not a shade of it.
  const icono = modo === "auto" ? "#ph-dt-circle-half-tilt"
                                : oscuro ? "#ph-dt-sun" : "#ph-dt-moon";
  b.querySelector("use").setAttribute("href", icono);
  $("mTema").querySelector("use").setAttribute("href", icono);
  $("mTemaEstado").textContent = " · " + nombre;
  b.title = txt("acc.tema") + ": " + nombre;
}
$("btnTema").onclick = () => {
  /* Three states, ordered so the first tap always changes what is on screen:
     auto -> the opposite of the system -> the same as the system -> auto.
     A plain auto/light/dark cycle needed two taps to do anything visible. */
  const modo = localStorage.getItem(KEY_TEMA) || "auto";
  const sistemaOscuro = matchMedia("(prefers-color-scheme:dark)").matches;
  const opuesto = sistemaOscuro ? "light" : "dark";
  const igual   = sistemaOscuro ? "dark" : "light";
  const siguiente = modo === "auto" ? opuesto : modo === opuesto ? igual : "auto";
  if(siguiente === "auto") localStorage.removeItem(KEY_TEMA);
  else localStorage.setItem(KEY_TEMA, siguiente);
  aplicarTema();
};
matchMedia("(prefers-color-scheme:dark)").addEventListener("change", aplicarTema);

/* Own dialogs: native prompt/alert/confirm cannot be styled. */
function abrir(dlg){
  dlg.showModal();
  // showModal() focuses the first focusable child and scrolls it into view, which
  // opened the long glossary part-way down. Focus the dialog itself instead.
  dlg.focus?.();
  // The browser focuses the first focusable element and scrolls to it:
  // with the long glossary dialog that opened it at the bottom.
  dlg.scrollTop = 0;
  requestAnimationFrame(() => { dlg.scrollTop = 0; });
}

for(const d of document.querySelectorAll("dialog")){
  d.querySelector("[data-x]")?.addEventListener("click", () => d.close());
  // A click on the backdrop targets the dialog element itself, not its content.
  d.addEventListener("click", e => { if(e.target === d) d.close(); });
}

function aviso(titulo, texto){
  $("avisoTitulo").textContent = titulo;
  $("avisoTexto").textContent = texto;
  abrir($("dlgAviso"));
  return new Promise(r => { $("dlgAviso").onclose = () => r(); });
}

function confirmar(titulo, texto){
  $("confTitulo").textContent = titulo;
  $("confTexto").textContent = texto;
  abrir($("dlgConf"));
  return new Promise(r => { $("dlgConf").onclose = () => r($("dlgConf").returnValue === "si"); });
}
$("confSi").onclick = () => $("dlgConf").close("si");
$("confNo").onclick = () => $("dlgConf").close("no");
$("avisoOk").onclick = () => $("dlgAviso").close();

/* Returns {pass, limpiar}, or null if cancelled. */
function pedirPass({titulo, ayuda, confirmar: conf = false, ofrecerLimpiar = false}){
  const d = $("dlgPass"), e = $("passErr");
  $("passTitulo").textContent = titulo;
  $("passAyuda").textContent = ayuda;
  $("pass2Caja").hidden = !conf;
  $("limpiarCaja").hidden = !ofrecerLimpiar;
  $("pass1").value = ""; $("pass2").value = ""; $("limpiar").checked = false;
  e.hidden = true;
  abrir(d);
  $("pass1").focus();

  return new Promise(resolve => {
    const fallo = m => { e.hidden = false; e.querySelector("span").textContent = m; };
    const ok = () => {
      const p = $("pass1").value;
      if(conf){
        if(p.length < 8) return fallo(txt("p.corta"));
        if(p !== $("pass2").value) return fallo(txt("p.noCoincide"));
      } else if(!p) return fallo(txt("p.falta"));
      d.close();
      resolve({pass: p, limpiar: $("limpiar").checked});
    };
    $("passOk").onclick = ok;
    $("pass1").onkeydown = $("pass2").onkeydown = ev => { if(ev.key === "Enter"){ ev.preventDefault(); ok(); } };
    $("passCancel").onclick = () => d.close();
    d.onclose = () => resolve(null);   // cubre también Escape
  });
}
// Blank rows are scaffolding, not data: they never reach the file, the link or
// localStorage.
const snapshot = () => ({v:1, cfg, trades: trades.filter(empezada)});


function aplicar(d){
  if(!d || !Array.isArray(d.trades)) throw new Error("formato inválido");
  trades = d.trades.map(migra);
  Object.assign(cfg, d.cfg || {});
  ordenar(); sincronizarCfg(); colocarCfg(); pintarMeses(); render(); refresh();
}

// PBKDF2 at 600,000 iterations takes ~0.5-2 s. Without this the page looks frozen.
async function ocupado(btn, fn){
  btn.disabled = true;
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  try{ return await fn(); }
  finally{ btn.disabled = false; }
}

$("save").onclick = async () => {
  const r = await pedirPass({
    titulo: txt("p.guardar"),
    ayuda: txt("p.guardarTxt"),
    confirmar: true, ofrecerLimpiar: true});
  if(!r) return;
  await ocupado($("save"), async () => {
    const blob = new Blob([JSON.stringify({formato:"registro-trades-cifrado", datos: await cifrar(snapshot(), r.pass)}, null, 2)],
                          {type:"application/json"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "registro-trades-" + hoy() + ".json";
    a.click();
    URL.revokeObjectURL(a.href);
  });
  // The download can still be cancelled in the browser: confirm before deleting.
  if(r.limpiar && await confirmar(txt("e.vaciarNav"), txt("e.vaciarNavTxt"))){
    try{ localStorage.removeItem(KEY); }catch{}
    trades = [nuevo()];
    pintarMeses(); render(); refresh();
  }
};

$("load").onclick = () => $("file").click();
$("file").onchange = async e => {
  const f = e.target.files[0]; if(!f) return;
  e.target.value = "";
  let datos;
  try{ datos = JSON.parse(await f.text()).datos; }
  catch{ await aviso(txt("e.formato"), txt("e.formatoTxt")); return; }
  const r = await pedirPass({titulo:txt("p.cargar"), ayuda:txt("p.cargarTxt")});
  if(!r) return;
  await ocupado($("load"), async () => {
    try{ aplicar(await descifrar(datos, r.pass)); }
    catch{ aviso(txt("e.noAbre"), txt("e.noAbreTxt")); }
  });
};

$("link").onclick = async () => {
  const r = await pedirPass({titulo:txt("p.enlace"),
    ayuda:txt("p.enlaceTxt"),
    confirmar: true});
  if(!r) return;
  await ocupado($("link"), async () => {
    const url = location.origin + location.pathname + "#d=" + await cifrar(snapshot(), r.pass);
    // Many chat and mail clients cut long URLs, and a truncated link
    // will not decrypt: warn before copying it.
    if(url.length > 8000){
      await aviso(txt("e.enlaceLargo"), txt("e.enlaceLargoTxt", {n: new Intl.NumberFormat(cfg.locale).format(url.length)}));
      return;
    }
    try{ await navigator.clipboard.writeText(url); aviso(txt("e.copiado"), txt("e.copiadoTxt")); }
    catch{ await aviso(txt("e.copiarMano"), url); }
  });
};

/* ---------- local persistence (unencrypted, this browser only) ---------- */
function guardarLocal(){
  try{ localStorage.setItem(KEY, JSON.stringify(snapshot())); }catch{}
}
function leerLocal(){
  try{ const s = localStorage.getItem(KEY); return s ? JSON.parse(s) : null; }catch{ return null; }
}
// Three concrete examples of the same number, so the difference is visible.
function pintarEjemplos(){
  // At 1234.56 Spanish does not group thousands and the example would show nothing.
  const n = 1234567.89;
  const muestras = [["es-ES", "EUR"], ["es-AR", "ARS"], ["en-US", "USD"]];
  $("ejemplosNum").textContent = muestras
    .map(([loc, nombre]) => `${nombre}   ${new Intl.NumberFormat(loc).format(n)}`)
    .join("\n");
}

// Sample of the chosen locale, beside the picker.
function pintarMuestra(){
  const el = $("muestraNum");
  if(el) el.textContent = new Intl.NumberFormat(cfg.locale || undefined).format(1234567.89);
}

function sincronizarCfg(){
  $("margen").value    = cfg.margen;
  $("feesOn").checked  = cfg.feesOn;
  document.querySelector(".tasas")?.classList.toggle("off", !cfg.feesOn);
  $("feeLimit").value  = plano(cfg.feeLimit);
  $("feeMarket").value = plano(cfg.feeMarket);
  $("locale").value    = cfg.locale;
  $("feeLimit").disabled = $("feeMarket").disabled = !cfg.feesOn;
  pintarMuestra();
}

/* The address is not written in the HTML: it is assembled here, so a scraper that
   does not run JavaScript will not find it. Obfuscation raises the cost of harvesting,
   it does not prevent it: use a disposable, rotatable alias. */
const CORREO = ["dev", "criptonautas.co"];   // user, domain
function armarCorreo(){
  const a = $("mailContacto");
  if(!a) return;
  const dir = CORREO.join("@");
  a.href = "mailto:" + dir;
  a.title = dir;
}

/* ---------- startup ---------- */
async function init(){
  guardarEs();
  // Straight from the browser: Spanish for any es-* locale, English otherwise.
  idioma = (navigator.language || "es").toLowerCase().startsWith("es") ? "es" : "en";
  aplicarIdioma();
  aplicarTema();
  armarCorreo();

  // Two-step fallback: if the browser reports no language es-AR is used, and
  // locales its Intl does not support are dropped so no dead options are shown.
  const sel = $("locale");
  let lista = LOCALES;
  try{
    const ok = Intl.NumberFormat.supportedLocalesOf(LOCALES);
    if(ok.length) lista = ok;
  }catch{}
  const nav = (typeof navigator !== "undefined" && navigator.language) || "";
  if(nav && !lista.includes(nav)) lista = [nav, ...lista];
  if(!lista.length) lista = ["es-AR"];
  lista.forEach(l => sel.add(new Option(l, l)));
  cfg.locale = lista.includes(nav) ? nav : lista[0];
  pintarEjemplos(); pintarMuestra();

  if(!crypto?.subtle){
    for(const id of ["save","load","link"]){
      $(id).disabled = true;
      $(id).title = txt("e.sinCripto");
    }
  }

  const hash = location.hash.match(/^#d=(.+)$/);
  if(hash){
    const r = await pedirPass({titulo:txt("p.abrir"), ayuda:txt("p.abrirTxt")});
    if(r){
      try{
        aplicar(await descifrar(hash[1], r.pass));
        history.replaceState(null, "", location.pathname);
        return;
      }catch{ await aviso(txt("e.noAbre"), txt("e.noAbreTxt")); }
    }
  }

  const guardado = leerLocal();
  // Array.isArray, not .length: since snapshot() drops blank rows, "vaciar" now
  // stores an empty array, and treating that as a first visit brought the
  // examples back from the dead.
  if(guardado && Array.isArray(guardado.trades)){
    trades = guardado.trades.map(migra);
    Object.assign(cfg, guardado.cfg || {});
    // An early save could carry locale:"" and leave the picker blank.
    if(![...sel.options].some(o => o.value === cfg.locale)) cfg.locale = lista[0];
    if(!trades.length) trades = [nuevo()];
  } else {
    trades = EJEMPLOS.map(t => ({...t}));   // examples from the original sheet
  }
  /* ?demo fills the sheet with three months of plausible trades. It replaces
     whatever was loaded and is then saved like any other edit, so anything real
     already in this browser is confirmed first. */
  const pedido = demoPedido(location.search);
  if(pedido){
    if(!trades.some(empezada) || await confirmar(txt("demo.h"), txt("demo.txt"))){
      trades = demoTrades(hoy(), Math.random, pedido.meses, pedido.sesgo);
      cfg.listo = true;              // show the whole page, not the setup step
    }
    // The flag is spent: a reload should not silently regenerate the data.
    history.replaceState(null, "", location.pathname);
  }

  ordenar(); sincronizarCfg(); colocarCfg(); pintarMeses(); render(); refresh();
}

init();
