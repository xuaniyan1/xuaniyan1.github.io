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

console.log(`Question bank validation passed: ${problems.length} problems, ${categoryCounts.size} categories, ${totalCases} test cases, ${inlineScripts.length} JavaScript block(s).`);
console.log("All problems have at least four runnable tests; IDs, required fields, sample provenance, and test labels are consistent.");
