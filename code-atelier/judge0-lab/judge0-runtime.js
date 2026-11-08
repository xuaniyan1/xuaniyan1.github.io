/* Code Atelier Judge0 runtime adapter. Loaded only by judge0-preview.html. */
const ATELIER_JUDGE0_API = 'https://ce.judge0.com';
let atelierJudge0ReadyPromise = null;

async function atelierJudge0Request(url, options, signal, timeoutMs) {
 const controller = new AbortController();
 let timedOut = false;
 const onAbort = () => controller.abort();
 if (signal) {
  if (signal.aborted) controller.abort();
  else signal.addEventListener('abort', onAbort, { once: true });
 }
 const timer = setTimeout(() => { timedOut = true; controller.abort(); }, timeoutMs || 20000);
 try {
  const response = await fetch(url, Object.assign({
   mode: 'cors', credentials: 'omit', signal: controller.signal
  }, options || {}));
  const raw = await response.text();
  let data = {};
  try { data = raw ? JSON.parse(raw) : {}; } catch (_) { data = { raw }; }
  if (!response.ok) {
   if (response.status === 429) throw Error('Judge0 公共服务当前限流（HTTP 429），请稍后重试。');
   throw Error('Judge0 请求失败（HTTP ' + response.status + '）：' + (data.message || data.error || raw.slice(0, 300)));
  }
  return data;
 } catch (error) {
  if (signal && signal.aborted) throw new DOMException('已停止运行。', 'AbortError');
  if (timedOut) throw Error('Judge0 请求超时，请稍后重试。');
  if (error && error.name === 'AbortError') throw Error('Judge0 请求已中断。');
  if (String(error && error.message || '').startsWith('Judge0 ')) throw error;
  throw Error('Judge0 网络请求失败：' + String(error && error.message || error) + '。请检查网络或公共服务状态。');
 } finally {
  clearTimeout(timer);
  if (signal) signal.removeEventListener('abort', onAbort);
 }
}

async function atelierJudge0EnsureReady() {
 if (!atelierJudge0ReadyPromise) {
  atelierJudge0ReadyPromise = Promise.all([
   atelierJudge0Request(ATELIER_JUDGE0_API + '/languages', { cache: 'force-cache' }, null, 20000),
   atelierJudge0Request(ATELIER_JUDGE0_API + '/config_info', { cache: 'force-cache' }, null, 20000)
  ]).then(([languages, config]) => {
   if (!Array.isArray(languages) || !languages.some(item => Number(item.id) === 89)) {
    throw Error('Judge0 当前没有提供 Multi-file Program（语言 ID 89）。');
   }
   if (!config || config.maintenance_mode || config.enable_additional_files !== true) {
    throw Error('Judge0 当前没有启用 Multi-file 所需的 additional_files 功能。');
   }
   return true;
  }).catch(error => {
   atelierJudge0ReadyPromise = null;
   throw error;
  });
 }
 return atelierJudge0ReadyPromise;
}

