/* =========================================================
   家庭点菜 · 部署配置
   ---------------------------------------------------------
   1) 部署在 WorkBuddy 发布域名（默认）：下面两项留空即可，
      程序会自动使用内置云服务。
   2) 部署到 GitHub Pages / 其它任意域名：云数据库接口有来源
      域名限制，必须接入自己的 Supabase 项目（免费）：
        · 打开 https://supabase.com 新建项目（免费档即可）
        · 左侧 SQL Editor 粘贴执行 supabase-setup.sql
        · Settings → API 里复制 Project URL 和 anon public key
      填到下面两行后保存，重新推送即可。
   ========================================================= */
window.APP_CONFIG = {
  supabaseUrl: 'https://ynqltewxnybwxbzfcjls.supabase.co',   // 例：https://abcdefgh.supabase.co （结尾不要带斜杠）
  supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlucWx0ZXd4bnlid3hiemZjamxzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4MTc1MDIsImV4cCI6MjEwNTM5MzUwMn0.n5xK_Amvjp21xbXhpTPofun8nKqIs8g_BGAT-95FdOA',   // 例：eyJhbGciOi...（anon public key，可公开）
};
