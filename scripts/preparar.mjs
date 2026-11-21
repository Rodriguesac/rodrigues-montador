import { readFile, writeFile, mkdir, copyFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
await mkdir(path.join(dist, "imagens"), { recursive: true });
for (const f of ["index.html", "sw.js", "manifest.webmanifest", "icon.svg"]) {
  await copyFile(path.join(root, f), path.join(dist, f));
}
const catalog = JSON.parse(await readFile(path.join(root, "catalogo-estatico.json"), "utf8"));
const urls = new Map();
for (const arr of Object.values(catalog)) {
  if (!Array.isArray(arr)) continue;
  for (const item of arr) {
    for (const key of ["imagem_url", "url_logo_item"]) {
      const url = item[key];
      if (typeof url !== "string" || !url.startsWith("https://i.ibb.co/")) continue;
      if (!urls.has(url)) urls.set(url, []);
      urls.get(url).push([item, key]);
    }
  }
}

const tasks = [...urls.entries()];
let done = 0, failed = 0;
const allowed = new Map([["image/png", ".png"], ["image/jpeg", ".jpg"], ["image/webp", ".webp"], ["image/avif", ".avif"], ["image/gif", ".gif"]]);
let cursor = 0;
async function worker() {
  while (cursor < tasks.length) {
    const [url, places] = tasks[cursor++];
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(15000), redirect: "follow" });
      if (!response.ok) throw Error("HTTP " + response.status);
      const type = (response.headers.get("content-type") || "").split(";")[0].toLowerCase();
      const ext = allowed.get(type);
      if (!ext) throw Error("Not an image: " + type);
      const bytes = new Uint8Array(await response.arrayBuffer());
      if (bytes.length < 200 || bytes.length > 5_000_000) throw Error("Unexpected image size");
      const filename = createHash("sha256").update(url).digest("hex").slice(0, 16) + ext;
      await writeFile(path.join(dist, "imagens", filename), bytes);
      for (const [item, key] of places) item[key] = "./imagens/" + filename;
      done++;
    } catch (err) {
      // Foto externa segue com URL original quando não for possível copiá-la.
      failed++;
      console.warn("Não foi possível copiar:", url, String(err));
    }
  }
}
await Promise.all(Array.from({ length: 6 }, () => worker()));
await writeFile(path.join(dist, "catalogo-estatico.json"), JSON.stringify(catalog, null, 2));
console.log("Imagens locais:", done, "externas restantes:", failed);
