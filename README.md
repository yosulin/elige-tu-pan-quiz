# OKIN · Elige tu pan — Quiz

PWA sencilla: se muestra la foto de un pan del catálogo de OKIN y hay que
adivinar su nombre entre 4 opciones (1 correcta + 3 sacadas al azar del
propio catálogo). 10 preguntas por partida, sin repetir pan en la misma
partida. Al final: % de aciertos y opción de volver a jugar. Sin login,
sin ranking — todo en local, en el propio dispositivo.

## Cómo probarlo en local

```bash
npm install
npm run dev
```

Abre la URL que te indique la terminal (normalmente `http://localhost:5173`).

## Cómo desplegarlo en GitHub Pages

1. Si el repo se llama, por ejemplo, `okin-elige-tu-pan`, edita
   `vite.config.js` y pon `base: '/okin-elige-tu-pan/'` (con barras a
   ambos lados). Si lo publicas directamente en `tuusuario.github.io`,
   deja `base: '/'`.
2. Genera la build:
   ```bash
   npm run build
   ```
   Esto crea la carpeta `dist/` con la PWA ya compilada (HTML, JS, CSS,
   imágenes, manifest, service worker).
3. Sube el contenido de `dist/` a la rama `gh-pages` del repo (a mano, con
   `gh-pages` npm package, o con una GitHub Action — el mismo patrón que ya
   usas en tus otros proyectos de `yosulin.github.io`).

## Estructura de los datos

`src/data/panes.json` — 56 panes, cada uno con `id` (slug), `nombre` y
`imagen` (ruta a `/public/images`). Las fotos son las fichas de producto
de okin.es/elige-tu-pan (uso interno OKIN).

Para añadir, quitar o corregir un pan: edita directamente ese JSON y, si
hace falta, añade/sustituye la imagen correspondiente en `public/images`.
No hay panel de administración en esta v1 — es intencionado, para
mantenerlo simple.

## Multi-idioma

`src/i18n/{es,eu,en,fr}.json`. Los nombres de los panes NO se traducen
(son nombres propios de producto). Solo se traduce la interfaz.

**Nota sobre el euskera**: la traducción de `eu.json` es una primera
pasada razonable, pero conviene que la revise un hablante nativo antes de
publicarlo — la declinación vasca es fácil de matizar mal y esto lleva el
nombre de OKIN.

## Roadmap (v2, fuera del alcance de esta versión)

- Login (Google/Facebook/Microsoft) y alias único editable.
- Ranking real entre participantes (con Wilson score o puntos, a decidir).
- Panel de administración para añadir/editar panes sin tocar código.
- Backend + base de datos (hoy todo es estático, sin servidor).
