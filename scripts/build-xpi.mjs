#!/usr/bin/env node

import { createWriteStream, readFileSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import archiver from "archiver";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const INCLUDE = [
  "content",
  "lib",
  "locale",
  "bootstrap.js",
  "manifest.json",
  "prefs.js",
  "zoteroshortdoi.js",
];

const manifest = JSON.parse(readFileSync(join(ROOT, "manifest.json"), "utf8"));
const outFile = join(DIST, `zotero-doi-manager-${manifest.version}.xpi`);

mkdirSync(DIST, { recursive: true });
rmSync(outFile, { force: true });

const output = createWriteStream(outFile);
const archive = archiver("zip", { zlib: { level: 9 } });

output.on("close", () => {
  const sizeKb = (archive.pointer() / 1024).toFixed(1);
  console.log(`Built ${outFile} (${sizeKb} KB)`);
});
archive.on("warning", (error) => {
  if (error.code === "ENOENT") console.warn(error);
  else throw error;
});
archive.on("error", (error) => {
  throw error;
});
archive.pipe(output);

for (const entry of INCLUDE) {
  const source = join(ROOT, entry);
  if (entry.includes(".")) {
    archive.file(source, { name: entry });
  } else {
    archive.glob(
      "**/*",
      { cwd: source, ignore: ["**/__tests__/**"] },
      { prefix: entry }
    );
  }
}

await archive.finalize();
