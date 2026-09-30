# F Trader — Con cuánto tradear

[ENGLISH](README.md) | **ESPAÑOL**

Una planilla de trades que calcula cuánto capital conviene arriesgar en cada
operación, a partir de los resultados que ya registraste. Funciona entera en el
navegador: ningún servidor hace las cuentas, no se crea ninguna cuenta y no se
envía nada a ningún lado.

![F Trader](og.png)

![F Trader](og.png)

### Qué es

*F trader* es la cifra que da nombre al proyecto: la fracción del capital que la
fórmula sugiere arriesgar por trade, deducida de tu propio historial — porcentaje
de aciertos, relación entre la ganancia media y la pérdida media, y el RRR.

Empezó como una planilla de LibreOffice/Excel (`REGISTRO-TRADES.xlsm`) cuyas macros
habían dejado de funcionar: estaban escritas mitad en VBA y mitad en LibreOffice
Basic, y dos de las estadísticas principales eran `#REF!`. Esto es esa planilla
reconstruida como página, con lo roto arreglado en vez de reproducido.

En español e inglés, según el idioma del navegador.

### Cómo se usa

Abrí `index.html`. Esa es toda la instalación: funciona con doble clic, sin
servidor y sin paso de compilación.

1. **Datos del exchange** — comisiones, tipo de contrato y formato de numeración.
2. **Posiciones** — cargá trades en papel o reales. Las columnas calculadas se
   completan solas.
3. **Resultados y fórmulas** — aciertos y pérdidas, promedio, y *F trader*.

Los trades se guardan solos en `localStorage`, es decir **este navegador, este
dispositivo**. Para llevarlos a otro lado están el archivo cifrado y el enlace.

#### Importar una planilla que ya tenés

El botón del portapapeles abre *importar*: copiá las celdas en tu planilla y
pegalas ahí. No se lee ningún archivo — el portapapeles entrega filas separadas
por tabulaciones venga de donde venga, así que funciona igual desde LibreOffice,
Excel, Google Sheets, `.xlsx`, `.xlsm` y `.ods`. El `.xls` viejo queda afuera a
propósito: exportá a cualquiera de los otros.

El diálogo te deja decir qué columna es cada campo, y elegir **una sola vez para
toda la importación** si `60.000` son sesenta mil o sesenta, y si `01/09` es 1 de
septiembre o 9 de enero. Debajo de cada celda se muestra cómo quedó leída, así
una lectura equivocada se ve antes de confirmar. Las filas se agregan a las que
ya están: nada se reemplaza y nada se pierde. Una fila sin fecha legible se
saltea en vez de quedar fechada hoy, que la escondería en el mes equivocado.

### Apalancamiento: tope de 20x

`X` no acepta más de **20x**, y el tope se aplica al escribir, al pegar una
planilla y al cargar datos guardados antes de que existiera.

No es el límite de ningún exchange — varios ofrecen 50x, 100x o más. Es una
convención nuestra, alineada con cómo entendemos el trading: por encima de 20x
el stop y la liquidación pasan a ser el mismo evento, el margen deja de absorber
el ruido normal del precio, y la fórmula termina sugiriendo un tamaño de
posición sobre una cuenta que no llega a la próxima operación. *F trader* existe
para que el tamaño sea sostenible; permitir 100x lo volvería una calculadora de
cuánto tarda una cuenta en quemarse.

Quien quiera otro tope tiene el código: es la constante `X_MAX` en `app.js`.

### Privacidad

- Sin backend, sin cuentas, sin analítica, sin pedidos a terceros. La página no
  carga nada de un CDN: los iconos van embebidos como sprite SVG.
- Los datos viven en el `localStorage` del navegador y no salen de ahí por su cuenta.
- La exportación se cifra con **AES-GCM 256** y **PBKDF2-SHA256** (600.000
  iteraciones), usando el WebCrypto del propio navegador. Si se pierde la
  contraseña el archivo se pierde: no hay recuperación, y ese es el punto.
