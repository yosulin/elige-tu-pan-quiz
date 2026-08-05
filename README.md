# OKIN · Elige tu pan — Quiz

PWA sin backend: se muestra la foto de un pan del catálogo de OKIN y hay que
adivinar su nombre entre 4 opciones (1 correcta + 3 sacadas al azar del
propio catálogo). 10 preguntas por partida, sin repetir pan en la misma
partida. Al final: % de aciertos, confeti si sacas 90%+, y compartir
resultado (tipo Wordle) con quien quieras. Sin login, sin ranking — todo
en local, en el propio dispositivo.

En producción: **https://yosulin.github.io/elige-tu-pan-quiz/**

## Funcionalidades

- Quiz de 10 preguntas, sin repetir imagen en la misma partida (mazo de 56
  panes barajado sin reemplazo)
- Multi-idioma: ES / EU / EN / FR, selector tipo "segmented control" con
  píldora arrastrable (drag real, no solo tap), vibración al cruzar cada
  idioma durante el arrastre
- Peso o longitud del pan como pista visible (dato real del catálogo, no
  delata la respuesta)
- Modo oscuro con detección de preferencia del sistema + toggle manual
- Sonido (Web Audio API, sin archivos) y vibración al responder
- Compartir resultado (Web Share API con fallback a portapapeles), incluye
  cuadrícula de aciertos/fallos tipo Wordle
- Confeti (CSS, sin librería) en resultados de 90%+, respeta
  `prefers-reduced-motion`
- Instalable como PWA: banner de instalación que insiste en cada visita
  mientras no esté instalada (Android/Chrome con prompt nativo, iOS con
  instrucciones manuales), iconos con zona de seguridad "maskable"
- Panel de info (botón ⓘ) con versión, hash del commit y fecha/hora de
  build — para verificar sin ambigüedad si un cambio está desplegado
- Ajustado a altura de pantalla real (`dvh`) con compactado progresivo en
  pantallas cortas (oculta primero lo decorativo)

## Stack

React + Vite, sin TypeScript, sin librerías de UI. CSS plano con variables
(`src/styles/global.css`) para temas claro/oscuro. i18n propio (sin
librería) en `src/i18n/`. `vite-plugin-pwa` para manifest + service worker.

## Cómo probarlo en local

```bash
npm install
npm run dev
```

## Cómo desplegarlo

Ya está configurado con GitHub Actions (`.github/workflows/deploy.yml`):
cualquier push a `main` reconstruye y publica solo en GitHub Pages (Pages
configurado con `build_type: workflow`, no una rama `gh-pages` a mano).
Requiere que el token de despliegue tenga el scope `workflow` además de
`repo`.

Si se publica bajo un subpath (`usuario.github.io/repo/`), el `base: './'`
de `vite.config.js` ya usa rutas relativas — no hace falta tocarlo. Ojo:
las imágenes en `panes.json` usan rutas `/images/...` (absolutas) y se
resuelven en tiempo de ejecución con `src/utils/assetUrl.js` contra
`import.meta.env.BASE_URL` — si algún componente nuevo pinta una imagen
del catálogo, tiene que pasar por ese helper o se romperá en producción
(404 en el subpath).

## Estructura de los datos

`src/data/panes.json` — 56 panes de una muestra del catálogo real (de 119
totales), cada uno con `id` (slug), `nombre`, `imagen`, `peso` (gramos,
puede ser `null`) y `longitud` (cm). Las fotos están en `public/images/`,
extraídas de las fichas de producto de okin.es/elige-tu-pan.

No hay panel de administración: para añadir/editar un pan se edita el
JSON y, si hace falta, se sustituye la imagen — es intencionado, para
mantener esta v1 simple y sin servidor.

## Multi-idioma

`src/i18n/{es,eu,en,fr}.json`, cargados por `src/i18n/index.jsx` (contexto
+ hook `useI18n`, sin librería externa). Los nombres de los panes NO se
traducen (son nombres propios de producto).

**Nota sobre el euskera**: la traducción de `eu.json` es una primera
pasada razonable pero no revisada por un hablante nativo — pendiente antes
de darle más difusión.

## Decisiones de diseño deliberadas (para que otra IA no las "corrija")

- **Sin ranking real ni login**: decisión consciente, no una limitación
  técnica olvidada. Se evaluó login OAuth (Google/Facebook/Microsoft) +
  ranking con Wilson score interval, pero se aparcó por complejidad
  (servidor, hosting) frente al alcance de "muestra de vacaciones".
- **Peso/longitud visibles no es un descuido de balance del juego**: es
  intencionado, pista real y honesta (OKIN fabrica el mismo pan en
  distintos tamaños), no delata la respuesta por sí sola.
- **56 panes, no los 119 del catálogo completo**: límite de tiempo en la
  extracción manual de datos, no una limitación técnica — ampliable.
- **Marcos de foto y "tabla de amasar" en tonos claros fijos, sin variar
  con el tema oscuro**: intencionado, porque las fotos de producto tienen
  fondo blanco fijo; usar tonos oscuros ahí generaba una costura visible.

## Roadmap (fuera del alcance de esta v1, discutido pero no construido)

- **Reto del día**: mismo pan (o mismo set de 10) para todos, cada día,
  vía semilla pseudoaleatoria basada en la fecha — client-side puro, sin
  servidor para la mecánica en sí.
- Para que ese reto del día sea *consultable* por un humano (felicitar,
  premiar), sí hace falta algo de servidor — se decidió ir con Power
  Automate + Excel/SharePoint (el equipo ya usa Microsoft 365/Entra ID),
  no Google Sheets/Apps Script, por coherencia con el resto de la
  infraestructura de la empresa.
- Verificación de identidad opcional sobre eso: login con Microsoft
  Entra ID como "notario" de que el resultado es de quien dice ser —
  explícitamente pospuesto, no descartado.
- Publicación en tiendas: Google Play es viable y barato (TWA vía
  PWABuilder/Bubblewrap, 25$ un pago). App Store de Apple, no — su
  política rechaza explícitamente apps que sean "una web reempaquetada".