function atelierJudge0Crc32(bytes) {
 let crc = 0xffffffff;
 for (let i = 0; i < bytes.length; i++) {
  crc ^= bytes[i];
  for (let j = 0; j < 8; j++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
 }
 return (crc ^ 0xffffffff) >>> 0;
}

function atelierJudge0Concat(parts) {
 let size = 0;
 for (const part of parts) size += part.length;
 const output = new Uint8Array(size);
 let offset = 0;
 for (const part of parts) { output.set(part, offset); offset += part.length; }
 return output;
}

function atelierJudge0MakeZip(files) {
 const encoder = new TextEncoder();
 const localParts = [], centralParts = [];
 const now = new Date();
 const year = Math.min(2107, Math.max(1980, now.getFullYear()));
 const dosTime = (now.getHours() << 11) | (now.getMinutes() << 5) | Math.floor(now.getSeconds() / 2);
 const dosDate = ((year - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();
 let offset = 0;
 for (const file of files) {
  const name = encoder.encode(file.name);
  const data = typeof file.content === 'string' ? encoder.encode(file.content) : file.content;
  const crc = atelierJudge0Crc32(data);
  const local = new Uint8Array(30 + name.length + data.length);
  const ld = new DataView(local.buffer);
  ld.setUint32(0, 0x04034b50, true);
  ld.setUint16(4, 20, true);
  ld.setUint16(6, 0x0800, true);
  ld.setUint16(8, 0, true);
  ld.setUint16(10, dosTime, true);
  ld.setUint16(12, dosDate, true);
  ld.setUint32(14, crc, true);
  ld.setUint32(18, data.length, true);
  ld.setUint32(22, data.length, true);
  ld.setUint16(26, name.length, true);
  ld.setUint16(28, 0, true);
  local.set(name, 30);
  local.set(data, 30 + name.length);
  localParts.push(local);

  const central = new Uint8Array(46 + name.length);
  const cd = new DataView(central.buffer);
  cd.setUint32(0, 0x02014b50, true);
  cd.setUint16(4, 0x0314, true);
  cd.setUint16(6, 20, true);
  cd.setUint16(8, 0x0800, true);
  cd.setUint16(10, 0, true);
  cd.setUint16(12, dosTime, true);
  cd.setUint16(14, dosDate, true);
  cd.setUint32(16, crc, true);
  cd.setUint32(20, data.length, true);
  cd.setUint32(24, data.length, true);
  cd.setUint16(28, name.length, true);
  cd.setUint16(30, 0, true);
  cd.setUint16(32, 0, true);
  cd.setUint16(34, 0, true);
  cd.setUint16(36, 0, true);
  cd.setUint32(38, ((file.executable ? 0o100755 : 0o100644) * 65536) >>> 0, true);
  cd.setUint32(42, offset, true);
  central.set(name, 46);
  centralParts.push(central);
  offset += local.length;
 }
 const localBytes = atelierJudge0Concat(localParts);
 const centralBytes = atelierJudge0Concat(centralParts);
 const end = new Uint8Array(22);
 const ed = new DataView(end.buffer);
 ed.setUint32(0, 0x06054b50, true);
 ed.setUint16(4, 0, true);
 ed.setUint16(6, 0, true);
 ed.setUint16(8, files.length, true);
 ed.setUint16(10, files.length, true);
 ed.setUint32(12, centralBytes.length, true);
 ed.setUint32(16, localBytes.length, true);
 ed.setUint16(20, 0, true);
 return atelierJudge0Concat([localBytes, centralBytes, end]);
}

function atelierJudge0Base64(bytes) {
 let binary = '';
 const chunkSize = 0x8000;
 for (let i = 0; i < bytes.length; i += chunkSize) {
  binary += String.fromCharCode.apply(null, bytes.subarray(i, Math.min(i + chunkSize, bytes.length)));
 }
 return btoa(binary);
}

function atelierJudge0DecodeBase64(value) {
 if (!value) return '';
 const binary = atob(String(value).replace(/\s/g, ''));
 const bytes = new Uint8Array(binary.length);
 for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
 return new TextDecoder('utf-8').decode(bytes);
}

function atelierJudge0Normalize(value) {
 return String(value == null ? '' : value).trim().split(/\s+/).filter(Boolean).join('\0');
}

function atelierJudge0BuildArchive(data, tests) {
 const isC = data.language === 'c';
 const sourceName = isC ? 'main.c' : 'main.cpp';
 const compiler = isC ? 'gcc -std=c11' : 'g++ -std=c++17';
 const compileScript = [
  '#!/bin/bash',
  'set -euo pipefail',
  compiler + ' -O2 -pipe -Wall -Wextra ' + sourceName + ' -o main',
  ''
 ].join('\n');
 const runScript = [
  '#!/bin/bash',
  'set +e',
  'tmp_dir=$(mktemp -d)',
  "trap 'rm -rf \"$tmp_dir\"' EXIT",
  'run_one() {',
  '  input_file="$1"',
  '  case_id=$(basename "$input_file" .in)',
  '  start_ns=$(date +%s%N)',
  '  timeout -k 1s 3s ./main < "$input_file" > "$tmp_dir/$case_id.out" 2> "$tmp_dir/$case_id.err"',
  '  exit_code=$?',
  '  end_ns=$(date +%s%N)',
  '  elapsed_ms=0',
  '  if [[ "$start_ns" =~ ^[0-9]+$ && "$end_ns" =~ ^[0-9]+$ ]]; then elapsed_ms=$(( (end_ns - start_ns) / 1000000 )); fi',
  '  if [ "$exit_code" -eq 124 ] || [ "$exit_code" -eq 137 ]; then exit_code=124; fi',
  '  { printf "ATELIER_CASE|%s|%s|%s|" "$case_id" "$exit_code" "$elapsed_ms"; base64 -w 0 "$tmp_dir/$case_id.out"; printf "|"; base64 -w 0 "$tmp_dir/$case_id.err"; printf "\\n"; } > "$tmp_dir/$case_id.result"',
  '}',
  'active=0',
  'for input_file in tests/*.in; do',
  '  [ -f "$input_file" ] || continue',
  '  run_one "$input_file" &',
  '  active=$((active + 1))',
  '  if [ "$active" -ge 2 ]; then wait -n || true; active=$((active - 1)); fi',
  'done',
  'wait || true',
  'for input_file in tests/*.in; do',
  '  [ -f "$input_file" ] || continue',
  '  case_id=$(basename "$input_file" .in)',
  '  if [ -f "$tmp_dir/$case_id.result" ]; then cat "$tmp_dir/$case_id.result"; else printf "ATELIER_CASE|%s|1|0||\\n" "$case_id"; fi',
  'done',
  'exit 0',
  ''
 ].join('\n');
 const files = [
  { name: sourceName, content: data.code },
  { name: 'compile', content: compileScript, executable: true },
  { name: 'run', content: runScript, executable: true }
 ];
 tests.forEach((test, index) => {
  const caseId = String(index + 1).padStart(4, '0');
  files.push({ name: 'tests/' + caseId + '.in', content: String(test.input == null ? '' : test.input) });
 });
 const zip = atelierJudge0MakeZip(files);
 if (zip.length > 1024 * 1024) throw Error('本题代码与测试数据打包后超过 1 MB，超过当前公共服务实验限制。');
 return atelierJudge0Base64(zip);
}

async function atelierJudge0Poll(token, action, signal) {
 const fields = 'token,status,stdout,stderr,compile_output,message,exit_code,time,wall_time,memory';
 const url = ATELIER_JUDGE0_API + '/submissions/' + encodeURIComponent(token) +
  '?base64_encoded=true&fields=' + encodeURIComponent(fields);
 const started = performance.now();
 let polls = 0;
 let firstProcessingAt = null;
 while (performance.now() - started < 90000) {
  const result = await atelierJudge0Request(url, {}, signal, 20000);
  polls++;
  const statusId = Number(result.status && result.status.id);
  if (statusId === 2 && firstProcessingAt === null) firstProcessingAt = performance.now();
  if (statusId !== 1 && statusId !== 2) {
   const finishedAt = performance.now();
   return {
    result, polls,
    pollMs: Math.round(finishedAt - started),
    queueWaitMs: firstProcessingAt === null ? null : Math.round(firstProcessingAt - started),
    executionWaitMs: firstProcessingAt === null ? null : Math.round(finishedAt - firstProcessingAt)
   };
  }
  const label = statusId === 1 ? '排队中' : '执行中';
  if (action === 'run') $('runStatus').textContent = 'Judge0 ' + label + '…';
  else $('judgeSummary').textContent = 'Judge0 ' + label + ' · 已查询 ' + polls + ' 次…';
  await waitRemote(polls <= 3 ? 250 : 400, signal);
 }
 throw Error('Judge0 等待结果超过 90 秒，请稍后重试。');
}

async function atelierJudge0Run(data, signal) {
 const tests = data.action === 'run' ? [{ input: data.stdin, expected: '' }] : (current.tests || []);
 if (!tests.length) return { status: 'FAILED', passed: 0, total: 0, results: [] };
 const started = performance.now();
 const readyStarted = performance.now();
 await atelierJudge0EnsureReady();
 const readyMs = Math.round(performance.now() - readyStarted);
 if (signal && signal.aborted) throw new DOMException('已停止运行。', 'AbortError');
 const archiveStarted = performance.now();
 const archive = atelierJudge0BuildArchive(data, tests);
 const archiveMs = Math.round(performance.now() - archiveStarted);
 if (data.action === 'run') $('runStatus').textContent = '正在打包并提交 Judge0…';
 else $('judgeSummary').textContent = '正在打包并提交 Judge0（' + tests.length + ' 组测试）…';

 const payload = {
  language_id: 89,
  additional_files: archive,
  cpu_time_limit: 15,
  cpu_extra_time: 2,
  wall_time_limit: 25,
  memory_limit: 256000,
  stack_limit: 64000,
  max_file_size: 1024,
  enable_network: false
 };
 const submitStarted = performance.now();
 const submitted = await atelierJudge0Request(
  ATELIER_JUDGE0_API + '/submissions?base64_encoded=false',
  { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(payload) },
  signal,
  30000
 );
 const submitMs = Math.round(performance.now() - submitStarted);
 if (!submitted || !submitted.token) throw Error('Judge0 没有返回提交 token。');
 const pollInfo = await atelierJudge0Poll(submitted.token, data.action, signal);
 const result = pollInfo.result;
 const timings = {
  readyMs, archiveMs, submitMs, pollMs: pollInfo.pollMs, polls: pollInfo.polls,
  queueWaitMs: pollInfo.queueWaitMs, executionWaitMs: pollInfo.executionWaitMs
 };
 const statusId = Number(result.status && result.status.id);
 const description = String(result.status && result.status.description || '未知状态');
 const compileOutput = atelierJudge0DecodeBase64(result.compile_output);
 const serviceStderr = atelierJudge0DecodeBase64(result.stderr);
 if (statusId !== 3) {
  let verdict = 'RE';
  if (statusId === 5) verdict = 'TLE';
  else if (statusId === 6) verdict = 'CE';
  const message = verdict === 'CE' ? '编译失败' : verdict === 'TLE' ? '整题测评超过服务器时间限制' : 'Judge0 执行失败：' + description;
  return { status: verdict, message, stderr: compileOutput || serviceStderr || result.message || description, results: null, elapsedMs: Math.round(performance.now() - started), timings, serverTime: result.time || null, serverWallTime: result.wall_time || null };
 }

 const output = atelierJudge0DecodeBase64(result.stdout);
 const rows = new Map();
 output.split(/\r?\n/).forEach(line => {
  const match = line.match(/^ATELIER_CASE\|(\d+)\|(-?\d+)\|(\d+)\|([^|]*)\|([^|]*)$/);
  if (!match) return;
  rows.set(Number(match[1]), {
   exitCode: Number(match[2]),
   timeMs: Number(match[3]),
   stdout: atelierJudge0DecodeBase64(match[4]),
   stderr: atelierJudge0DecodeBase64(match[5])
  });
 });
 const results = tests.map((test, index) => {
  const row = rows.get(index + 1);
  if (!row) return {
   index: index + 1, input: test.input, expected: test.expected || '',
   stdout: '', stderr: 'Judge0 未返回该组测试的结果。', timeMs: null, status: 'RE'
  };
  let verdict;
  if (row.exitCode === 124 || row.exitCode === 137) verdict = 'TLE';
  else if (row.exitCode !== 0) verdict = 'RE';
  else if (data.action === 'run') verdict = 'OK';
  else verdict = atelierJudge0Normalize(row.stdout) === atelierJudge0Normalize(test.expected) ? 'AC' : 'WA';
  return {
   index: index + 1, input: test.input, expected: test.expected || '',
   stdout: row.stdout, stderr: row.stderr, timeMs: row.timeMs, status: verdict
  };
 });
 if (data.action === 'run') {
  const first = results[0];
  return {
   status: first.status === 'OK' ? 'OK' : first.status,
   stdout: first.stdout,
   stderr: first.stderr,
   timeMs: first.timeMs,
   elapsedMs: Math.round(performance.now() - started),
   timings, serverTime: result.time || null, serverWallTime: result.wall_time || null
  };
 }
 const passed = results.filter(item => item.status === 'AC').length;
 return {
  status: passed === results.length ? 'AC' : 'FAILED',
  passed, total: results.length, results,
  elapsedMs: Math.round(performance.now() - started),
  timings,
  serverTime: result.time || null,
  serverWallTime: result.wall_time || null
 };
}


const atelierJudge0OriginalShowResult = showResult;
showResult = function(result, action) {
 atelierJudge0OriginalShowResult(result, action);
 if (!result || !result.timings) return;
 const seconds = value => (Number(value || 0) / 1000).toFixed(2) + 's';
 const t = result.timings;
 if (action === 'submit') {
  const details = [
   '总耗时 ' + seconds(result.elapsedMs),
   '打包 ' + seconds(t.archiveMs),
   '提交 ' + seconds(t.submitMs),
   '等待 ' + seconds(t.pollMs)
  ];
  if (t.queueWaitMs !== null) details.push('排队约 ' + seconds(t.queueWaitMs));
  if (t.executionWaitMs !== null) details.push('执行等待约 ' + seconds(t.executionWaitMs));
  if (result.serverWallTime !== null) details.push('服务端 wall ' + result.serverWallTime + 's');
  $('judgeSummary').textContent += ' · ' + details.join(' / ');
  $('judgeSummary').title = details.join('\n') + ' · 轮询 ' + t.polls + ' 次';
 } else {
  $('runStatus').textContent += ' · 总耗时 ' + seconds(result.elapsedMs);
 }
};

const atelierWandboxFallback = wandboxRun;
wandboxRun = atelierJudge0Run;

const atelierOldEngineLabel = engineLabel;
engineLabel = function() {
 if (local || language === 'py') return atelierOldEngineLabel();
 $('engine').textContent = '在线判题 · Judge0';
 $('engineDot').style.background = '#8ca67e';
};

const atelierOldWarmExecutionEngine = warmExecutionEngine;
warmExecutionEngine = function() {
 if (language === 'py') return atelierOldWarmExecutionEngine();
 if (active) return;
 $('engine').textContent = '正在预热 Judge0…';
 atelierJudge0EnsureReady().then(() => engineLabel()).catch(() => engineLabel());
};
$('editor').removeEventListener('focus', atelierOldWarmExecutionEngine);
$('editor').addEventListener('focus', warmExecutionEngine);
