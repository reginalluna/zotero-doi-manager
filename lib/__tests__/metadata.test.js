import { test } from "node:test";
import assert from "node:assert";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const manifest = JSON.parse(readFileSync(join(ROOT, "manifest.json"), "utf8"));
const updates = JSON.parse(readFileSync(join(ROOT, "updates.json"), "utf8"));
const update = updates.addons[manifest.applications.zotero.id].updates[0];

test("release metadata remains aligned", () => {
  assert.equal(update.version, manifest.version);
  assert.equal(
    update.applications.zotero.strict_min_version,
    manifest.applications.zotero.strict_min_version
  );
  assert.equal(
    update.applications.zotero.strict_max_version,
    manifest.applications.zotero.strict_max_version
  );
  assert.equal(manifest.applications.zotero.strict_max_version, "10.0.*");
  assert.match(update.update_link, new RegExp(`/v${manifest.version}/zotero-doi-manager-${manifest.version}\\.xpi$`));
});
