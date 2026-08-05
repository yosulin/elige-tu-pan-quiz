#!/usr/bin/env node
// Valida src/data/panes.json antes de desplegar: ids duplicados, nombres
// vacíos, imágenes que no existen en disco, medidas inválidas. Pensado
// para pillar errores de edición a mano del JSON antes de que lleguen
// a producción, no para validar la calidad del contenido en sí.
import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')
const panesPath = path.join(rootDir, 'src/data/panes.json')

const panes = JSON.parse(readFileSync(panesPath, 'utf-8'))
const errors = []
const seenIds = new Set()

for (const pan of panes) {
  const label = pan?.id ? `"${pan.id}"` : JSON.stringify(pan)

  if (!pan.id || typeof pan.id !== 'string') {
    errors.push(`${label}: falta un "id" válido`)
    continue
  }
  if (seenIds.has(pan.id)) errors.push(`id duplicado: "${pan.id}"`)
  seenIds.add(pan.id)

  if (!pan.nombre || !pan.nombre.trim()) {
    errors.push(`${label}: "nombre" vacío`)
  }

  if (!pan.imagen) {
    errors.push(`${label}: falta el campo "imagen"`)
  } else {
    const imgFile = path.join(rootDir, 'public', pan.imagen.replace(/^\/+/, ''))
    if (!existsSync(imgFile)) {
      errors.push(`${label}: la imagen "${pan.imagen}" no existe en public/`)
    }
  }

  const numericOrNull = (value, field) => {
    if (value === null || value === undefined) return
    if (typeof value !== 'number' || Number.isNaN(value) || value <= 0) {
      errors.push(`${label}: "${field}" inválido (${JSON.stringify(value)})`)
    }
  }
  numericOrNull(pan.peso, 'peso')
  numericOrNull(pan.longitud, 'longitud')

  if (pan.peso == null && pan.longitud == null) {
    errors.push(`${label}: sin "peso" ni "longitud" — la ficha se quedaría sin insignia`)
  }
}

if (panes.length < 4) {
  errors.push(
    `Solo hay ${panes.length} pan(es) — hacen falta al menos 4 para generar una pregunta (1 correcta + 3 distractores)`
  )
}

if (errors.length > 0) {
  console.error(`❌ validate-data: ${errors.length} problema(s) en panes.json\n`)
  for (const e of errors) console.error(`  - ${e}`)
  process.exit(1)
}

console.log(`✅ validate-data: ${panes.length} panes correctos`)
