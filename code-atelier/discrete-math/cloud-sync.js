/* Code Atelier / Discrete Math II cloud progress adapter.
   Static hosting is supported. Backend: Supabase Auth + RLS-protected dm2_progress.
   Guest progress is NEVER auto-uploaded. User-scoped local cache keeps unsynced edits.
   Optimistic revision prevents silent overwrites from another device.
   Do not add a Supabase secret or service_role key to any browser file. */
(function () {
  "use strict";

  var cfg = window.DM2_CLOUD_CONFIG || {};
  var enabled = /^https:\/\//.test(cfg.url || "") &&
    /^(sb_publishable_|eyJ)/.test(cfg.publishableKey || "");
  var sections = new Map();
  var client = null;
  var user = null;
  var bootPromise = null;
  var status = "本机保存";
  var accountError = "";

  // Supabase returns auth failures in the URL fragment. Surface the actual
  // reason in the account panel instead of leaving the user in a silent guest state.
  function consumeAuthCallbackError() {
    var hash = window.location.hash || "";
    if (!hash || hash.indexOf("error_code=") < 0) return;
    var params;
    try { params = new URLSearchParams(hash.charAt(0) === "#" ? hash.slice(1) : hash); }
    catch (_) { return; }
    var code = params.get("error_code");
    if (!code) return;
    if (code === "otp_expired") {
      accountError = "邮件登录链接已过期或已被使用。请重新输入邮箱发送最新邮件，并只点击最新邮件中的链接一次。如果刚收到就失效，可能是邮箱安全扫描提前打开了链接；届时建议改用邮件验证码登录。";
    } else {
      accountError = "邮件验证未完成（" + code + "）。请重新发送登录邮件后再试。";
    }
    try {
      window.history.replaceState(null, document.title, window.location.pathname + window.location.search);
    } catch (_) {}
  }
  consumeAuthCallbackError();

  function $() { return document.getElementById("cloudAccount"); }
  function esc(x) {
    return String(x == null ? "" : x).replace(/[&<>"']/g, function (ch) {
      return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch];
    });
  }
  function jsonGet(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (_) { return fallback; }
  }
  function jsonSet(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch (_) { return false; }
  }
  function cacheKey(e) { return e.legacyKey + ".cloud." + user.id; }
  function dirtyKey(e) { return cacheKey(e) + ".pending"; }
  function localKey(legacyKey) {
    return user ? legacyKey + ".cloud." + user.id : legacyKey;
  }
  function hasProgress(section, state) {
    if (!state || typeof state !== "object") return false;
    if (section === "homework") {
      return Object.keys(state.status || {}).length > 0 ||
        (state.bookmarks || []).length > 0 || Object.keys(state.drafts || {}).length > 0;
    }
    return Object.keys(state.records || {}).length > 0 ||
      (state.bookmarks || []).length > 0 || Object.keys(state.drafts || {}).length > 0;
  }
  function show(message) {
    status = message || status;
    render();
  }

  function render() {
    var root = $();
    if (!root) return;
    if (!enabled) {
      root.innerHTML = '<div class="cloud-row"><b>学习进度：本机保存</b>' +
        '<span>尚未配置登录服务；现有收藏、错题和笔记不受影响。</span>' +
        '<a href="https://github.com/xuaniyan1/xuaniyan1.github.io/blob/main/code-atelier/discrete-math/CLOUD_SETUP.md" target="_blank" rel="noopener">如何启用账号同步 ↗</a></div>';
      return;
    }
    if (!client) {
      root.innerHTML = '<div class="cloud-row"><b>账号同步</b><span>' +
        esc(accountError || "正在准备登录服务……") + '</span></div>';
      return;
    }
    if (!user) {
      root.innerHTML = '<div class="cloud-row"><b>游客模式 · 进度保存在本机</b>' +
        '<form class="cloud-auth-form" id="dm2EmailForm">' +
        '<input type="email" id="dm2Email" required autocomplete="email" placeholder="输入邮箱，接收免密登录链接" aria-label="邮箱地址">' +
        '<button type="submit">邮箱登录</button></form>' +
        (cfg.enableGitHub ? '<button type="button" id="dm2GitHubLogin">GitHub 登录</button>' : '') +
        '<span class="cloud-message">' + esc(accountError || "登录后可以跨设备同步；原游客进度需主动选择导入。") + '</span></div>';
      root.querySelector("#dm2EmailForm").addEventListener("submit", async function (event) {
        event.preventDefault();
        var email = root.querySelector("#dm2Email").value.trim();
        if (!email) return;
        show("发送登录邮件中……");
        try {
          var result = await client.auth.signInWithOtp({
            email: email,
            options: { emailRedirectTo: location.origin + location.pathname }
          });
          if (result.error) throw result.error;
          accountError = "登录邮件已发送，请使用最新邮件中的链接。链接仅能使用一次。";
        } catch (err) { accountError = "发送失败：" + err.message; }
        render();
      });
      var gh = root.querySelector("#dm2GitHubLogin");
      if (gh) gh.addEventListener("click", async function () {
        try {
          var result = await client.auth.signInWithOAuth({
            provider: "github", options: { redirectTo: location.origin + location.pathname }
          });
          if (result.error) throw result.error;
        } catch (err) { accountError = "GitHub 登录失败：" + err.message; render(); }
      });
      return;
    }

    var e = sections.values().next().value;
    var guest = e ? jsonGet(e.legacyKey, e.empty()) : null;
    var showImport = e && hasProgress(e.section, guest) && e.loaded && !e.conflict &&
      localStorage.getItem(cacheKey(e) + ".guestImported") !== "1";
    var trouble = e && e.conflict;
    var warning = e && e.warning ? e.warning : "";
    root.innerHTML = '<div class="cloud-row"><b>已登录 · ' + esc(user.email || user.id.slice(0, 8)) + '</b>' +
      '<span class="cloud-message">' + esc(warning || (e ? status || "云同步已启用" : "账号已连接；进入训练模块后自动加载并同步对应进度。")) + '</span>' +
      (e ? '<button type="button" id="dm2SyncNow">立即同步</button>' : '') +
      (showImport ? '<button type="button" id="dm2ImportGuest">导入此设备游客进度</button>' : '') +
      (trouble ? '<button type="button" id="dm2UseCloud">使用云端版本</button>' +
        '<button type="button" id="dm2KeepLocal">用本机版本覆盖云端</button>' : '') +
      '<button type="button" id="dm2Logout">退出登录</button></div>';
    var syncButton = root.querySelector("#dm2SyncNow");
    if (syncButton) syncButton.addEventListener("click", function () {
      if (e) flush(e, true);
    });
    var importButton = root.querySelector("#dm2ImportGuest");
    if (importButton) importButton.addEventListener("click", function () {
      if (!e || !e.loaded || e.conflict) return;
      if (!window.confirm("将此浏览器的游客进度导入当前账号？\n相同题号以游客记录优先，云端其他题目保留。游客记录也会在本机保留。")) return;
      var current = e.snapshot();
      var old = jsonGet(e.legacyKey, e.empty());
      e.apply(e.merge(current, old));
      jsonSet(cacheKey(e), e.snapshot());
      try { localStorage.setItem(cacheKey(e) + ".guestImported", "1"); } catch (_) {}
      changed(e.section);
      show("正在合并游客记录并同步……");
    });
    var useCloud = root.querySelector("#dm2UseCloud");
    if (useCloud) useCloud.addEventListener("click", function () {
      if (!window.confirm("放弃本机尚未同步的修改，加载云端版本？游客记录仍然保留。")) return;
      e.apply(e.conflict.state);
      e.revision = e.conflict.revision;
      e.conflict = null;
      e.warning = "";
      jsonSet(cacheKey(e), e.snapshot());
      localStorage.removeItem(dirtyKey(e));
      show("已加载云端版本");
    });
    var keepLocal = root.querySelector("#dm2KeepLocal");
    if (keepLocal) keepLocal.addEventListener("click", function () {
      if (!window.confirm("确认使用本机修改覆盖云端此部分进度？其他设备较新的修改可能被取代。")) return;
      e.revision = e.conflict.revision;
      e.conflict = null;
      e.warning = "";
      changed(e.section);
      show("正在尝试保存本机版本……");
    });
    root.querySelector("#dm2Logout").addEventListener("click", async function () {
      try {
        if (e && e.loaded && !e.conflict) await flush(e, true);
        if (e && (e.conflict || localStorage.getItem(dirtyKey(e)))) {
          if (!window.confirm("仍有未同步修改。退出后本机账号缓存会保留，但其他设备暂时看不到这些修改。仍要退出吗？")) return;
        }
        var result = await client.auth.signOut({ scope: "local" });
        if (result.error) throw result.error;
        await setUser(null);
      } catch (err) { accountError = "退出失败：" + err.message; render(); }
    });
  }

  function register(hooks) {
    if (!hooks || !hooks.section || !hooks.legacyKey) throw new Error("Missing cloud section configuration");
    sections.set(hooks.section, Object.assign({
      revision: null, conflict: null, loaded: false, sending: false, timer: null,
      warning: "", dirty: false
    }, hooks));
    render();
    if (enabled) {
      if (client && user) {
        loadSection(sections.get(hooks.section)).then(render).catch(function (err) {
          var entry = sections.get(hooks.section);
          if (entry) entry.warning = "加载账号进度失败：" + err.message;
          render();
        });
      } else {
        boot();
      }
    }
  }

  async function loadSection(e) {
    e.loaded = false;
    e.conflict = null;
    e.warning = "";
    if (e.timer) { clearTimeout(e.timer); e.timer = null; }
    e.queuedWhileSending = false;
    if (!user) {
      e.sending = false;
      e.revision = null;
      e.apply(jsonGet(e.legacyKey, e.empty()));
      e.loaded = true;
      render();
      return;
    }
    var cached = jsonGet(cacheKey(e), null);
    var pending = localStorage.getItem(dirtyKey(e)) === "1";
    var remote = null;
    try {
      var res = await client.from("dm2_progress").select("state,revision")
        .eq("user_id", user.id).eq("section", e.section).maybeSingle();
      if (res.error) throw res.error;
      remote = res.data;
    } catch (err) {
      e.loaded = true;
      e.warning = "云端读取失败，当前仅本机可用：" + err.message;
      if (cached) e.apply(cached);
      else e.apply(e.empty());
      render();
      return;
    }
    e.revision = remote ? remote.revision : null;
    if (pending && cached) {
      e.apply(cached);
      if (remote && JSON.stringify(cached) !== JSON.stringify(remote.state)) {
        e.conflict = { state: remote.state, revision: remote.revision };
        e.warning = "检测到尚未同步的本机记录与云端版本不同，请手动选择版本";
      } else if (!remote) {
        e.warning = "本机记录仍未上传，正在补充同步";
      } else {
        localStorage.removeItem(dirtyKey(e));
        e.warning = "已恢复之前保存的本机记录";
      }
    } else if (remote) {
      e.apply(remote.state);
      jsonSet(cacheKey(e), e.snapshot());
      localStorage.removeItem(dirtyKey(e));
      e.warning = "云端进度已加载";
    } else {
      e.apply(cached || e.empty());
      e.warning = "账号暂无云端记录；可导入本机游客进度";
    }
    e.loaded = true;
    render();
    if (pending && !e.conflict) schedule(e, 100);
  }

  async function setUser(next) {
    var old = user && user.id;
    var newId = next && next.id;
    if (old === newId) return;
    user = next;
    status = user ? "正在加载账号进度……" : "已退出，恢复本机游客进度";
    for (var e of sections.values()) await loadSection(e);
    render();
  }

  async function boot() {
    if (bootPromise) return bootPromise;
    bootPromise = (async function () {
      try {
        if (!window.supabase || !window.supabase.createClient) {
          var cdnUrls = [
            "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2",
            "https://unpkg.com/@supabase/supabase-js@2/dist/umd/supabase.js"
          ];
          var lastCdnError = null;
          for (var cdnUrl of cdnUrls) {
            try {
              await new Promise(function (resolve, reject) {
                var script = document.createElement("script");
                script.src = cdnUrl;
                script.onload = resolve;
                script.onerror = function () { reject(new Error("无法加载 " + cdnUrl)); };
                document.head.appendChild(script);
              });
              if (window.supabase && window.supabase.createClient) break;
            } catch (cdnError) { lastCdnError = cdnError; }
          }
          if (!window.supabase || !window.supabase.createClient) {
            throw lastCdnError || new Error("Supabase JS 加载失败，请检查网络");
          }
        }
        client = window.supabase.createClient(cfg.url, cfg.publishableKey);
        render();
        var auth = await client.auth.getUser();
        if (auth.error && auth.error.name !== "AuthSessionMissingError" && auth.error.code !== "session_not_found") throw auth.error;
        await setUser(auth.data && auth.data.user ? auth.data.user : null);
        client.auth.onAuthStateChange(function (event) {
          if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_DELETED") {
            setTimeout(async function () {
              try {
                var check = await client.auth.getUser();
                if (check.error) { await setUser(null); return; }
                await setUser(check.data.user);
              } catch (err) { accountError = err.message; render(); }
            }, 0);
          }
        });
        render();
      } catch (err) {
        accountError = "登录服务不可用：" + err.message + "。题库仍在本机保存进度。";
        render();
      }
    })();
    return bootPromise;
  }

  function changed(section) {
    var e = sections.get(section);
    if (!e || !user) return;
    jsonSet(cacheKey(e), e.snapshot());
    if(e.sending) e.queuedWhileSending = true;
    try { localStorage.setItem(dirtyKey(e), "1"); }
    catch (_) { e.warning = "本机存储不可写，进度可能丢失"; }
    if (e.loaded) schedule(e, 900);
    render();
  }
  function schedule(e, delay) {
    if (e.timer) clearTimeout(e.timer);
    e.timer = setTimeout(function () { flush(e, false); }, delay);
  }
  async function flush(e, manual) {
    if (!user || !e || !e.loaded) return;
    if (e.sending) {
      if (manual) e.warning = "正在同步，请稍后再试";
      render();
      return;
    }
    if (e.conflict) { e.warning = "存在云端与本机版本冲突，请先选择保留哪一版"; render(); return; }
    var pending = localStorage.getItem(dirtyKey(e));
    if (pending !== "1") { e.warning = "进度已经是最新版本"; render(); return; }
    var identity = user.id;
    var snapshot = e.snapshot();
    var serialized = JSON.stringify(snapshot);
    e.sending = true;
    e.warning = "正在同步至云端……";
    render();
    try {
      var table = client.from("dm2_progress");
      var row;
      if (e.revision === null) {
        var created = await table.insert({
          user_id: identity, section: e.section, state: snapshot
        }).select("revision").single();
        if (created.error) throw created.error;
        row = created.data;
      } else {
        var updated = await table.update({
          state: snapshot, revision: Number(e.revision) + 1
        }).eq("user_id", identity).eq("section", e.section)
          .eq("revision", e.revision).select("revision").maybeSingle();
        if (updated.error) throw updated.error;
        row = updated.data;
      }
      if (!user || user.id !== identity) return;
      if (!row) throw new Error("VERSION_CONFLICT");
      e.revision = row.revision;
      if (JSON.stringify(e.snapshot()) === serialized) {
        localStorage.removeItem(dirtyKey(e));
        e.warning = "已安全同步到云端";
      } else {
        e.warning = "新修改正在继续同步";
        schedule(e, 250);
      }
    } catch (err) {
      if (user && user.id === identity) {
        if (err.message === "VERSION_CONFLICT" || err.code === "23505") {
          try {
            var latest = await client.from("dm2_progress").select("state,revision")
              .eq("user_id", identity).eq("section", e.section).maybeSingle();
            if (latest.error) throw latest.error;
            if (latest.data) {
              e.conflict = { state: latest.data.state, revision: latest.data.revision };
              e.warning = "另一设备已更新云端，请选择保留云端或本机版本";
            } else {
              e.revision = null;
              e.warning = "云端记录已变动，稍后可重新同步";
            }
          } catch (readErr) { e.warning = "检测到版本冲突，但暂时无法读取云端：" + readErr.message; }
        } else {
          e.warning = "同步失败，本机记录已保留：" + err.message;
        }
      }
    } finally {
      e.sending = false;
      if (e.queuedWhileSending && user && user.id === identity && !e.conflict) {
        e.queuedWhileSending = false;
        schedule(e, 350);
      }
      render();
    }
  }

  window.addEventListener("online", function () {
    for (var e of sections.values()) {
      if (user && e.loaded && !e.conflict && localStorage.getItem(dirtyKey(e)) === "1") {
        schedule(e, 500);
      }
    }
  });

  window.DM2Cloud = {
    register: register,
    storageKey: localKey,
    changed: changed,
    configured: enabled,
    getUser: function () { return user; }
  };

  // Render the account panel as soon as this script loads. It must not depend
  // on the homework question bundle finishing its asynchronous decompression.
  if (enabled) boot();
  else render();
})();
