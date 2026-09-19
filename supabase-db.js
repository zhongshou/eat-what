/* =========================================================
   Supabase / PostgREST 适配层
   ---------------------------------------------------------
   把 Supabase 的 REST 接口包装成与 WorkBuddy 云数据库一致的
   链式写法（from/select/order/eq/in/insert/update/upsert/delete），
   返回 { data, error }，业务代码无需改动即可切换后端。
   仅依赖浏览器原生 fetch，无需引入 supabase-js。
   ========================================================= */
(function (global) {
  function encodeVal(v) {
    if (v === null || v === undefined) return 'null';
    if (typeof v === 'boolean') return v ? 'true' : 'false';
    if (typeof v === 'number') return String(v);
    return encodeURIComponent(String(v));
  }

  function createSupabaseDb(baseUrl, apiKey) {
    const root = baseUrl.replace(/\/+$/, '') + '/rest/v1';

    async function exec(q) {
      const qs = q.params.slice();
      if (q.orders.length) qs.push('order=' + q.orders.join(','));
      const url = root + '/' + q.table + (qs.length ? '?' + qs.join('&') : '');
      const headers = {
        apikey: apiKey,
        Authorization: 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
      };
      if (q.prefer.length) headers.Prefer = q.prefer.join(',');
      try {
        const res = await fetch(url, {
          method: q.method,
          headers,
          body: q.body === null ? undefined : JSON.stringify(q.body),
        });
        if (!res.ok) {
          let msg = 'HTTP ' + res.status;
          try {
            const j = await res.json();
            msg = j.message || j.error_description || j.error || (j.details ? String(j.details) : msg);
          } catch (e) { /* 非 JSON 响应沿用状态码提示 */ }
          return { data: null, error: new Error(msg) };
        }
        if (res.status === 204) return { data: null, error: null };
        const text = await res.text();
        return { data: text ? JSON.parse(text) : null, error: null };
      } catch (e) {
        return { data: null, error: e instanceof Error ? e : new Error(String(e)) };
      }
    }

    function from(table) {
      const q = { table, method: 'GET', body: null, params: [], orders: [], prefer: [] };
      const api = {
        select(cols) { q.params.push('select=' + (cols || '*')); return api; },
        order(col, opts) {
          const dir = opts && opts.ascending === false ? 'desc' : 'asc';
          q.orders.push(col + '.' + dir);
          return api;
        },
        eq(col, val) { q.params.push(col + '=eq.' + encodeVal(val)); return api; },
        in(col, arr) { q.params.push(col + '=in.(' + arr.map(encodeVal).join(',') + ')'); return api; },
        insert(payload) { q.method = 'POST'; q.body = payload; q.prefer.push('return=representation'); return api; },
        update(payload) { q.method = 'PATCH'; q.body = payload; q.prefer.push('return=representation'); return api; },
        upsert(payload, opts) {
          q.method = 'POST'; q.body = payload;
          q.prefer.push('return=representation');
          q.prefer.push('resolution=merge-duplicates');
          q.params.push('on_conflict=' + ((opts && opts.onConflict) || 'key'));
          return api;
        },
        delete() { q.method = 'DELETE'; q.prefer.push('return=representation'); return api; },
        then(onOk, onErr) { return exec(q).then(onOk, onErr); },
        catch(onErr) { return exec(q).catch(onErr); },
        finally(fn) { return exec(q).finally(fn); },
      };
      return api;
    }

    return { from };
  }

  global.createSupabaseDb = createSupabaseDb;
})(window);
