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
