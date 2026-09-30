# F Trader — How much to trade

**ENGLISH** | [ESPAÑOL](README.es.md)

A trade log that works out how much capital to risk on each trade, from the results you have already recorded. It runs entirely in the browser: no server does the maths, no account is created and nothing is sent anywhere.

![F Trader](og.png)

### What it is

*F trader* is the figure the project is named after: the share of capital the
formula suggests risking per trade, derived from your own history — win rate, the
ratio between average win and average loss, and the RRR.

It started as a LibreOffice/Excel sheet (`REGISTRO-TRADES.xlsm`) whose macros no
longer ran — they had been written half in VBA and half in LibreOffice Basic, and
two of the headline statistics were `#REF!`. This is that sheet rebuilt as a page,
with the broken parts fixed rather than reproduced.

Spanish and English, chosen from the browser's language.

### Using it

Open `index.html`. That is the whole installation — double-clicking the file works,
no server and no build step.

1. **Exchange data** — fees, contract type and number format.
2. **Positions** — log paper or real trades. Computed columns fill themselves in.
3. **Results and formulas** — win/loss share, average result, and *F trader*.

Trades are saved automatically in `localStorage`, which means **this browser, this
device**. To keep them elsewhere, use the encrypted file or link.

#### Importing a sheet you already have

The clipboard button opens *import*: copy the cells in your spreadsheet and paste
them in. No file is ever read — the clipboard hands over tab-separated rows
whatever the source, so it works the same from LibreOffice, Excel, Google Sheets,
`.xlsx`, `.xlsm` and `.ods`. Legacy `.xls` is deliberately left out: export to any
of the others.

The dialog lets you say which column is which field, and choose **once for the
whole import** whether `60.000` is sixty thousand or sixty, and whether `01/09`
is 1 September or 9 January. Each cell shows what it was read as, so a wrong
reading is visible before you commit it. Rows are appended to the ones already
there: nothing is replaced and nothing is lost. A row with no readable date is
skipped rather than dated today, which would hide it in the wrong month.

### Leverage: capped at 20x

`X` will not take more than **20x**. The ceiling is applied as you type, when a
spreadsheet is pasted in, and to data saved before it existed.

It is not any exchange's limit — plenty offer 50x, 100x or more. It is our own
convention, and it matches how we read trading: past 20x a stop-out and a
liquidation become the same event, the margin stops absorbing ordinary price
noise, and the formula ends up sizing a position on an account that will not
reach the next trade. *F trader* exists to keep sizing survivable; allowing 100x
would turn it into a calculator for how fast an account burns.

Anyone who wants a different ceiling has the code: it is the `X_MAX` constant in
`app.js`.

### Privacy

- No backend, no accounts, no analytics, no third-party requests. The page loads
  nothing from a CDN; the icons are inlined as an SVG sprite.
- Data lives in your browser's `localStorage` and never leaves it on its own.
- Export is encrypted with **AES-GCM 256** and **PBKDF2-SHA256** (600,000
  iterations), via the browser's own WebCrypto. Lose the password and the file is
  gone — there is no recovery, and that is the point.
- The encrypted link keeps its payload in the URL *fragment*, which browsers never
  send to the server.

### What it computes

`R` is the return on margin, so the denominator depends on the contract:

| Contract | Margin posted in | R |
|---|---|---|
| Linear (USDⓈ-M) | USDT | `(EXIT − ENTRY) / ENTRY × X` |
| Inverse (coin-margined) | the crypto | `(EXIT − ENTRY) / EXIT × X` |

Fees are charged **on notional**, once per side: `rate × X`. A negative rate is a
rebate and adds to the return. The original sheet applied them proportionally to
`R`, which made commissions *shrink* a losing trade — that is fixed here.

With `PAIR = BTC` prices are entered and shown in satoshis, and stored as BTC.

### Development

```bash
node test.mjs      # or: npm test
```

196 checks covering the calculation, the decimal parser, dates, statistics,
importing, the chart series, encryption and markup integrity. There is no copy of the source in the tests:
everything above the DOM boundary marker in `app.js` is imported as it ships, so
the tests cannot drift. Needs Node 20+.

Anything touching the DOM is **not** covered and needs a browser. To look at it
by eye, open `index.html?demo`: it generates three months of sample trades,
enough for the statistics, the warnings and the chart to have something to say.
It overwrites whatever is in the browser, so it asks first.

### Files

| | |
|---|---|
| `index.html` | markup, the icon sprite and the Spanish copy |
| `app.js` | logic — DOM-free code first, then everything that touches the document |
| `app.css` | styles, light and dark |
| `fonts/` | Inter Tight 400/600/800, from the criptonautas.co Headline theme, with its OFL licence |
| `test.mjs` | the test suite |
| `og.png` | link preview image |
| `preview.html` | public page served to crawlers when the app sits behind auth |

### Deploying

Copy the files to a directory and point a web server at it. They are static
files: no PHP, no process, no port.

Serve them with a strict Content-Security-Policy — the page needs nothing from
outside:

```
default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline';
font-src 'self'; img-src 'self' data:; form-action 'none'; base-uri 'none';
frame-ancestors 'none'
```

`preview.html` is there for the case where the sheet sits behind a login: a
redirect has no body, so the crawler that builds the link preview finds no tags.
Serve that page with a 200 instead of redirecting, and keep `og.png` and
`fonts/` outside the login.

If you fork this, note that `og:url`, `og:image` and the contact links point at
`criptonautas.co` — change them in `index.html` and `preview.html`, and set
`CORREO` in `app.js` to your own address.

### Licence

[AGPL-3.0-or-later](LICENSE). Chosen deliberately: this is a web tool, and the
GPL's obligation is triggered by *distribution*, which never happens when someone
merely hosts a modified copy. The AGPL closes that gap, so a fork offered as a
service has to publish its changes. For a tool whose whole claim is that your data
stays in your browser, that verifiability is the point.

The fonts in `fonts/` (Inter Tight) are not AGPL: they carry their own SIL OFL 1.1
licence, included in [`fonts/OFL.txt`](fonts/OFL.txt).

Text of this README under [CC BY-NC-SA 4.0](CC-BY-NC-SA-4.0.txt).