- El enlace cifrado guarda su contenido en el *fragmento* de la URL, que el
  navegador nunca manda al servidor.

### Qué calcula

`R` es el retorno sobre el margen, así que el denominador depende del contrato:

| Contrato | Margen depositado en | R |
|---|---|---|
| Lineal (USDⓈ-M) | USDT | `(SALIDA − ENTRADA) / ENTRADA × X` |
| Inverso (coin-margined) | la cripto | `(SALIDA − ENTRADA) / SALIDA × X` |

Las comisiones se cobran **sobre el nocional**, una vez por lado: `tasa × X`. Una
tasa negativa es un *rebate* y suma al retorno. La planilla original las aplicaba
proporcionales a `R`, lo que hacía que las comisiones *achicaran* una pérdida; acá
está corregido.

Con `PAR = BTC` los precios se cargan y se muestran en satoshis, y se guardan en BTC.

### Desarrollo

```bash
node test.mjs      # o: npm test
```

196 comprobaciones sobre el cálculo, el parser decimal, las fechas, las
estadísticas, la importación, la serie del gráfico, el cifrado y la integridad
del marcado. Las pruebas no tienen copia
del código: importan tal cual todo lo que está arriba del marcador de frontera del
DOM en `app.js`, así que no pueden quedar desfasadas. Necesita Node 20 o más nuevo.

Lo que toca el DOM **no** está cubierto y necesita un navegador. Para mirarlo a
ojo, abrí `index.html?demo`: genera tres meses de trades de ejemplo, suficientes
para que las estadísticas, los avisos y el gráfico tengan algo que decir. Pisa lo
que haya en el navegador, así que primero pide confirmación.

### Archivos

| | |
|---|---|
| `index.html` | marcado, el sprite de iconos y los textos en español |
| `app.js` | lógica — primero lo que no toca el DOM, después lo que sí |
| `app.css` | estilos, claro y oscuro |
| `fonts/` | Inter Tight 400/600/800, del tema Headline de criptonautas.co, con su licencia OFL |
| `test.mjs` | las pruebas |
| `og.png` | imagen de previsualización |
| `preview.html` | página pública para los rastreadores cuando la app está detrás de auth |

### Despliegue

Copiá los archivos a un directorio y apuntá un servidor web ahí. Son archivos
estáticos: no hace falta PHP, ni un proceso, ni un puerto.

Conviene servirlos con una Content-Security-Policy estricta, porque la página no
necesita nada de afuera:

```
default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline';
font-src 'self'; img-src 'self' data:; form-action 'none'; base-uri 'none';
frame-ancestors 'none'
```

`preview.html` existe para el caso en que la planilla quede detrás de un login:
un redirect no tiene cuerpo, así que el rastreador que arma la previsualización
no encuentra las etiquetas. Serví esa página con 200 en lugar de redirigir, y
dejá `og.png` y `fonts/` fuera del login.

Si lo forkeás, `og:url`, `og:image` y los enlaces de contacto apuntan a
`criptonautas.co`: cambialos en `index.html` y `preview.html`, y poné tu dirección
en `CORREO`, dentro de `app.js`.

### Licencia

[AGPL-3.0-or-later](LICENSE). Elegida a propósito: esto es una herramienta web, y
la obligación de la GPL se dispara con la *distribución*, que nunca ocurre cuando
alguien simplemente hospeda una copia modificada. La AGPL cierra ese hueco, así que
un fork ofrecido como servicio tiene que publicar sus cambios. Para una herramienta
cuya única promesa es que tus datos se quedan en tu navegador, esa verificabilidad
es justamente el punto.

Las fuentes de `fonts/` (Inter Tight) no están bajo AGPL: tienen su propia licencia,
SIL OFL 1.1, incluida en [`fonts/OFL.txt`](fonts/OFL.txt).

Texto de este README bajo [CC BY-NC-SA 4.0](CC-BY-NC-SA-4.0.txt).
