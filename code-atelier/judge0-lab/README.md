# Code Atelier — Judge0 Migration Lab

This directory is an isolated migration experiment. It does **not** replace or edit the production Code Atelier judge entrypoint.

## Open the experiment

After the GitHub Pages deployment finishes:

- https://xuaniyan1.github.io/code-atelier/judge0-lab/

## What this lab checks

1. Fetches Judge0 CE `/languages` and resolves the available C++ compiler plus Multi-file Program (language ID 89).
2. Fetches Wandbox `/api/list.json` and resolves a C++ compiler.
3. Sends a JSON POST to Judge0 for a C++17 smoke test. Since the request uses `Content-Type: application/json`, a successful browser POST also confirms that the browser's CORS preflight worked for the current page origin.
4. Runs the same editable C++17 program and four inputs through:
   - the current Wandbox-style path: first case, then up to three cases concurrently; each request compiles the source again;
   - one Judge0 Multi-file Program submission: one compile script invocation, then four independent process executions in the run script.
5. Displays per-case verdicts and browser-observed end-to-end timings.

## Multi-file package

The page builds a small ZIP archive in the browser without a third-party ZIP library. The archive contains:

- `main.cpp`: editable source code;
- `compile`: Bash script that compiles once with `g++ -std=c++17 -O2 -pipe -Wall -Wextra`;
- `run`: Bash script that starts a fresh process for each test input and emits base64-framed results;
- `tests/01.in` ... `tests/04.in`: four independent test inputs.

It submits the ZIP as `additional_files` with `language_id: 89`. For this language, Judge0 expects the project files inside the ZIP and does not use `source_code`.

## Important limitations

- A GET request to `https://ce.judge0.com/languages` was reachable during setup and exposed C++ GCC 14.1.0 (ID 105) and Multi-file Program (ID 89). The page still resolves language IDs dynamically.
- The setup environment cannot issue a browser-origin POST, so it cannot certify CORS from GitHub Pages. Open the deployed page in the browser and run the experiment; a successful Judge0 POST/token response is the actual CORS test.
- The public CE endpoint is a shared service. Availability, queue time, rate limits, CORS policy, and usage policy can change. This lab does not assume a guaranteed free quota or SLA.
- The benchmark is a one-run diagnostic, not a statistically reliable performance claim. Repeat several times and compare medians if you want a meaningful result.
- Do not submit private source code, credentials, or sensitive data to a public code-execution service.
- Multi-file scripts run in Judge0's sandbox, but their exact runtime limits depend on the public instance configuration. The sample uses a two-second per-case timeout in the shell script plus Judge0's outer sandbox limits.

## Production safety

The production entrypoint `code-atelier/index.html`, the question bank, and the existing test-case data are not changed by this lab. No production judge routing is switched to Judge0.

## Judge0-backed preview of the full practice site

After the Pages deployment finishes, open:

- https://xuaniyan1.github.io/code-atelier/judge0-preview.html

This is a separate copy of the full Code Atelier app. It routes remote C11/C++17 runs and submissions through the Judge0 Multi-file Program adapter in `judge0-runtime.js`; Python remains on the existing Pyodide worker. The preview uses a separate localStorage key (`atelier-judge0-preview-v1)), so its drafts and progress do not overwrite the production site's `atelier-v1` data.

### What changed in the preview

- C11: one Multi-file submission; `compile` uses `gcc -std=c11`.
- C++17: one Multi-file submission; `compile` uses `g++ -std=c++17`.
- The compile script runs once. The run script starts a fresh process for every test input.
- Each test has a 3-second process timeout; the Judge0 outer sandbox has bounded CPU, wall-clock, memory, and file-size limits.
- The browser compares each output with the existing problem bank's expected output. Existing problem data and result-panel UI are reused.
- The previous Wandbox runner remains in the original production file and is not overwritten.

### Preview test checklist

1. Open the preview page and select C++17.
2. Run one existing problem with the Run button; confirm the output panel displays the expected output.
3. Submit the same problem; confirm every test case is listed and AC/WA/RE/TLE is classified correctly.
4. Repeat with C11.
5. Switch to Python and confirm the existing Pyodide path still works.
6. Confirm the production page still uses Wandbox and that its saved drafts/progress are unchanged.

Do not replace the production entrypoint until these checks pass on representative problems, including at least one compile-error case and one deliberately wrong-answer case.

## Performance follow-up

The preview now runs up to **two test cases concurrently** after the single compile step. Each case still gets a fresh process and its own stdin/stdout/stderr files; results are emitted in the original test order. Concurrency is deliberately capped at two to reduce wall time without multiplying peak memory use too aggressively.

The preview also appends a timing breakdown after a submission:
- archive preparation time;
- POST submission time;
- time spent polling for the completed Judge0 result;
- approximate queue and processing intervals when the API exposes a Processing state;
- Judge0 server wall time, when returned.

The public CE queue is outside the browser's control. If the new timing line shows most time under “等待” while the server wall time is small, the bottleneck is the shared public service/network, not local compilation or sequential test execution. A private/self-hosted Judge0 instance or a dedicated execution service would be needed for predictable low latency.
