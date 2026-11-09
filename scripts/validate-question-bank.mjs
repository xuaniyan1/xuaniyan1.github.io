import { readFileSync } from "node:fs";
import { Script } from "node:vm";
import { resolve } from "node:path";

const pagePath = resolve("code-atelier/buaa-exams/index.html");
const html = readFileSync(pagePath, "utf8");

function extractJson(startMarker, endMarker, offset = 0) {
  const start = html.indexOf(startMarker, offset);
  if (start < 0) throw new Error(`Missing marker: ${startMarker}`);
  const contentStart = start + startMarker.length;
  const end = html.indexOf(endMarker, contentStart);
  if (end < 0) throw new Error(`Missing end marker: ${endMarker}`);
  return JSON.parse(html.slice(contentStart, end));
}

const problems = extractJson("const problems=", ";\nconst cases=");
const cases = extractJson("const cases=", ";\nconst $", html.indexOf("const cases="));

if (!Array.isArray(problems) || problems.length === 0) {
  throw new Error("The problem bank must be a non-empty array.");
}
if (!cases || Array.isArray(cases) || typeof cases !== "object") {
  throw new Error("The test-case bank must be an object keyed by problem id.");
}

const requiredFields = [
  "id", "year", "title", "topic", "level", "category", "tags",
  "description", "input", "output", "limits", "requirements", "focus",
  "origin", "source", "url"
];
const ids = new Set();
const problemIds = new Set(problems.map(problem => problem.id));
const categoryCounts = new Map();
let totalCases = 0;

for (const problem of problems) {
  for (const field of requiredFields) {
    if (problem[field] === undefined || problem[field] === null || problem[field] === "") {
      throw new Error(`Problem ${problem.id ?? "(unknown)"} is missing required field: ${field}`);
    }
  }
  if (ids.has(problem.id)) throw new Error(`Duplicate problem id: ${problem.id}`);
  ids.add(problem.id);

  if (!Array.isArray(problem.tags) || problem.tags.length === 0) {
    throw new Error(`Problem ${problem.id} must have at least one algorithm tag.`);
  }
  if (typeof problem.url !== "string" || !/^https?:\/\//.test(problem.url)) {
    throw new Error(`Problem ${problem.id} has an invalid source URL.`);
  }
  categoryCounts.set(problem.category, (categoryCounts.get(problem.category) ?? 0) + 1);

  // This bank is reserved for historical BUAA exam and camp questions, not generic algorithm exercises.
  if (problem.year === "408 拓展" || String(problem.id).startsWith("train-408-")) {
    throw new Error(`Generic 408 training problem ${problem.id} must not be included in the BUAA exam bank.`);
  }

  const tests = cases[problem.id];
  if (!Array.isArray(tests) || tests.length < 4) {
    throw new Error(`Problem ${problem.id} must have at least four runnable test cases.`);
  }
  for (let index = 0; index < tests.length; index++) {
    const test = tests[index];
    if (!Array.isArray(test) || test.length < 2 || test.length > 3) {
      throw new Error(`Problem ${problem.id}, test ${index + 1}: expected [input, output, optional label].`);
    }
    if (typeof test[0] !== "string" || typeof test[1] !== "string") {
      throw new Error(`Problem ${problem.id}, test ${index + 1}: input and output must be strings.`);
    }
    if (test.length === 3 && (typeof test[2] !== "string" || !test[2].trim())) {
      throw new Error(`Problem ${problem.id}, test ${index + 1}: test label must be a non-empty string.`);
    }
    totalCases++;
  }

  const hasSampleInput = Object.hasOwn(problem, "sampleInput");
  const hasSampleOutput = Object.hasOwn(problem, "sampleOutput");
  if (hasSampleInput !== hasSampleOutput) {
    throw new Error(`Problem ${problem.id} must provide both sampleInput and sampleOutput, or neither.`);
  }
  if (hasSampleInput) {
    const first = tests[0];
    if (first[0] !== problem.sampleInput || first[1] !== problem.sampleOutput) {
      throw new Error(`Problem ${problem.id}: displayed sample must match the first runnable test.`);
    }
    if (typeof problem.sampleLabel !== "string" || !problem.sampleLabel.trim()) {
      throw new Error(`Problem ${problem.id}: sample provenance label is required.`);
    }
  }
}

