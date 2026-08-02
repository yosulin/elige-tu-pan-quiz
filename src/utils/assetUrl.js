// En GitHub Pages la app no vive en la raíz del dominio (p.ej.
// https://usuario.github.io/elige-tu-pan-quiz/), así que cualquier ruta que
// empiece por "/" (como las de panes.json) hay que recomponerla contra el
// BASE_URL real que Vite conoce en tiempo de build. Sin esto, las imágenes
// apuntan a la raíz del dominio y no se encuentran (404).
export function assetUrl(path) {
  const base = import.meta.env.BASE_URL // p.ej. './' o '/elige-tu-pan-quiz/'
  const clean = path.replace(/^\/+/, '')
  return base.endsWith('/') ? `${base}${clean}` : `${base}/${clean}`
}
