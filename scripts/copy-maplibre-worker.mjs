// Copia o worker do MapLibre GL (e seu chunk compartilhado) pra public/,
// pra servir num caminho estático fixo em vez de depender do bundler
// (Turbopack) resolver corretamente `new Worker(new URL(...))` — resolvia
// pra uma URL vazia, quebrando o carregamento/parsing de tiles vetoriais em
// silêncio (ver MapView.tsx, setWorkerUrl). Roda automaticamente após
// `npm install` (script "postinstall"), pra manter a cópia sincronizada com
// a versão instalada do maplibre-gl.
import { copyFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const files = ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"];

for (const file of files) {
  const src = path.join(rootDir, "node_modules", "maplibre-gl", "dist", file);
  const dest = path.join(rootDir, "public", file);
  copyFileSync(src, dest);
}

console.log("maplibre-gl worker copiado pra public/");