for (const id of Object.keys(cases)) {
  if (!problemIds.has(id)) throw new Error(`Orphan test data for unknown problem id: ${id}`);
}

const inlineScripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)]
  .map(match => match[1])
  .filter(source => source.trim().length > 0);
if (inlineScripts.length === 0) throw new Error("No inline application script found.");
inlineScripts.forEach((source, index) => {
  new Script(source, { filename: `buaa-exams-inline-${index + 1}.js` });
});

if (!html.includes('id="category"') || !html.includes("function refreshTopicOptions")) {
  throw new Error("Algorithm category filtering is missing.");
}
if (!html.includes("c[2]||") || !html.includes("p.sampleLabel||")) {
  throw new Error("Test coverage labels or sample provenance labels are not rendered.");
}

// Verify that the provenance tools and convenient year filters remain available.
for (const required of ['id="sourceType"', 'id="sortOrder"', "function sourceGroup(", "function restoreLastProblem(", "value='recent'"]) {
  if (!html.includes(required)) throw new Error("Question bank provenance UX is missing: " + required);
}
if (!html.includes("CS-BAOYAN-2022/pull/23/files") || !html.includes("2022 · 预推免机试第二题")) {
  throw new Error("Source PDF reference for 2022 pre-admission exam is missing.");
}

// Independently validate the 2019 eyewitness-sourced circular queue reconstruction.
// This deliberately uses a linked successor graph rather than the array-index deletion oracle.
const circular = problems.find(problem => problem.id === "2019-summer-circular-min");
if (!circular || circular.year !== "2019" || !circular.origin.includes("亲历回忆")) {
  throw new Error("2019 summer camp eyewitness question or provenance is missing.");
}
if (!Array.isArray(cases[circular.id]) || cases[circular.id].length < 8) {
  throw new Error("2019 circular queue reconstruction has insufficient coverage.");
}
function checkCircular(input) {
  const values = input.trim().split(/\s+/).map(Number);
  const n = values.shift();
  if (!Number.isInteger(n) || n <= 0 || values.length !== n) {
    throw new Error("Malformed 2019 circular queue test input.");
  }
  const next = Array.from({ length: n }, (_, i) => (i + 1) % n);
  const lines = [];
  let start = 0, remaining = n;
  while (remaining > 0) {
    let best = start, x = start;
    for (let i = 0; i < remaining; i++) {
      if (values[x] < values[best]) best = x;
      x = next[x];
    }
    const visited = [];
    x = start;
    while (true) {
      visited.push(values[x]);
      if (x === best) break;
      x = next[x];
    }
    lines.push(visited.join(" "));
    if (remaining === 1) break;
    let before = best;
    while (next[before] !== best) before = next[before];
    start = next[best];
    next[before] = start;
    remaining--;
  }
  return lines.join("\n");
}
for (const [index, test] of cases[circular.id].entries()) {
  if (checkCircular(test[0]) !== test[1]) {
    throw new Error("2019 circular queue test " + (index + 1) + " disagrees with linked-list reference.");
  }
}

console.log(`Question bank validation passed: ${problems.length} problems, ${categoryCounts.size} categories, ${totalCases} test cases, ${inlineScripts.length} JavaScript block(s).`);
console.log("All problems have at least four runnable tests; IDs, required fields, sample provenance, and test labels are consistent.");
console.log("Only sourced BUAA historical exam/camp questions and explicitly marked reconstructions are allowed; generic 408 training problems are excluded.");
