import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import vm from "node:vm";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const source = readFileSync(join(ROOT, "zoteroshortdoi.js"), "utf8");
const context = {};

vm.runInNewContext(source, context, { filename: "zoteroshortdoi.js" });

const { nextMonthlyRun, isMonthlyVerificationDue } = context;

test("monthly verification keeps a calendar-month cadence", () => {
  assert.equal(
    nextMonthlyRun("2026-01-31T12:00:00.000Z").toISOString(),
    "2026-02-28T12:00:00.000Z"
  );
  assert.equal(
    nextMonthlyRun("2024-01-31T12:00:00.000Z").toISOString(),
    "2024-02-29T12:00:00.000Z"
  );
});

test("monthly verification becomes due at the next monthly run", () => {
  const lastRun = "2026-07-20T16:24:00.000Z";
  assert.equal(
    isMonthlyVerificationDue(lastRun, new Date("2026-08-20T16:23:59.999Z")),
    false
  );
  assert.equal(
    isMonthlyVerificationDue(lastRun, new Date("2026-08-20T16:24:00.000Z")),
    true
  );
  assert.equal(isMonthlyVerificationDue("", new Date()), true);
});
