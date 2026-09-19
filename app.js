/* =========================================================
   家庭点菜 · H5 单页应用
   云服务：WorkBuddy Cloud（数据库 + 匿名可信访问，家庭小范围使用）
   ========================================================= */

/* ---------- 公共配置（来自云服务 publicConfig） ---------- */
const publicConfig = {
  endpoint: 'https://family-menu-77318.app.workbuddy.host',
  publishableKey: 'wbpk_KsPkQGh60e87DmgU2APT6I_e9S7rcMb3r7RGSZMMgwHYMjMTQvKVM24',
};

const cloud = WorkBuddyCloud.createWorkBuddyCloud({
  endpoint: publicConfig.endpoint,
  publishableKey: publicConfig.publishableKey,
});
const db = cloud.database;

/* ---------- 常量 ---------- */
const RELATIONS = ['管理员', '家人', '朋友', '其他'];
const QUICK_NOTES = ['不吃香菜', '不吃葱花', '不吃葱', '不吃姜', '不吃蒜', '少辣', '不辣'];
/* 15 色低饱和马卡龙色卡 */
const MACARON_COLORS = ['#FDE8E7','#FBE9DD','#FBF3D9','#F6E7D8','#E8F1DC','#DFF0E5','#E3EFEA','#DEEDF4','#E4E6F7','#EAE4F1','#EFE4F3','#F7E4EE','#F0EBE3','#E7EDDE','#FBE1E1'];
const WEEK = ['日', '一', '二', '三', '四', '五', '六'];

/* =========================================================
   卡通简笔画图标库（粗线条风格）
   ========================================================= */
const _S = 'stroke="#3d4a35" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"';
const UI_ICONS = {
  home: `<path d="M9 23 L24 9 L39 23" fill="#FCE3C8" ${_S}/><rect x="13" y="22" width="22" height="17" rx="3.5" fill="#fff" ${_S}/><rect x="20.5" y="28" width="7" height="11" rx="2.5" fill="#F2A24C" ${_S}/>`,
  order: `<rect x="11" y="9" width="26" height="32" rx="5" fill="#E7F0DC" ${_S}/><rect x="18" y="5" width="12" height="8" rx="3" fill="#fff" ${_S}/><path d="M17 21.5h14M17 28h14M17 34.5h8" fill="none" ${_S}/>`,
  cart: `<path d="M7 9h5.5l4.8 19.5H34l4-13.5H15.5" fill="#FCE3C8" ${_S}/><circle cx="20" cy="37" r="3.4" fill="#fff" ${_S}/><circle cx="33" cy="37" r="3.4" fill="#fff" ${_S}/>`,
  me: `<circle cx="24" cy="24" r="16.5" fill="#E7F0DC" ${_S}/><circle cx="18.7" cy="21" r="2.5" fill="#3d4a35"/><circle cx="29.3" cy="21" r="2.5" fill="#3d4a35"/><path d="M18 28.5q6 5 12 0" fill="none" ${_S}/>`,
  heart: `<path d="M24 40C11 31 7.5 21.5 14 16c4.2-3.4 8.2-1.2 10 2.8 1.8-4 5.8-6.2 10-2.8 6.5 5.5 3 15-10 24z" fill="#F9C8C8" ${_S}/>`,
  heartFill: `<path d="M24 40C11 31 7.5 21.5 14 16c4.2-3.4 8.2-1.2 10 2.8 1.8-4 5.8-6.2 10-2.8 6.5 5.5 3 15-10 24z" fill="#F26D6D" ${_S}/>`,
  book: `<path d="M24 12c-4-3-9.5-4-15-3v26c5.5-1 11 0 15 3 4-3 9.5-4 15-3V9c-5.5-1-11 0-15 3z" fill="#FFF6E3" ${_S}/><path d="M24 12v26" fill="none" ${_S}/><path d="M13 15c3-.3 6 0 8 1M13 21c3-.3 6 0 8 1M27 16c2-1 5-1.3 8-1M27 22c2-1 5-1.3 8-1" fill="none" stroke="#c9b98a" stroke-width="2" stroke-linecap="round"/>`,
  note: `<rect x="9" y="8" width="30" height="34" rx="5" fill="#FFF3D6" ${_S}/><path d="M30 14l4.5 4.5L23 30l-5.5 1.2L18.7 25.7z" fill="#fff" ${_S}/>`,
  chart: `<path d="M8.5 40.5h31" fill="none" ${_S}/><rect x="12" y="24" width="7.5" height="13" rx="2.5" fill="#A8C98A" ${_S}/><rect x="22.5" y="15.5" width="7.5" height="21.5" rx="2.5" fill="#F2A24C" ${_S}/><rect x="33" y="28" width="7.5" height="9" rx="2.5" fill="#F9C8C8" ${_S}/>`,
  calendar: `<rect x="8" y="11" width="32" height="29" rx="5" fill="#fff" ${_S}/><path d="M8 19.5h32" fill="none" ${_S}/><rect x="14" y="6" width="5.5" height="9" rx="2.5" fill="#F2A24C" ${_S}/><rect x="28.5" y="6" width="5.5" height="9" rx="2.5" fill="#F2A24C" ${_S}/><circle cx="16.5" cy="27" r="2.4" fill="#A8C98A"/><circle cx="24" cy="27" r="2.4" fill="#A8C98A"/><circle cx="31.5" cy="27" r="2.4" fill="#F26D6D"/><circle cx="16.5" cy="33.5" r="2.4" fill="#F9C8C8"/><circle cx="24" cy="33.5" r="2.4" fill="#8FB8E8"/>`,
  clock: `<circle cx="24" cy="26" r="15" fill="#E3F0F7" ${_S}/><path d="M24 17.5V26l6 4" fill="none" ${_S}/><path d="M16 7.5l-5 4M32 7.5l5 4" fill="none" ${_S}/>`,
  users: `<circle cx="17" cy="17.5" r="7" fill="#FCE3C8" ${_S}/><path d="M6.5 38.5c0-6.5 5-9.5 10.5-9.5s10.5 3 10.5 9.5" fill="#fff" ${_S}/><circle cx="33.5" cy="19.5" r="6" fill="#F9C8C8" ${_S}/><path d="M28.5 38.5c.8-5 4-7.5 7.5-7.5 4.8 0 7.5 3 7.5 7.5" fill="#E7F0DC" ${_S}/>`,
  tool: `<path d="M10 14.5h28M10 24h28M10 33.5h28" fill="none" ${_S}/><circle cx="19" cy="14.5" r="4.6" fill="#F2A24C" ${_S}/><circle cx="30.5" cy="24" r="4.6" fill="#A8C98A" ${_S}/><circle cx="22" cy="33.5" r="4.6" fill="#F9C8C8" ${_S}/>`,
  key: `<circle cx="15.5" cy="24" r="8.5" fill="#FFF3D6" ${_S}/><path d="M24 24h16.5M33.5 24v6.5M40.5 24v5" fill="none" ${_S}/>`,
  lock: `<rect x="11" y="21" width="26" height="19.5" rx="5.5" fill="#FCE3C8" ${_S}/><path d="M17 21v-5.5a7 7 0 0 1 13.2-3.2" fill="none" ${_S}/><circle cx="24" cy="30.5" r="2.7" fill="#3d4a35"/><path d="M24 33v3.5" stroke="#3d4a35" stroke-width="2.6" stroke-linecap="round"/>`,
  link: `<path d="M21 27l6-6" fill="none" ${_S}/><path d="M23 15.5l4-4a7.2 7.2 0 0 1 10.2 10.2l-4 4" fill="none" ${_S}/><path d="M25 32.5l-4 4A7.2 7.2 0 0 1 10.8 26.3l4-4" fill="none" ${_S}/>`,
  dice: `<rect x="9" y="9" width="30" height="30" rx="7.5" fill="#fff" ${_S}/><circle cx="17.5" cy="17.5" r="2.7" fill="#F26D6D"/><circle cx="30.5" cy="17.5" r="2.7" fill="#3d4a35"/><circle cx="24" cy="24" r="2.7" fill="#F2A24C"/><circle cx="17.5" cy="30.5" r="2.7" fill="#3d4a35"/><circle cx="30.5" cy="30.5" r="2.7" fill="#A8C98A"/>`,
  palette: `<path d="M24 6.5c10 0 18 7 18 15.5 0 5.5-4.8 7.5-8.8 7.5h-2.7c-3 0-4.3 2.2-3.2 4.4 1.4 2.8-.6 6.1-4.8 6.1C12.5 40 6 33 6 24 6 13.5 14 6.5 24 6.5z" fill="#F7E4EE" ${_S}/><circle cx="16" cy="17.5" r="3" fill="#F26D6D"/><circle cx="26" cy="13.5" r="3" fill="#F2A24C"/><circle cx="34" cy="19.5" r="3" fill="#A8C98A"/><circle cx="13" cy="27" r="3" fill="#8FB8E8"/>`,
  camera: `<rect x="6" y="14" width="36" height="26" rx="6" fill="#E7F0DC" ${_S}/><path d="M17 14l3-5.5h8l3 5.5" fill="#CBD8EA" ${_S}/><circle cx="24" cy="27" r="8" fill="#fff" ${_S}/><circle cx="24" cy="27" r="4" fill="#8FB8E8"/>`,
  edit: `<path d="M10 38l2-8L31.5 10.5a4.2 4.2 0 0 1 6 6L18 36l-8 2z" fill="#FFF3D6" ${_S}/><path d="M28.5 13.5l6 6" fill="none" ${_S}/>`,
  plus: `<circle cx="24" cy="24" r="17" fill="#E7F0DC" ${_S}/><path d="M24 16v16M16 24h16" fill="none" ${_S}/>`,
  pan: `<path d="M15.5 12.5q2-3 0-6M22.5 12.5q2-3 0-6" fill="none" stroke="#3d4a35" stroke-width="2.8" stroke-linecap="round"/><ellipse cx="21.5" cy="28.5" rx="16" ry="9.5" fill="#6E7686" ${_S}/><ellipse cx="21.5" cy="26.5" rx="12" ry="6.5" fill="#595f6e"/><circle cx="21.5" cy="26.5" r="4.3" fill="#FFCF48" stroke="#3d4a35" stroke-width="2.4"/><path d="M37 26.5l7.5 2.5" fill="none" ${_S}/>`,
  chef: `<path d="M14 24.5a7.5 7.5 0 0 1 2.5-14.5 9.5 9.5 0 0 1 15 0A7.5 7.5 0 0 1 34 24.5V32H14z" fill="#fff" ${_S}/><rect x="14" y="32" width="20" height="7.5" rx="2.5" fill="#FCE3C8" ${_S}/>`,
  carrot: `<path d="M29.5 18.5L13.5 34.5c-2 2-5-1-3.2-3.2l16-16c2.2-1.8 5.2 1.2 3.2 3.2z" fill="#F2A24C" ${_S}/><path d="M31 15.5c.5-5 3.8-8 8.8-7.8-.8 5-3.8 7.6-8.8 7.8z" fill="#A8C98A" ${_S}/><path d="M32.5 18l6 3M29 14.5l-1.5-6" fill="none" ${_S}/>`,
  plate: `<circle cx="24" cy="24" r="17" fill="#fff" ${_S}/><circle cx="24" cy="24" r="10" fill="#EAF3F7" ${_S}/>`,
  paw: `<ellipse cx="24" cy="30.5" rx="10" ry="8" fill="#FCE3C8" ${_S}/><circle cx="12.5" cy="22.5" r="3.7" fill="#FCE3C8" ${_S}/><circle cx="20.5" cy="15.5" r="3.7" fill="#FCE3C8" ${_S}/><circle cx="29.5" cy="15.5" r="3.7" fill="#FCE3C8" ${_S}/><circle cx="37" cy="22.5" r="3.7" fill="#FCE3C8" ${_S}/>`,
  trash: `<path d="M11 13.5h26" fill="none" ${_S}/><path d="M18 13.5V9.5h12v4" fill="none" ${_S}/><rect x="13.5" y="13.5" width="21" height="26" rx="4.5" fill="#FDE8E7" ${_S}/><path d="M20 20.5v12M28 20.5v12" fill="none" stroke="#e76f51" stroke-width="2.8" stroke-linecap="round"/>`,
  check: `<circle cx="24" cy="24" r="17" fill="#DFF0E5" ${_S}/><path d="M15.5 24.5l6 6L33.5 18" fill="none" ${_S}/>`,
};
function ico(name, size = 20, cls = '') {
  return `<svg class="ico-svg ${cls}" width="${size}" height="${size}" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${UI_ICONS[name] || UI_ICONS.plate}</svg>`;
}

/* 分类图标（简笔画食物） */
const CAT_ICONS = {
  rice: `<path d="M13.5 22.5c-1.2-6 4-11 10.5-11s11.7 5 10.5 11" fill="#fff" ${_S}/><circle cx="20" cy="17" r="1.5" fill="#3d4a35"/><circle cx="25.5" cy="14.5" r="1.5" fill="#3d4a35"/><circle cx="30" cy="18" r="1.5" fill="#3d4a35"/><path d="M10 23.5h28l-2.8 9.5a5.5 5.5 0 0 1-5.3 4H18.1a5.5 5.5 0 0 1-5.3-4z" fill="#E8836B" ${_S}/>`,
  noodle: `<path d="M10 22h28l-2.2 9a6.5 6.5 0 0 1-6.4 5H18.6a6.5 6.5 0 0 1-6.4-5z" fill="#E8836B" ${_S}/><path d="M17.5 22v-7M21.8 22v-10M26.2 22v-10M30.5 22v-7" fill="none" stroke="#3d4a35" stroke-width="2.6" stroke-linecap="round"/><path d="M29 5L40 15M34.5 3.5L42 17" fill="none" ${_S}/>`,
  hotpot: `<path d="M16.5 10.5q2-3 0-6.5M24 10.5q2-3 0-6.5M31.5 10.5q2-3 0-6.5" fill="none" stroke="#3d4a35" stroke-width="2.8" stroke-linecap="round"/><rect x="8" y="14.5" width="32" height="8.5" rx="3" fill="#E8836B" ${_S}/><path d="M12 23h24l-2 8.5a5.5 5.5 0 0 1-5.4 4.5H19.4A5.5 5.5 0 0 1 14 31.5z" fill="#F2A24C" ${_S}/><rect x="20" y="9" width="8" height="5.5" rx="2" fill="#CBD8EA" ${_S}/>`,
  soup: `<path d="M17.5 13q2-3 0-6.5M25 13q2-3 0-6.5" fill="none" stroke="#3d4a35" stroke-width="2.8" stroke-linecap="round"/><path d="M9 24.5h30l-2 8a7.5 7.5 0 0 1-7.4 6H18.4a7.5 7.5 0 0 1-7.4-6z" fill="#E8836B" ${_S}/><path d="M13.5 24.5c0-2.8 4.7-4.5 10.5-4.5s10.5 1.7 10.5 4.5" fill="#FFE3B3" ${_S}/><ellipse cx="38.5" cy="11" rx="4" ry="5" fill="#fff" ${_S}/><path d="M38.5 16l3.5 8.5" fill="none" ${_S}/>`,
  salad: `<path d="M9 26.5h30c0 7-6.3 12-15 12s-15-5-15-12z" fill="#E7F0DC" ${_S}/><path d="M23 25.5c-7.5.5-11.5-3.5-11.5-9.5 6-.5 11.5 3 11.5 9.5z" fill="#A8C98A" ${_S}/><path d="M25 25.5c7.5.5 11.5-3.5 11.5-9.5-6-.5-11.5 3-11.5 9.5z" fill="#8FBF6F" ${_S}/><circle cx="17.5" cy="23.5" r="3" fill="#F26D6D" ${_S}/>`,
  dumpling: `<path d="M8.5 29.5c0-8 7-14 15.5-14s15.5 6 15.5 14c0 3-3 5.5-7 5.5H15.5c-4 0-7-2.5-7-5.5z" fill="#FFF3D6" ${_S}/><path d="M20 17.5l-1 6.5M24 16.5v7.5M28 17.5l1 6.5" fill="none" stroke="#3d4a35" stroke-width="2.6" stroke-linecap="round"/>`,
  sushi: `<circle cx="16" cy="28" r="9" fill="#8FBF6F" ${_S}/><circle cx="16" cy="28" r="4.5" fill="#fff" ${_S}/><circle cx="16" cy="28" r="1.8" fill="#F2A24C"/><circle cx="33" cy="28" r="9" fill="#F26D6D" ${_S}/><circle cx="33" cy="28" r="4.5" fill="#fff" ${_S}/><circle cx="33" cy="28" r="1.8" fill="#F2A24C"/>`,
  cake: `<path d="M10.5 27.5h27V36a4.5 4.5 0 0 1-4.5 4.5H15a4.5 4.5 0 0 1-4.5-4.5z" fill="#F9C8C8" ${_S}/><path d="M12.5 27.5c0-5.5 5-9.5 11.5-9.5s11.5 4 11.5 9.5" fill="#fff" ${_S}/><path d="M24 17.5V13" fill="none" ${_S}/><path d="M24 6.5c2.2 2 2.2 4.5 0 5.5-2.2-1-2.2-3.5 0-5.5z" fill="#F2A24C" ${_S}/>`,
  drink: `<path d="M22.5 11.5L26.5 3" fill="none" ${_S}/><rect x="14" y="11.5" width="20" height="28.5" rx="5" fill="#EAF3F7" ${_S}/><path d="M14 22h20v13a5 5 0 0 1-5 5H19a5 5 0 0 1-5-5z" fill="#F6D8B8" ${_S}/><circle cx="20.5" cy="35.5" r="2.2" fill="#6b4a2f"/><circle cx="27.5" cy="35.5" r="2.2" fill="#6b4a2f"/>`,
  fruit: `<circle cx="24" cy="27" r="13.5" fill="#F2A24C" ${_S}/><path d="M24 13.5c1-4.5 5-6.5 8.5-5.5-1 4.5-4.5 6.5-8.5 5.5z" fill="#A8C98A" ${_S}/><path d="M24 13.5V9.5" fill="none" ${_S}/>`,
  fish: `<path d="M7.5 24c5-8 13-12.5 21-12.5 6 0 10 5.5 11 12.5-1 7-5 12.5-11 12.5-8 0-16-4.5-21-12.5z" fill="#8FB8E8" ${_S}/><path d="M39.5 24l7-6.5v13z" fill="#8FB8E8" ${_S}/><circle cx="16" cy="21.5" r="2" fill="#3d4a35"/><path d="M25 20.5q3 3.5 0 7" fill="none" stroke="#3d4a35" stroke-width="2.4" stroke-linecap="round"/>`,
  meat: `<path d="M18.5 8.5c8-4 17.5 0 19.5 8 1.8 7-3 13.8-10 14.8-7.8 1-13.8-4-14.8-10.8-.8-4.8 1.3-9.4 5.3-12z" fill="#F2A24C" ${_S}/><path d="M20 29.5l-7.5 7.5" fill="none" stroke="#3d4a35" stroke-width="3.8" stroke-linecap="round"/><circle cx="11" cy="38.5" r="3" fill="#fff" ${_S}/><circle cx="14.5" cy="35" r="3" fill="#fff" ${_S}/>`,
  egg: `<path d="M14.5 12c6-4 15.5-5 20.5 1 4 5 3 13-2 18s-13.5 6-19.5 1-5-16 1-20z" fill="#fff" ${_S}/><circle cx="26" cy="22" r="6.5" fill="#FFCF48" ${_S}/>`,
  bread: `<path d="M9.5 22c0-6 6.5-10 14.5-10s14.5 4 14.5 10c0 3-1.8 5-3.8 5.2V35a4.5 4.5 0 0 1-4.5 4.5H17.8a4.5 4.5 0 0 1-4.5-4.5v-7.8c-2-.2-3.8-2.2-3.8-5.2z" fill="#F6D8B8" ${_S}/><path d="M18 21c2 2.2 4 2.2 6 0s4-2.2 6 0" fill="none" stroke="#3d4a35" stroke-width="2.6" stroke-linecap="round"/>`,
  snack: `<path d="M24 44V6" fill="none" stroke="#3d4a35" stroke-width="3" stroke-linecap="round"/><circle cx="24" cy="12" r="6.3" fill="#fff" ${_S}/><circle cx="24" cy="25" r="6.3" fill="#F9C8C8" ${_S}/><circle cx="24" cy="37.5" r="6.3" fill="#A8C98A" ${_S}/>`,
  tea: `<path d="M12 19.5h20v10.5a8.5 8.5 0 0 1-8.5 8.5h-3a8.5 8.5 0 0 1-8.5-8.5z" fill="#A8C98A" ${_S}/><path d="M32 22l6.5-4.5v11l-6.5-2" fill="#A8C98A" ${_S}/><rect x="18" y="13.5" width="8" height="6" rx="2.5" fill="#A8C98A" ${_S}/><circle cx="17" cy="25" r="1.5" fill="#3d4a35"/>`,
  pan: `<path d="M15.5 12.5q2-3 0-6M22.5 12.5q2-3 0-6" fill="none" stroke="#3d4a35" stroke-width="2.8" stroke-linecap="round"/><ellipse cx="21.5" cy="28.5" rx="16" ry="9.5" fill="#6E7686" ${_S}/><ellipse cx="21.5" cy="26.5" rx="12" ry="6.5" fill="#595f6e"/><circle cx="21.5" cy="26.5" r="4.3" fill="#FFCF48" stroke="#3d4a35" stroke-width="2.4"/><path d="M37 26.5l7.5 2.5" fill="none" ${_S}/>`,
  plate: `<circle cx="24" cy="24" r="17" fill="#fff" ${_S}/><circle cx="24" cy="24" r="10" fill="#EAF3F7" ${_S}/>`,
};
function catIconInner(icon, size = 26) {
  if (icon && icon.startsWith('data:')) return `<img src="${icon}" alt="" style="width:100%;height:100%;object-fit:contain">`;
  if (icon && icon.startsWith('i:')) return `<svg width="${size}" height="${size}" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${CAT_ICONS[icon.slice(2)] || CAT_ICONS.plate}</svg>`;
  return esc(icon || '🍽️');
}

/* 默认卡通头像库（方脸小动物 · 简笔画风） */
const _a = (inner) => `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${inner}</svg>`;
const _face = (fill, y = 16) => `<rect x="8" y="${y}" width="48" height="${62 - y}" rx="13" fill="${fill}" stroke="#35302b" stroke-width="3.4"/>`;
const _eyes = (dy = 0) => `<circle cx="24" cy="${35 + dy}" r="2.6" fill="#35302b"/><circle cx="40" cy="${35 + dy}" r="2.6" fill="#35302b"/>`;
const _blush = (dy = 0) => `<circle cx="17.5" cy="${42 + dy}" r="3.2" fill="#F6ACAC" opacity=".8"/><circle cx="46.5" cy="${42 + dy}" r="3.2" fill="#F6ACAC" opacity=".8"/>`;
const _smile = (d) => `<path d="${d || 'M29 41q3 3.5 6 0'}" fill="none" stroke="#35302b" stroke-width="2.4" stroke-linecap="round"/>`;
const _st = 'stroke="#35302b" stroke-linecap="round" stroke-linejoin="round"';
const AVATAR_SVGS = {
  giraffe: _a(`<path d="M23 15l-2.5-7.5M41 15l2.5-7.5" fill="none" ${_st} stroke-width="3"/><circle cx="20" cy="6" r="3" fill="#8a5a33" ${_st} stroke-width="2.4"/><circle cx="44" cy="6" r="3" fill="#8a5a33" ${_st} stroke-width="2.4"/>` + _face('#F5C86B') + `<ellipse cx="16.5" cy="26" rx="4.5" ry="4" fill="#C98A3E"/><ellipse cx="48" cy="27" rx="4" ry="4.5" fill="#C98A3E"/><ellipse cx="13.5" cy="45" rx="3.5" ry="4.5" fill="#C98A3E"/>` + _eyes() + _blush() + _smile()),
  crab: _a(`<circle cx="13" cy="10" r="6" fill="#F07B5D" ${_st} stroke-width="3"/><circle cx="51" cy="10" r="6" fill="#F07B5D" ${_st} stroke-width="3"/><circle cx="24" cy="13" r="4.2" fill="#fff" ${_st} stroke-width="2.6"/><circle cx="40" cy="13" r="4.2" fill="#fff" ${_st} stroke-width="2.6"/><circle cx="24" cy="13" r="1.8" fill="#35302b"/><circle cx="40" cy="13" r="1.8" fill="#35302b"/>` + _face('#F07B5D', 18) + _blush(2) + _smile('M28 44q4 3.5 8 0')),
  redpanda: _a(`<circle cx="15" cy="15" r="7" fill="#8a5a33" ${_st} stroke-width="3"/><circle cx="49" cy="15" r="7" fill="#8a5a33" ${_st} stroke-width="3"/>` + _face('#C9804E') + `<ellipse cx="23.5" cy="33" rx="6" ry="7" fill="#fff"/><ellipse cx="40.5" cy="33" rx="6" ry="7" fill="#fff"/><circle cx="24" cy="34" r="2.5" fill="#35302b"/><circle cx="40" cy="34" r="2.5" fill="#35302b"/>` + _blush() + `<ellipse cx="32" cy="44" rx="3" ry="2.2" fill="#35302b"/>` + _smile('M29 48q3 3 6 0')),
  bear: _a(`<circle cx="15.5" cy="14.5" r="7" fill="#C98A5A" ${_st} stroke-width="3"/><circle cx="48.5" cy="14.5" r="7" fill="#C98A5A" ${_st} stroke-width="3"/><circle cx="15.5" cy="14.5" r="3" fill="#E8B98A"/><circle cx="48.5" cy="14.5" r="3" fill="#E8B98A"/>` + _face('#C98A5A') + _eyes() + `<ellipse cx="32" cy="43" rx="9" ry="6.5" fill="#F2D8BC"/><ellipse cx="32" cy="40.5" rx="3" ry="2.3" fill="#35302b"/>` + _smile('M29 45q3 3 6 0') + _blush(-3)),
  shark: _a(`<path d="M26 17c0-8 7-12 13-10.5-1.5 5.5-4.5 9-9 11.5z" fill="#7f88b8" ${_st} stroke-width="3"/>` + _face('#9AA3CE') + `<circle cx="23" cy="31" r="2.6" fill="#35302b"/><circle cx="41" cy="31" r="2.6" fill="#35302b"/><path d="M21 42q11 9 22 0z" fill="#7c3f42" ${_st} stroke-width="2.6"/><path d="M25 43.5l2.5 3 2.5-3 2.5 3 2.5-3 2.5 3 2.5-3" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/>` + _blush(-4)),
  cat: _a(`<path d="M15 23l-2.5-13 12 6.5z" fill="#BFC3CC" ${_st} stroke-width="3"/><path d="M49 23l2.5-13-12 6.5z" fill="#BFC3CC" ${_st} stroke-width="3"/><path d="M16 19l-1-6 5.5 3z" fill="#F6ACAC"/><path d="M48 19l1-6-5.5 3z" fill="#F6ACAC"/>` + _face('#BFC3CC') + `<path d="M20.5 34q3-3 6 0M37.5 34q3-3 6 0" fill="none" ${_st} stroke-width="2.6"/><path d="M28 41.5q2 2.2 4 0q2 2.2 4 0" fill="none" ${_st} stroke-width="2.2"/><path d="M10 37h6M10 42.5h6M48 37h6M48 42.5h6" ${_st} stroke-width="2"/>` + _blush()),
  bee: _a(`<path d="M25 13L20.5 4.5M39 13l4.5-8.5" fill="none" ${_st} stroke-width="2.8"/><circle cx="19.8" cy="4" r="2.5" fill="#35302b"/><circle cx="44.2" cy="4" r="2.5" fill="#35302b"/>` + _face('#F6D859') + _eyes() + `<path d="M12 39q20 7.5 40 0" fill="none" stroke="#35302b" stroke-width="5.5" stroke-linecap="round"/>` + _blush(-4) + _smile('M29 32q3 3 6 0')),
  duck: _a(`<path d="M19 17c0-7.5 5.8-11.5 13-11.5S45 9.5 45 17" fill="#8FB8E8" ${_st} stroke-width="3"/>` + _face('#FDFDFD') + _eyes() + `<ellipse cx="32" cy="42.5" rx="9.5" ry="6" fill="#F2A24C" ${_st} stroke-width="2.8"/><path d="M24 42h16" ${_st} stroke-width="2"/>` + _blush()),
  penguin: _a(`<path d="M18 20c-3-6-1-12 3-14 2 4 2 8 1 12M46 20c3-6 1-12-3-14-2 4-2 8-1 12" fill="#5c6270" ${_st} stroke-width="2.6"/>` + _face('#6E7686') + `<ellipse cx="32" cy="45" rx="13.5" ry="10" fill="#fff"/>` + `<circle cx="24.5" cy="31" r="2.6" fill="#35302b"/><circle cx="39.5" cy="31" r="2.6" fill="#35302b"/><path d="M29 36.5l3 4 3-4z" fill="#F2A24C" ${_st} stroke-width="2.2"/>` + _blush(4)),
  frog: _a(`<circle cx="18" cy="16" r="8" fill="#9CCB52" ${_st} stroke-width="3"/><circle cx="46" cy="16" r="8" fill="#9CCB52" ${_st} stroke-width="3"/><circle cx="18" cy="15" r="3" fill="#35302b"/><circle cx="46" cy="15" r="3" fill="#35302b"/>` + _face('#9CCB52', 19) + `<path d="M24 42q8 5.5 16 0" fill="none" ${_st} stroke-width="2.6"/>` + _blush(1)),
  cow: _a(`<ellipse cx="11" cy="20" rx="6" ry="5" fill="#fff" ${_st} stroke-width="2.8"/><ellipse cx="53" cy="20" rx="6" ry="5" fill="#fff" ${_st} stroke-width="2.8"/>` + _face('#FDFDFD') + `<ellipse cx="15.5" cy="28" rx="7" ry="6" fill="#B8BCC4"/><ellipse cx="49" cy="43" rx="6" ry="5.5" fill="#B8BCC4"/>` + _eyes(2) + `<ellipse cx="32" cy="46" rx="12" ry="8" fill="#F6C7C0" ${_st} stroke-width="2.8"/><circle cx="27" cy="45" r="1.8" fill="#35302b"/><circle cx="37" cy="45" r="1.8" fill="#35302b"/>`),
  seal: _a(_face('#FDFDFD') + `<circle cx="24" cy="34" r="2.6" fill="#35302b"/><circle cx="40" cy="34" r="2.6" fill="#35302b"/><ellipse cx="32" cy="41" rx="2.6" ry="2" fill="#35302b"/>` + `<circle cx="22" cy="46" r="1" fill="#8a9a80"/><circle cx="26" cy="47.5" r="1" fill="#8a9a80"/><circle cx="42" cy="46" r="1" fill="#8a9a80"/><circle cx="38" cy="47.5" r="1" fill="#8a9a80"/>` + _blush()),
  dino: _a(`<path d="M16 18l4.5-9.5L25 18zM28.5 16l4.5-9.5L37.5 16z" fill="#7E9B4E" ${_st} stroke-width="2.8"/>` + _face('#A8BF6E', 18) + `<circle cx="24" cy="34" r="2.6" fill="#35302b"/><circle cx="40" cy="34" r="2.6" fill="#35302b"/><path d="M26 42q3 3.5 6 0q3 3.5 6 0" fill="none" ${_st} stroke-width="2.4"/>` + _blush(1)),
  tiger: _a(`<circle cx="15.5" cy="14.5" r="7" fill="#F2A24C" ${_st} stroke-width="3"/><circle cx="48.5" cy="14.5" r="7" fill="#F2A24C" ${_st} stroke-width="3"/>` + _face('#F2A24C') + `<path d="M26 17v5.5M32 16v7M38 17v5.5" fill="none" ${_st} stroke-width="2.6"/><path d="M11 28l5 1.5M53 28l-5 1.5" fill="none" ${_st} stroke-width="2.6"/>` + `<ellipse cx="32" cy="43" rx="9" ry="6.5" fill="#FDF3E4"/><ellipse cx="32" cy="40.5" rx="2.8" ry="2.2" fill="#35302b"/>` + _smile('M29 45q3 3 6 0') + _eyes(-4) + _blush(-6)),
  pig: _a(`<path d="M17 22l-2-9 9 4.5zM47 22l2-9-9 4.5z" fill="#F6C7C0" ${_st} stroke-width="3"/>` + _face('#F6C7C0') + _eyes() + `<ellipse cx="32" cy="42.5" rx="9" ry="6.5" fill="#E89A96" ${_st} stroke-width="2.8"/><circle cx="28.5" cy="42.5" r="1.7" fill="#35302b"/><circle cx="35.5" cy="42.5" r="1.7" fill="#35302b"/>` + _blush()),
  whale: _a(`<path d="M32 14V7.5M32 7.5q-5.5-1-6.5-5.5M32 7.5q5.5-1 6.5-5.5" fill="none" ${_st} stroke-width="2.8"/>` + _face('#9CC9E8') + _eyes() + `<path d="M25 41q7 5 14 0" fill="none" ${_st} stroke-width="2.6"/><path d="M45 30l3 2M46.5 35l3.5.5" fill="none" ${_st} stroke-width="2.2"/>` + _blush()),
};
const AVATAR_KEYS = Object.keys(AVATAR_SVGS);
const PRESET_AVATARS = AVATAR_KEYS.map((k) => 'a:' + k);

/* ---------- 工具 ---------- */
const $ = (sel) => document.querySelector(sel);
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const unwrap = (res) => { if (res.error) throw res.error; return res.data; };

function toast(msg, dur = 2000) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), dur);
}

async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function fmtDate(d) {
  const dt = new Date(d);
  return `${dt.getFullYear()}年${dt.getMonth() + 1}月${dt.getDate()}日 星期${WEEK[dt.getDay()]}`;
}
function fmtTime(d) {
  const dt = new Date(d);
  const p = (n) => String(n).padStart(2, '0');
  return `${p(dt.getMonth() + 1)}-${p(dt.getDate())} ${p(dt.getHours())}:${p(dt.getMinutes())}`;
}
function dayKey(d) { const dt = new Date(d); return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`; }

/* 压缩图片为 dataURL */
function compressImage(file, maxDim = 1000, quality = 0.72) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) return reject(new Error('请选择图片文件'));
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (Math.max(width, height) > maxDim) {
          const r = maxDim / Math.max(width, height);
          width = Math.round(width * r); height = Math.round(height * r);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => reject(new Error('图片读取失败'));
      img.src = reader.result;
    };
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsDataURL(file);
  });
}

/* 文件选择器：常驻 DOM（游离节点的 input.click() 在部分 iOS 上无法拉起相册） */
function getFileInput() {
  let input = document.getElementById('fm-file-input');
  if (!input) {
    input = document.createElement('input');
    input.id = 'fm-file-input';
    input.type = 'file';
    input.accept = 'image/*';
    input.style.cssText = 'position:fixed;top:-200px;left:0;width:2px;height:2px;opacity:0;pointer-events:none;';
    document.body.appendChild(input);
  }
  return input;
}

function pickImage(maxDim, quality) {
  return new Promise((resolve, reject) => {
    const input = getFileInput();
    input.value = '';
    input.onchange = () => {
      const f = input.files && input.files[0];
      if (!f) { reject(new Error('未选择图片')); return; }
      compressImage(f, maxDim, quality).then(resolve).catch(reject);
    };
    input.click();
  });
}

/* 背景专用：居中裁切到手机竖屏比例后压缩，保证整屏无黑边无意外裁切 */
function pickImagePortrait(maxW, quality) {
  return new Promise((resolve, reject) => {
    const input = getFileInput();
    input.value = '';
    input.onchange = () => {
      const f = input.files && input.files[0];
      if (!f) { reject(new Error('未选择图片')); return; }
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = async () => {
          try {
            /* 目标比例 = 当前设备视口高宽比，夹在 1.4 ~ 2.1 之间 */
            const ratio = Math.min(Math.max(window.innerHeight / Math.max(window.innerWidth, 1), 1.4), 2.1);
            const sw = img.width, sh = img.height;
            let cw = sw, ch = Math.round(sw * ratio);
            if (ch > sh) { ch = sh; cw = Math.round(sh / ratio); }
            const sx = Math.round((sw - cw) / 2), sy = Math.round((sh - ch) / 2);
            const W = Math.min(maxW, cw);
            const H = Math.round(W * ratio);
            const canvas = document.createElement('canvas');
            canvas.width = W; canvas.height = H;
            canvas.getContext('2d').drawImage(img, sx, sy, cw, ch, 0, 0, W, H);
            /* 体积自适应：超限就降分辨率/质量重编码，确保能存进数据库 */
            let q = quality, w = W;
            let url = canvas.toDataURL('image/jpeg', q);
            while (url.length > 800000 && w > 560) {
              w = Math.round(w * 0.8);
              const c2 = document.createElement('canvas');
              c2.width = w; c2.height = Math.round(w * ratio);
              c2.getContext('2d').drawImage(canvas, 0, 0, c2.width, c2.height);
              q = Math.max(0.5, q - 0.1);
              url = c2.toDataURL('image/jpeg', q);
            }
            resolve(url);
          } catch (e) { reject(e); }
        };
        img.onerror = () => reject(new Error('图片读取失败'));
        img.src = reader.result;
      };
      reader.onerror = () => reject(new Error('文件读取失败'));
      reader.readAsDataURL(f);
    };
    input.click();
  });
}

/* 头像渲染 */
function avatarHtml(avatar, cls = 'avatar') {
  if (avatar && avatar.startsWith('data:')) return `<span class="${cls}"><img src="${avatar}" alt=""></span>`;
  if (avatar && avatar.startsWith('a:')) return `<span class="${cls}">${AVATAR_SVGS[avatar.slice(2)] || AVATAR_SVGS.giraffe}</span>`;
  return `<span class="${cls}">${esc(avatar || AVATAR_KEYS[0])}</span>`;
}
function dishImgHtml(image, cls = 'dish-thumb') {
  if (image && image.startsWith('data:')) return `<img class="${cls}" src="${image}" alt="">`;
  return `<span class="${cls} placeholder">${ico('plate', 28)}</span>`;
}

/* 点单页小狗（管理员可上传更换，默认为参考图小狗） */
function orderDogHtml(cls = 'dog-img') {
  const v = (state.settings && state.settings.order_dog_image) || '';
  const src = v.startsWith('data:') ? v : 'assets/dog-order.jpg';
  return `<img class="${cls}" src="${src}" alt="点单">`;
}

/* ---------- 全局状态 ---------- */
const state = {
  member: null,
  members: [],
  categories: [],
  dishes: [],
  favorites: new Set(),
  orders: [],          // 我的页范围内的订单
  cart: [],
  settings: {},
  editMode: false,
  tab: 'home',
  orderActiveCat: null, // 点单页定位
  calMonth: null,       // 日历当前月
  calSelected: null,
  adminViewMember: null, // 管理员查看的成员统计
  longPressTimer: null,
};

const LS = {
  get memberId() { return localStorage.getItem('fm_member_id'); },
  set memberId(v) { v ? localStorage.setItem('fm_member_id', v) : localStorage.removeItem('fm_member_id'); },
  cartKey(id) { return `fm_cart_${id}`; },
  loadCart() { try { return JSON.parse(localStorage.getItem(this.cartKey(state.member.id))) || []; } catch { return []; } },
  saveCart() { localStorage.setItem(this.cartKey(state.member.id), JSON.stringify(state.cart)); },
};

/* ---------- 数据接口 ---------- */
const api = {
  async getSettings() {
    const rows = unwrap(await db.from('settings').select('*'));
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  },
  async setSetting(key, value) {
    unwrap(await db.from('settings').upsert({ key, value }).select());
  },
  async listCategories() { return unwrap(await db.from('categories').select('*').order('sort_order').order('id')); },
  async listDishes() { return unwrap(await db.from('dishes').select('*').order('id')); },
  async listMembers() { return unwrap(await db.from('members').select('*').order('id')); },
  async insertMember(m) { return unwrap(await db.from('members').insert(m).select())[0]; },
  async updateMember(id, patch) { return unwrap(await db.from('members').update(patch).eq('id', id).select())[0]; },
  async listFavorites(memberId) {
    const rows = unwrap(await db.from('favorites').select('*').eq('member_id', memberId));
    return new Set(rows.map((r) => r.dish_id));
  },
  async addFavorite(memberId, dishId) { unwrap(await db.from('favorites').insert({ member_id: memberId, dish_id: dishId }).select()); },
  async removeFavorite(memberId, dishId) {
    unwrap(await db.from('favorites').delete().eq('member_id', memberId).eq('dish_id', dishId).select());
  },
  async listAllOrders() {
    const orders = unwrap(await db.from('orders').select('*').order('created_at', { ascending: false }));
    if (!orders.length) return [];
    const items = unwrap(await db.from('order_items').select('*').in('order_id', orders.map((o) => o.id)));
    const byOrder = {};
    items.forEach((it) => { (byOrder[it.order_id] = byOrder[it.order_id] || []).push(it); });
    orders.forEach((o) => { o.items = byOrder[o.id] || []; });
    return orders;
  },
  async submitOrder(member, cart, note) {
    const order = unwrap(await db.from('orders').insert({
      member_id: member.id, member_name: member.name, note: note || '', status: '待做',
    }).select())[0];
    const items = cart.map((c) => ({
      order_id: order.id, dish_id: c.dishId, dish_name: c.name, qty: c.qty, note: c.note || '',
    }));
    unwrap(await db.from('order_items').insert(items).select());
    return order;
  },
  async updateOrderItem(itemId, patch) { unwrap(await db.from('order_items').update(patch).eq('id', itemId)); },
  async updateOrder(orderId, patch) { unwrap(await db.from('orders').update(patch).eq('id', orderId)); },
  async deleteOrderItem(itemId) { unwrap(await db.from('order_items').delete().eq('id', itemId)); },
  async updateOrderStatus(orderId, status) { unwrap(await db.from('orders').update({ status }).eq('id', orderId)); },
  async deleteOrder(orderId) {
    unwrap(await db.from('order_items').delete().eq('order_id', orderId));
    unwrap(await db.from('orders').delete().eq('id', orderId));
  },
  async insertCategory(c) { return unwrap(await db.from('categories').insert(c).select())[0]; },
  async updateCategory(id, patch) { unwrap(await db.from('categories').update(patch).eq('id', id)); },
  async deleteCategory(id) {
    const dishIds = state.dishes.filter((d) => d.category_id === id).map((d) => d.id);
    if (dishIds.length) unwrap(await db.from('dishes').delete().in('id', dishIds));
    unwrap(await db.from('categories').delete().eq('id', id));
  },
  async insertDish(d) { return unwrap(await db.from('dishes').insert(d).select())[0]; },
  async updateDish(id, patch) { unwrap(await db.from('dishes').update(patch).eq('id', id)); },
  async deleteDish(id) { unwrap(await db.from('dishes').delete().eq('id', id)); },
};

/* ---------- 一次性加载 ---------- */
async function loadCore() {
  const [settings, categories, dishes, members] = await Promise.all([
    api.getSettings(), api.listCategories(), api.listDishes(), api.listMembers(),
  ]);
  state.settings = settings;
  state.categories = categories;
  state.dishes = dishes;
  state.members = members;
  if (state.member) {
    const cur = members.find((m) => m.id === state.member.id);
    if (!cur) { // 已被移除
      state.member = null; LS.memberId = null;
      throw new Error('你的账号已被移除，请重新注册');
    }
    state.member = cur;
    state.favorites = await api.listFavorites(state.member.id);
  }
}

async function loadOrders() {
  if (!state.member) return;
  if (state.member.relation === '管理员') {
    state.orders = await api.listAllOrders();
  } else {
    const all = await api.listAllOrders();
    state.orders = all.filter((o) => o.member_id === state.member.id);
  }
}

/* ---------- 背景 ---------- */
function applyBackground(opOverride) {
  const bg = state.settings.bg_image || 'builtin:cat';
  const raw = opOverride != null ? opOverride : Number(state.settings.bg_opacity || 0);
  const k = Math.min(Math.max(raw, 0), 100) / 100;
  const layer = $('#bg-layer');
  if (bg === 'builtin:cat') layer.style.backgroundImage = "url('assets/bg-cat.jpg')";
  else if (bg === 'builtin:puppies') layer.style.backgroundImage = "url('assets/bg-puppies.jpg')";
  else if (bg.startsWith('data:')) layer.style.backgroundImage = `url("${bg}")`;
  /* 雾化 = 直接模糊背景图本身；k=0 时完全不加滤镜，即原图 */
  if (k > 0.001) {
    layer.style.filter = `blur(${(k * 16).toFixed(1)}px) saturate(${(1 - k * 0.3).toFixed(2)}) brightness(${(1 + k * 0.06).toFixed(2)})`;
    layer.style.transform = `scale(${(1 + k * 0.22).toFixed(3)})`; /* 放大避免模糊边缘露白 */
    $('#bg-fog').style.opacity = (k * 0.5).toFixed(2);
  } else {
    layer.style.filter = 'none';
    layer.style.transform = 'none';
    $('#bg-fog').style.opacity = '0';
  }
}
function bgStatusText() {
  const opacity = Number(state.settings.bg_opacity || 0);
  return state.settings.bg_image ? `已设背景 · 雾化${opacity}%` : '默认背景 · 雾化' + opacity + '%';
}

/* ---------- 弹窗系统 ---------- */
function openModal(html, { center = false, locked = false } = {}) {
  const root = $('#modal-root');
  root.innerHTML = `<div class="modal-mask ${center ? 'modal-center' : ''}">
    <div class="modal-sheet">
      <div class="modal-handle"></div>
      ${html}
    </div>
  </div>`;
  if (!locked) {
    root.querySelector('.modal-mask').addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-mask')) closeModal();
    });
  }
  return root.querySelector('.modal-sheet');
}
function closeModal() { $('#modal-root').innerHTML = ''; }

/* =========================================================
   注册
   ========================================================= */
function showRegister() {
  $('#tabbar').classList.add('hidden');
  let avatar = PRESET_AVATARS[Math.floor(Math.random() * PRESET_AVATARS.length)];
  let relation = '家人';
  const sheet = openModal(`
    <div class="register-wrap" style="min-height:auto">
      <div class="register-hero">${orderDogHtml('dog-hero-img')}
        <h1>家庭点菜</h1><p>填一下信息，马上开饭～</p>
      </div>
      <div class="field-label">昵称</div>
      <input id="reg-name" class="input" placeholder="给自己起个可爱的名字" maxlength="12">
      <div class="field-label">选一个卡通头像 <a id="reg-random" style="color:var(--green-main);font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:3px">${ico('dice', 14)} 随机</a></div>
      <div class="avatar-grid">${PRESET_AVATARS.map((a) => `<span class="avatar-item ${a === avatar ? 'selected' : ''}" data-av="${a}">${AVATAR_SVGS[a.slice(2)]}</span>`).join('')}</div>
      <div class="field-label">与本人的关系</div>
      <div class="relation-grid">${RELATIONS.map((r) => `<span class="relation-item ${r === relation ? 'selected' : ''}" data-rel="${r}">${r}</span>`).join('')}</div>
      <div id="reg-pwd-wrap" class="hidden">
        <div class="field-label">管理员密码</div>
        <input id="reg-pwd" class="input pwd-input" type="password" placeholder="请输入管理员密码" maxlength="20">
      </div>
      <div class="modal-actions"><button class="btn btn-primary btn-block" id="reg-submit">进入 →</button></div>
    </div>
  `, { center: true, locked: true });
  const refreshSel = () => {
    sheet.querySelectorAll('.avatar-item').forEach((el) => el.classList.toggle('selected', el.dataset.av === avatar));
    sheet.querySelectorAll('.relation-item').forEach((el) => el.classList.toggle('selected', el.dataset.rel === relation));
    $('#reg-pwd-wrap').classList.toggle('hidden', relation !== '管理员');
  };
  sheet.querySelectorAll('.avatar-item').forEach((el) => el.addEventListener('click', () => { avatar = el.dataset.av; refreshSel(); }));
  sheet.querySelectorAll('.relation-item').forEach((el) => el.addEventListener('click', () => { relation = el.dataset.rel; refreshSel(); }));
  sheet.querySelector('#reg-random').addEventListener('click', () => { avatar = PRESET_AVATARS[Math.floor(Math.random() * PRESET_AVATARS.length)]; refreshSel(); });
  sheet.querySelector('#reg-submit').addEventListener('click', async () => {
    const name = $('#reg-name').value.trim();
    if (!name) return toast('先给自己起个名字吧～');
    if (relation === '管理员') {
      const pwd = $('#reg-pwd').value;
      if (!pwd) return toast('请输入管理员密码');
      if (await sha256(pwd) !== state.settings.admin_password) return toast('管理员密码不对哦');
    }
    try {
      const member = await api.insertMember({ name, avatar, relation });
      state.member = member;
      LS.memberId = String(member.id);
      closeModal();
      $('#tabbar').classList.remove('hidden');
      await loadCore();
      applyBackground();
      state.cart = LS.loadCart();
      updateCartBadge();
      bindTabbar();
      switchTab('home');
      toast(`欢迎你，${name}！🍲`);
    } catch (e) { toast('注册失败：' + e.message); }
  });
}

/* =========================================================
   底部导航
   ========================================================= */
function switchTab(tab) {
  state.tab = tab;
  document.querySelectorAll('.tab-btn').forEach((b) => b.classList.toggle('active', b.dataset.tab === tab));
  render();
}
function updateCartBadge() {
  const n = state.cart.reduce((s, c) => s + c.qty, 0);
  const badge = $('#cart-badge');
  badge.textContent = n;
  badge.classList.toggle('hidden', n === 0);
}

function render() {
  const main = $('#main');
  $('#edit-banner').classList.toggle('hidden', !state.editMode);
  if (state.tab === 'home') main.innerHTML = homeHtml();
  else if (state.tab === 'order') main.innerHTML = orderHtml();
  else if (state.tab === 'cart') main.innerHTML = cartHtml();
  else if (state.tab === 'me') main.innerHTML = meHtml();
  afterRender();
}

/* =========================================================
   首页
   ========================================================= */
function isAdmin() { return state.member && state.member.relation === '管理员'; }

function homeHtml() {
  const m = state.member;
  const today = fmtDate(new Date());
  const catCards = state.categories.map((c, i) => {
    const count = state.dishes.filter((d) => d.category_id === c.id).length;
    const tools = state.editMode ? `<span class="cat-edit-tools">
      <button data-action="cat-up" data-id="${c.id}" ${i === 0 ? 'disabled' : ''}>↑</button>
      <button data-action="cat-down" data-id="${c.id}" ${i === state.categories.length - 1 ? 'disabled' : ''}>↓</button>
      <button data-action="cat-edit" data-id="${c.id}">${ico('edit', 12)}</button>
      <button data-action="cat-del" data-id="${c.id}">${ico('trash', 12)}</button>
    </span>` : '';
    return `<div class="cat-card" style="background:${c.color}" data-action="goto-cat" data-id="${c.id}">
      ${tools}
      <span class="cat-icon">${catIconInner(c.icon, 26)}</span>
      <div class="cat-name">${esc(c.name)}</div>
      <div class="cat-count">${count} 道菜</div>
    </div>`;
  }).join('');
  const addCat = state.editMode ? `<div class="add-cat-card" data-action="cat-add"><span class="add-cat-plus">＋</span><br>新增分类</div>` : '';
  const bgBar = isAdmin() ? `
    <div class="bg-bar" data-action="bg-settings">
      ${ico('palette', 17)} 背景设置
      <span class="bg-status">${bgStatusText()} ›</span>
    </div>` : '';
  const dogChip = state.editMode && isAdmin() ? `<button class="dog-change-chip" data-action="dog-settings">${ico('camera', 12)} 换形象</button>` : '';

  return `
    <div class="home-header">
      ${avatarHtml(m.avatar)}
      <div class="user-meta">
        <div class="user-name">${esc(m.name)} <span class="relation-chip ${m.relation === '管理员' ? 'admin' : ''}">${m.relation}</span></div>
        <div class="user-date">${today}</div>
      </div>
      <button class="btn btn-outline btn-sm" data-action="share">${ico('link', 14)} 分享</button>
    </div>
    <div class="card order-entry">
      ${dogChip}
      <div class="dog-btn" data-action="goto-order">${orderDogHtml()}</div>
      <div class="entry-label">点 单</div>
      <div class="entry-tip">点击小狗开始今日点餐 ${ico('paw', 13)}</div>
      ${bgBar}
    </div>
    <div>
      <div class="card-title" style="margin:4px 0 0 4px">${ico('book', 18)} 菜品分类</div>
      ${state.editMode ? '<div class="press-hint">编辑模式：↑↓ 排序 · ✎ 改名称/图标/底色 · 🗑 删除</div>' : ''}
      <div class="cat-grid">${catCards}${addCat}</div>
    </div>`;
}

/* ---------- 背景设置（管理员） ---------- */
function openBgSettings() {
  const bg = state.settings.bg_image || 'builtin:cat';
  const opacity = Number(state.settings.bg_opacity || 0);
  const preset = (val, label, inner) => `<div class="bg-preset ${bg === val ? 'selected' : ''}" data-bg-val="${val}">${inner}<span class="bg-preset-label">${label}</span></div>`;
  const custom = bg.startsWith('data:') ? preset(bg, '自定义', `<img src="${bg}">`) : '';
  const sheet = openModal(`
    <div class="modal-title">${ico('palette', 19)} 背景设置</div>
    <div class="field-label">选择背景</div>
    <div class="bg-preset-grid">
      ${preset('builtin:cat', '小白猫', '<img src="assets/bg-cat.jpg">')}
      ${preset('builtin:puppies', '星球小狗', '<img src="assets/bg-puppies.jpg">')}
      ${custom}
      <div class="bg-preset" id="bg-upload" style="border-style:dashed">＋<span class="bg-preset-label">上传图片</span></div>
    </div>
    <div class="field-label">雾化程度：<span style="color:var(--text-light)">(0 = 显示原图，越大越朦胧)</span></div>
    <div class="slider-row">
      <input type="range" id="bg-opacity" min="0" max="80" step="5" value="${opacity}">
      <span class="slider-val" id="bg-opacity-val">${opacity}%</span>
    </div>
    <div class="modal-actions">
      <button class="btn btn-outline" data-action="modal-close">取消</button>
      <button class="btn btn-primary" id="bg-save">保存</button>
    </div>
  `);
  let selectedBg = bg;
  sheet.querySelectorAll('.bg-preset[data-bg-val]').forEach((el) => {
    el.addEventListener('click', () => {
      selectedBg = el.dataset.bgVal;
      sheet.querySelectorAll('.bg-preset').forEach((p) => p.classList.remove('selected'));
      el.classList.add('selected');
    });
  });
  sheet.querySelector('#bg-upload').addEventListener('click', async () => {
    try {
      toast('正在处理图片…');
      const dataUrl = await pickImagePortrait(1280, 0.72);
      selectedBg = dataUrl;
      /* 上传后立即把预设区换成自定义预览 */
      const oldCustom = sheet.querySelector('.bg-preset[data-bg-val^="data:"]');
      if (oldCustom) oldCustom.remove();
      const tpl = document.createElement('div');
      tpl.className = 'bg-preset selected';
      tpl.dataset.bgVal = dataUrl;
      tpl.innerHTML = `<img src="${dataUrl}"><span class="bg-preset-label">自定义</span>`;
      sheet.querySelector('#bg-upload').before(tpl);
      tpl.addEventListener('click', () => {
        selectedBg = dataUrl;
        sheet.querySelectorAll('.bg-preset').forEach((p) => p.classList.remove('selected'));
        tpl.classList.add('selected');
      });
      sheet.querySelectorAll('.bg-preset').forEach((p) => { if (p !== tpl) p.classList.remove('selected'); });
      applyBackground();
      state.settings.bg_image = dataUrl;
      toast('已按手机竖屏比例裁切，点「保存」生效');
    } catch (e) { if (e.message !== '未选择图片') toast(e.message); }
  });
  /* 拖动滑块实时预览雾化效果 */
  sheet.querySelector('#bg-opacity').addEventListener('input', (e) => {
    const v = Number(e.target.value);
    sheet.querySelector('#bg-opacity-val').textContent = v + '%';
    applyBackground(v);
  });
  sheet.querySelector('#bg-save').addEventListener('click', async () => {
    const op = sheet.querySelector('#bg-opacity').value;
    const btn = sheet.querySelector('#bg-save');
    btn.disabled = true; btn.textContent = '保存中…';
    try {
      await api.setSetting('bg_image', selectedBg);
      await api.setSetting('bg_opacity', op);
      state.settings.bg_image = selectedBg;
      state.settings.bg_opacity = op;
      applyBackground();
      closeModal();
      render();
      toast('背景已更新，全站生效 🎨');
    } catch (e) {
      btn.disabled = false; btn.textContent = '保存';
      toast('保存失败：' + e.message);
    }
  });
}

/* ---------- 点单小狗形象设置（管理员） ---------- */
function openDogSettings() {
  const cur = (state.settings.order_dog_image || '');
  const sheet = openModal(`
    <div class="modal-title">${ico('paw', 19)} 点单形象设置</div>
    <div class="field-label">首页「点击小狗开始点餐」的形象</div>
    <div class="bg-preset-grid">
      <div class="bg-preset dog-preset ${cur ? '' : 'selected'}" data-dog-val="">
        <img src="assets/dog-order.jpg"><span class="bg-preset-label">戴帽小狗</span>
      </div>
      ${cur.startsWith('data:') ? `<div class="bg-preset dog-preset selected" data-dog-val="${cur}"><img src="${cur}"><span class="bg-preset-label">自定义</span></div>` : ''}
      <div class="bg-preset" id="dog-upload" style="border-style:dashed">＋<span class="bg-preset-label">上传图片</span></div>
    </div>
    <div class="press-hint" style="text-align:left">建议上传方形、白色或透明底的卡通图片</div>
    <div class="modal-actions">
      <button class="btn btn-outline" data-action="modal-close">取消</button>
      <button class="btn btn-primary" id="dog-save">保存</button>
    </div>
  `);
  let selected = cur;
  sheet.querySelectorAll('.dog-preset').forEach((el) => {
    el.addEventListener('click', () => {
      selected = el.dataset.dogVal;
      sheet.querySelectorAll('.bg-preset').forEach((p) => p.classList.remove('selected'));
      el.classList.add('selected');
    });
  });
  sheet.querySelector('#dog-upload').addEventListener('click', async () => {
    try {
      selected = await pickImage(600, 0.82);
      sheet.querySelectorAll('.bg-preset').forEach((p) => p.classList.remove('selected'));
      sheet.querySelector('#dog-upload').classList.add('selected');
      toast('图片已选择，记得点保存');
    } catch (e) { toast(e.message); }
  });
  sheet.querySelector('#dog-save').addEventListener('click', async () => {
    try {
      await api.setSetting('order_dog_image', selected);
      state.settings.order_dog_image = selected;
      closeModal(); render();
      toast('点单形象已更新');
    } catch (e) { toast('保存失败：' + e.message); }
  });
}

/* =========================================================
   点单页
   ========================================================= */
function orderHtml() {
  const activeCat = state.orderActiveCat && state.categories.some((c) => c.id === state.orderActiveCat)
    ? state.orderActiveCat : (state.categories[0] && state.categories[0].id);
  const nav = state.categories.map((c) => `
    <div class="cat-nav-item ${c.id === activeCat ? 'active' : ''}" data-action="pick-cat" data-id="${c.id}">
      <span class="nav-icon">${catIconInner(c.icon, 22)}</span>${esc(c.name)}
    </div>`).join('');
  const catDishes = state.dishes.filter((d) => d.category_id === activeCat);
  const addBtn = state.editMode ? `<button class="add-dish-btn" data-action="dish-add" data-cat="${activeCat}">${ico('plus', 15)} 新增菜品</button>` : '';
  let list;
  if (!catDishes.length) {
    list = addBtn + `<div class="empty-tip"><span class="empty-ico">${ico('pan', 40)}</span>大厨还没上新，敬请期待~</div>`;
  } else {
    list = addBtn +
      catDishes.map((d) => {
        const faved = state.favorites.has(d.id);
        const inCart = state.cart.some((c) => c.dishId === d.id);
        return `<div class="dish-item" data-action="open-dish" data-id="${d.id}">
          ${state.editMode ? `<button class="dish-edit-chip" data-action="dish-edit" data-id="${d.id}">✎ 编辑</button>` : ''}
          ${dishImgHtml(d.image)}
          <div class="dish-info">
            <div class="dish-name">${esc(d.name)}</div>
            <div class="dish-intro">${esc(d.intro || '大厨的拿手好菜~')}</div>
          </div>
          <div class="dish-actions">
            <button class="fav-btn ${faved ? 'faved' : ''}" data-action="toggle-fav" data-id="${d.id}">${faved ? ico('heartFill', 21) : ico('heart', 21)}</button>
            <button class="add-cart-btn" data-action="add-cart" data-id="${d.id}">＋</button>
          </div>
        </div>`;
      }).join('');
  }
  return `<div class="order-layout">
    <div class="cat-nav">${nav}</div>
    <div class="dish-list">${list}</div>
  </div>`;
}

/* ---------- 备注弹窗 ---------- */
function openNoteModal({ title, initialTags = [], initialText = '', onSave }) {
  const tags = new Set(initialTags);
  const sheet = openModal(`
    <div class="modal-title">${ico('note', 18)} ${esc(title)}</div>
    <div class="field-label">快捷备注（可多选）</div>
    <div class="tag-cloud">${QUICK_NOTES.map((t) => `<span class="note-tag ${initialText.includes(t) || initialTags.includes(t) ? 'selected' : ''}" data-tag="${t}">${t}</span>`).join('')}</div>
    <div class="field-label">自定义备注</div>
    <input class="input" id="note-custom" placeholder="比如：多放点醋～" value="${esc(initialText)}" maxlength="50">
    <div class="modal-actions">
      <button class="btn btn-outline" data-action="modal-close">取消</button>
      <button class="btn btn-primary" id="note-save">确定</button>
    </div>
  `);
  sheet.querySelectorAll('.note-tag').forEach((el) => el.addEventListener('click', () => {
    const t = el.dataset.tag;
    if (tags.has(t)) { tags.delete(t); el.classList.remove('selected'); }
    else { tags.add(t); el.classList.add('selected'); }
  }));
  sheet.querySelector('#note-save').addEventListener('click', () => {
    const custom = sheet.querySelector('#note-custom').value.trim();
    const all = [...tags, ...(custom && ![...tags].includes(custom) ? [custom] : [])];
    onSave(all.join('；'));
    closeModal();
  });
}

/* ---------- 加入购物车 ---------- */
function addToCart(dishId) {
  const dish = state.dishes.find((d) => d.id === dishId);
  if (!dish) return;
  const exist = state.cart.find((c) => c.dishId === dishId);
  if (exist) {
    exist.qty += 1;
    LS.saveCart(); updateCartBadge();
    toast(`「${dish.name}」+1`);
  } else {
    openNoteModal({
      title: `${dish.name} · 加个备注`,
      onSave: (note) => {
        state.cart.push({ dishId: dish.id, name: dish.name, image: dish.image, qty: 1, note });
        LS.saveCart(); updateCartBadge();
        toast(`已加入「${dish.name}」🛒`);
      },
    });
  }
}

/* ---------- 菜品详情 ---------- */
function openDishDetail(dishId) {
  const d = state.dishes.find((x) => x.id === dishId);
  if (!d) return;
  const cat = state.categories.find((c) => c.id === d.category_id);
  const faved = state.favorites.has(d.id);
  const steps = (d.steps || '').split('\n').map((s) => s.trim()).filter(Boolean);
  const modal = openModal(`
    <div class="detail-hero">
      ${d.image && d.image.startsWith('data:') ? `<img src="${d.image}">` : `<div class="ph">${ico('plate', 60)}</div>`}
      <span class="cat-tag">${cat ? catIconInner(cat.icon, 13) + ' ' + esc(cat.name) : '菜品'}</span>
    </div>
    ${state.editMode ? `
      <div class="field-label">菜品名称</div><input class="input" id="de-name" value="${esc(d.name)}">
      <div class="field-label">菜品简介</div><input class="input" id="de-intro" value="${esc(d.intro || '')}">
      <div class="field-label">所需食材</div><textarea class="textarea" id="de-ing">${esc(d.ingredients || '')}</textarea>
      <div class="field-label">制作步骤（每步换行）</div><textarea class="textarea steps-textarea" id="de-steps">${esc(d.steps || '')}</textarea>
      <div class="modal-actions">
        <button class="btn btn-danger" id="de-del">${ico('trash', 14)} 删除</button>
        <button class="btn btn-outline" id="de-img">${ico('camera', 14)} 换图片</button>
        <button class="btn btn-primary" id="de-save">保存</button>
      </div>
      <div style="height:80px"></div>` : `
      <div class="detail-body">
        <div class="detail-name">${esc(d.name)}</div>
        <div class="detail-intro">${esc(d.intro || '大厨的拿手好菜~')}</div>
        <div style="height:12px"></div>
        <div class="detail-sec-label">${ico('carrot', 17)} 所需食材</div>
        <div class="detail-steps">${esc(d.ingredients || '大厨的秘方，暂时保密~')}</div>
        <div style="height:12px"></div>
        <div class="detail-sec-label">${ico('chef', 17)} 制作步骤</div>
        <div class="detail-steps">${steps.length ? steps.map((s, i) => `<div class="step-line"><span class="step-no">${i + 1}</span><span>${esc(s)}</span></div>`).join('') : '大厨的秘方，暂时保密~'}</div>
      </div>`}
    <div class="detail-footer">
      <button class="btn btn-outline" id="de-fav">${faved ? ico('heartFill', 16) + ' 已收藏' : ico('heart', 16) + ' 收藏'}</button>
      <button class="btn btn-primary" id="de-add">${ico('cart', 16)} 加入购物车</button>
    </div>
  `);
  modal.querySelector('#de-fav').addEventListener('click', async () => { await toggleFav(d.id); closeModal(); openDishDetail(d.id); });
  modal.querySelector('#de-add').addEventListener('click', () => { addToCart(d.id); });
  if (state.editMode) {
    let newImage = d.image;
    modal.querySelector('#de-img').addEventListener('click', async () => {
      try { newImage = await pickImage(1000, 0.72); toast('图片已选择，记得点保存'); } catch (e) { toast(e.message); }
    });
    modal.querySelector('#de-save').addEventListener('click', async () => {
      try {
        await api.updateDish(d.id, {
          name: modal.querySelector('#de-name').value.trim() || d.name,
          intro: modal.querySelector('#de-intro').value.trim(),
          ingredients: modal.querySelector('#de-ing').value.trim(),
          steps: modal.querySelector('#de-steps').value.trim(),
          image: newImage,
        });
        await loadCore(); closeModal(); render(); toast('菜品已保存 ✅');
      } catch (e) { toast('保存失败：' + e.message); }
    });
    modal.querySelector('#de-del').addEventListener('click', async () => {
      if (!confirm(`确定删除「${d.name}」吗？`)) return;
      try { await api.deleteDish(d.id); await loadCore(); closeModal(); render(); toast('已删除'); }
      catch (e) { toast('删除失败：' + e.message); }
    });
  }
}

/* ---------- 新增菜品 ---------- */
function openDishAdd(categoryId) {
  const sheet = openModal(`
    <div class="modal-title">${ico('pan', 18)} 新增菜品</div>
    <div class="field-label">所属分类</div>
    <select class="select" id="da-cat">${state.categories.map((c) => `<option value="${c.id}" ${c.id === categoryId ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}</select>
    <div class="field-label">菜品名称</div><input class="input" id="da-name" placeholder="比如：番茄炒蛋">
    <div class="field-label">菜品简介</div><input class="input" id="da-intro" placeholder="一句话介绍这道菜">
    <div class="field-label">所需食材</div><textarea class="textarea" id="da-ing" placeholder="每行一种食材"></textarea>
    <div class="field-label">制作步骤（每步换行）</div><textarea class="textarea steps-textarea" id="da-steps" placeholder="第一步...\n第二步..."></textarea>
    <div class="modal-actions">
      <button class="btn btn-outline" id="da-img">${ico('camera', 14)} 选图片</button>
      <button class="btn btn-primary" id="da-save">保存</button>
    </div>
  `);
  let image = null;
  sheet.querySelector('#da-img').addEventListener('click', async () => {
    try { image = await pickImage(1000, 0.72); toast('图片已选择，记得点保存'); } catch (e) { toast(e.message); }
  });
  sheet.querySelector('#da-save').addEventListener('click', async () => {
    const name = sheet.querySelector('#da-name').value.trim();
    if (!name) return toast('菜名不能为空');
    try {
      await api.insertDish({
        category_id: Number(sheet.querySelector('#da-cat').value),
        name,
        intro: sheet.querySelector('#da-intro').value.trim(),
        ingredients: sheet.querySelector('#da-ing').value.trim(),
        steps: sheet.querySelector('#da-steps').value.trim(),
        image,
      });
      await loadCore(); closeModal(); render(); toast('新菜上架啦 🎉');
    } catch (e) { toast('保存失败：' + e.message); }
  });
}

/* ---------- 收藏 ---------- */
async function toggleFav(dishId) {
  try {
    if (state.favorites.has(dishId)) {
      await api.removeFavorite(state.member.id, dishId);
      state.favorites.delete(dishId);
      toast('已取消收藏');
    } else {
      await api.addFavorite(state.member.id, dishId);
      state.favorites.add(dishId);
      toast('已收藏 ❤️');
    }
    if (state.tab === 'order') render();
  } catch (e) { toast('操作失败：' + e.message); }
}

/* =========================================================
   购物车
   ========================================================= */
function cartHtml() {
  if (!state.cart.length) {
    return `<div class="cart-empty"><span class="empty-ico">${ico('cart', 54)}</span>购物车空空的<br><br>
      <button class="btn btn-primary" data-action="goto-order">去点菜 →</button></div>`;
  }
  const items = state.cart.map((c, i) => `
    <div class="cart-item">
      ${dishImgHtml(c.image)}
      <div class="ci-info">
        <div class="ci-name">${esc(c.name)}</div>
        <span class="ci-note" data-action="edit-item-note" data-idx="${i}">${ico('edit', 11)} ${esc(c.note || '点击加备注')}</span>
      </div>
      <div class="qty-stepper">
        <button data-action="cart-minus" data-idx="${i}">−</button>
        <span class="qty-num">${c.qty}</span>
        <button data-action="cart-plus" data-idx="${i}">＋</button>
      </div>
      <button class="cart-del" data-action="cart-del" data-idx="${i}">✕</button>
    </div>`).join('');
  const total = state.cart.reduce((s, c) => s + c.qty, 0);
  return `
    <div class="card">
      <div class="card-title">${ico('cart', 18)} 购物车 <button class="btn btn-danger btn-sm" style="margin-left:auto" data-action="cart-clear">清空</button></div>
      ${items}
    </div>
    <div class="card">
      <div class="card-title">${ico('note', 18)} 整单备注</div>
      <input class="input" id="order-note" placeholder="这桌菜的公共要求，比如：家里来客人了多点两碗饭" maxlength="80" value="${esc(state.orderNoteDraft || '')}">
    </div>
    <div class="cart-footer">
      <div class="total-info">共 <b>${total}</b> 道菜</div>
      <button class="btn btn-primary" data-action="submit-order">提交点单</button>
    </div>
    <div style="height:70px"></div>`;
}

function submitOrder() {
  if (!state.cart.length) return toast('购物车还是空的');
  const note = ($('#order-note') && $('#order-note').value.trim()) || '';
  openModal(`
    <div class="modal-title">${ico('check', 19)} 确认提交点单？</div>
    <div style="text-align:center;color:var(--text-sub);font-size:14px">
      共 <b style="color:var(--green-deep)">${state.cart.reduce((s, c) => s + c.qty, 0)}</b> 道菜，提交后家人就能看到啦
    </div>
    <div class="modal-actions">
      <button class="btn btn-outline" data-action="modal-close">再看看</button>
      <button class="btn btn-primary" id="submit-confirm">提交</button>
    </div>
  `, { center: true });
  $('#submit-confirm').addEventListener('click', async () => {
    try {
      await api.submitOrder(state.member, state.cart, note);
      state.cart = []; LS.saveCart(); updateCartBadge(); state.orderNoteDraft = '';
      closeModal();
      try { await loadOrders(); } catch {}
      toast('点单成功！坐等开饭 🎉');
      switchTab('me');
    } catch (e) { toast('提交失败：' + e.message); }
  });
}

/* =========================================================
   我的
   ========================================================= */
function meHtml() {
  const m = state.member;
  const myOrders = state.orders;
  const orderCount = myOrders.length;
  const dishCountMap = countDishes(myOrders);
  const totalDishes = state.dishes.length;
  const distinct = Object.keys(dishCountMap).length;

  const statsScope = isAdmin() && state.adminViewMember ? state.members.find((x) => x.id === state.adminViewMember) : null;
  const scopeOrders = statsScope ? myOrders.filter((o) => o.member_id === statsScope.id) : myOrders;
  const scopeDishMap = countDishes(scopeOrders);

  const chips = isAdmin() ? `<div class="member-chips">
      <span class="member-chip ${!statsScope ? 'selected' : ''}" data-action="admin-view-member" data-id="">全体成员</span>
      ${state.members.map((mm) => `<span class="member-chip ${statsScope && statsScope.id === mm.id ? 'selected' : ''}" data-action="admin-view-member" data-id="${mm.id}">${avatarHtml(mm.avatar, 'avatar')} ${esc(mm.name)}</span>`).join('')}
    </div>` : '';

  const chartHtml = barChart(scopeDishMap);

  // 成员对比图（管理员）
  const compareHtml = isAdmin() && !statsScope ? `
    <div class="card">
      <div class="card-title">${ico('users', 18)} 成员点单对比</div>
      ${barChart(Object.fromEntries(state.members.map((mm) => [mm.name, myOrders.filter((o) => o.member_id === mm.id).reduce((s, o) => s + o.items.reduce((a, i) => a + i.qty, 0), 0)])), '#f4a259')}
    </div>` : '';

  return `
    <div class="card me-profile">
      ${avatarHtml(m.avatar)}
      <div class="mp-info">
        <div class="mp-name">${esc(m.name)} <span class="relation-chip ${isAdmin() ? 'admin' : ''}">${m.relation}</span></div>
        <div class="mp-rel">${isAdmin() ? '家庭管理员 · 可以编辑菜单' : '家庭点菜成员'}</div>
      </div>
      <button class="btn btn-outline btn-sm" data-action="edit-profile">${ico('edit', 13)} 编辑</button>
    </div>

    <div class="card">
      <div class="stats-row">
        <div class="stat-cell"><div class="stat-num">${totalDishes}</div><div class="stat-label">总菜品</div></div>
        <div class="stat-cell"><div class="stat-num">${scopeOrders.length}</div><div class="stat-label">点单次数</div></div>
        <div class="stat-cell"><div class="stat-num">${Object.keys(scopeDishMap).length}</div><div class="stat-label">累计菜品</div></div>
      </div>
    </div>
    ${chips}
    <div class="card">
      <div class="card-title">${ico('chart', 18)} 已点菜品统计${statsScope ? ' · ' + esc(statsScope.name) : ''}</div>
      ${chartHtml}
    </div>
    ${compareHtml}

    <div class="card" style="margin-top:14px">
      <div class="card-title">${ico('book', 18)} 点单历史
        <button class="btn btn-outline btn-sm" style="margin-left:auto" data-action="toggle-calendar">${ico('calendar', 14)} 日历查看</button>
      </div>
      <div id="history-area">${historyListHtml(myOrders)}</div>
    </div>

    <div class="card">
      <div class="card-title">${ico('heartFill', 18)} 我的收藏</div>
      <div id="fav-area">${favListHtml()}</div>
    </div>

    ${state.editMode && isAdmin() ? `
    <div class="card" style="border:1.5px solid #f4a259">
      <div class="card-title">${ico('tool', 18)} 管理员工具（编辑模式中）</div>
      <div class="admin-tool-row">
        <button class="btn btn-warn btn-sm" data-action="change-pwd">${ico('key', 14)} 修改管理员密码</button>
        <button class="btn btn-warn btn-sm" data-action="dog-settings">${ico('paw', 14)} 更换点单形象</button>
      </div>
      <div class="press-hint" style="text-align:left;margin-top:8px">当前可：首页调整/新增/编辑/删除分类 · 点单页新增和编辑菜品 · 上方订单列表改状态/删除</div>
    </div>` : ''}

    <button class="btn btn-outline btn-block" data-action="share" style="margin-bottom:10px">${ico('link', 15)} 分享给家人（链接 + 二维码）</button>
    <button class="btn btn-outline btn-block" data-action="logout" style="margin-bottom:10px">切换身份 / 重新注册</button>
    ${isAdmin() && !state.editMode ? `<button class="btn btn-warn btn-block" data-action="enter-edit">${ico('lock', 15)} 我的-编辑（管理员编辑模式）</button>` : ''}
  `;
}

function countDishes(orders) {
  const map = {};
  orders.forEach((o) => o.items.forEach((it) => { map[it.dish_name] = (map[it.dish_name] || 0) + it.qty; }));
  return map;
}

function barChart(dataMap, color) {
  const entries = Object.entries(dataMap).sort((a, b) => b[1] - a[1]);
  if (!entries.length) return `<div class="chart-empty">还没有点过菜，快去下一单吧～</div>`;
  const max = Math.max(...entries.map((e) => e[1]));
  return `<div class="chart-wrap">${entries.map(([name, n]) => `
    <div class="chart-col">
      <div class="bar" style="height:${Math.max(6, Math.round((n / max) * 110))}px;${color ? `background:${color}` : ''}">
        <span class="bar-val">${n}</span>
      </div>
      <span class="bar-label" title="${esc(name)}">${esc(name)}</span>
    </div>`).join('')}</div>`;
}

/* ---------- 历史列表 / 日历 ---------- */
function historyListHtml(orders) {
  if (state.calMode) return calendarHtml(orders);
  return orderCardsHtml(orders);
}

function orderCardsHtml(orders) {
  if (!orders.length) return `<div class="chart-empty">还没有点单记录，饿了就去点吧～</div>`;
  return orders.map((o) => {
    const dt = new Date(o.created_at);
    const statusCtrl = state.editMode && isAdmin()
      ? `<select class="status-select" data-action="order-status" data-id="${o.id}">
          ${['待做', '已做', '完成'].map((s) => `<option ${o.status === s ? 'selected' : ''}>${s}</option>`).join('')}
        </select>`
      : `<span class="status-tag status-${o.status}">${o.status}</span>`;
    const tools = `<span class="oc-tools">
      ${(isAdmin() || o.member_id === state.member.id) ? `<button class="oc-edit-btn" data-action="order-edit" data-id="${o.id}">修改</button>` : ''}
      ${isAdmin() ? `<button class="oc-del" data-action="order-del" data-id="${o.id}">删除</button>` : ''}
    </span>`;
    return `<div class="order-card">
      <div class="oc-head">
        <div class="oc-date"><div class="d">${dt.getDate()}</div><div class="m">${dt.getFullYear()}.${String(dt.getMonth() + 1).padStart(2, '0')}</div></div>
        <div class="oc-title">点了 ${o.items.reduce((s, i) => s + i.qty, 0)} 道菜 <span style="font-weight:400;color:var(--text-sub);font-size:12px">${isAdmin() && o.member_name ? '· ' + esc(o.member_name) : ''} · ${fmtTime(o.created_at).slice(-5)}</span></div>
        ${statusCtrl}
        ${tools}
      </div>
      <div class="oc-dishes">${o.items.map((i) => `<span class="dish-tag">${esc(i.dish_name)} ×${i.qty}</span>`).join('')}</div>
      ${o.note ? `<span class="oc-note">${ico('note', 11)} ${esc(o.note)}</span>` : ''}
    </div>`;
  }).join('');
}

function calendarHtml(orders) {
  const now = state.calMonth ? new Date(state.calMonth) : new Date();
  const y = now.getFullYear(), mo = now.getMonth();
  state.calMonth = `${y}-${String(mo + 1).padStart(2, '0')}-01`;
  const first = new Date(y, mo, 1);
  const startPad = first.getDay();
  const daysInMonth = new Date(y, mo + 1, 0).getDate();
  const orderDays = new Set(orders.map((o) => dayKey(o.created_at)));
  const todayKey = dayKey(new Date());
  let cells = '';
  for (let i = 0; i < startPad; i++) cells += `<div class="cal-day other"></div>`;
  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${y}-${String(mo + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const has = orderDays.has(key);
    cells += `<div class="cal-day ${key === todayKey ? 'today' : ''} ${has ? 'has-order' : ''} ${state.calSelected === key ? 'selected' : ''}"
      data-action="cal-pick" data-key="${key}">${d}${has ? '<span class="order-dot"></span>' : ''}</div>`;
  }
  const selectedOrders = state.calSelected ? orders.filter((o) => dayKey(o.created_at) === state.calSelected) : [];
  return `
    <div class="cal-header">
      <button class="cal-nav-btn" data-action="cal-prev">‹</button>
      <span class="cal-month">${y}年${mo + 1}月</span>
      <button class="cal-nav-btn" data-action="cal-next">›</button>
    </div>
    <div class="cal-grid">${['日', '一', '二', '三', '四', '五', '六'].map((w) => `<div class="cal-week">${w}</div>`).join('')}${cells}</div>
    <div style="margin-top:12px">
      ${state.calSelected
        ? (selectedOrders.length
          ? orderCardsHtml(selectedOrders)
          : '<div class="chart-empty">这一天没有点单记录</div>')
        : '<div class="chart-empty">点击有圆点的日期查看当天订单</div>'}
    </div>`;
}

/* ---------- 修改自己订单 ---------- */
function openOrderEdit(orderId) {
  const o = state.orders.find((x) => x.id === orderId);
  if (!o) return;
  if (!isAdmin() && o.member_id !== state.member.id) return toast('只能修改自己的订单哦');
  const itemsHtml = o.items.map((it, idx) => `
    <div class="cart-item" data-item-id="${it.id}">
      <div class="ci-info">
        <div class="ci-name">${esc(it.dish_name)}</div>
        <span class="ci-note" data-action="order-item-note" data-idx="${idx}">${ico('edit', 11)} ${esc(it.note || '点击加备注')}</span>
      </div>
      <div class="qty-stepper">
        <button data-action="oi-minus" data-idx="${idx}">−</button>
        <span class="qty-num">${it.qty}</span>
        <button data-action="oi-plus" data-idx="${idx}">＋</button>
      </div>
    </div>`).join('');
  const createdAt = new Date(o.created_at);
  const localDateKey = dayKey(createdAt);
  openModal(`
    <div class="modal-title">${ico('edit', 18)} 修改订单</div>
    <div id="oe-items">${itemsHtml}</div>
    <div class="field-label">下单日期（可补填 / 改签到别的日子）</div>
    <input class="input" type="date" id="oe-date" value="${localDateKey}">
    <div class="field-label">整单备注</div>
    <input class="input" id="oe-note" value="${esc(o.note || '')}" maxlength="80">
    <div class="modal-actions">
      <button class="btn btn-outline" data-action="modal-close">取消</button>
      <button class="btn btn-primary" id="oe-save">保存修改</button>
    </div>
  `);
  const modal = $('#modal-root .modal-sheet');
  // 本地临时数量编辑
  modal.querySelectorAll('[data-action="oi-plus"],[data-action="oi-minus"]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const idx = Number(btn.dataset.idx);
      const it = o.items[idx];
      const delta = btn.dataset.action === 'oi-plus' ? 1 : -1;
      const newQty = it.qty + delta;
      if (newQty <= 0) {
        if (!o.items.length || o.items.length === 1) return toast('订单至少保留一道菜');
        try { await api.deleteOrderItem(it.id); o.items.splice(idx, 1); } catch (e) { return toast('修改失败：' + e.message); }
      } else {
        try { await api.updateOrderItem(it.id, { qty: newQty }); it.qty = newQty; } catch (e) { return toast('修改失败：' + e.message); }
      }
      closeModal(); await loadOrders(); render(); openOrderEdit(orderId);
    });
  });
  modal.querySelectorAll('[data-action="order-item-note"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.idx);
      const it = o.items[idx];
      openNoteModal({
        title: `${it.dish_name} · 备注`,
        initialText: it.note || '',
        onSave: async (note) => {
          try { await api.updateOrderItem(it.id, { note }); await loadOrders(); render(); toast('备注已更新'); }
          catch (e) { toast('保存失败：' + e.message); }
        },
      });
    });
  });
  modal.querySelector('#oe-save').addEventListener('click', async () => {
    try {
      const patch = { note: modal.querySelector('#oe-note').value.trim() };
      /* 日期变更：保留原下单时间（时/分/秒），只换年月日 */
      const nv = modal.querySelector('#oe-date').value;
      if (nv && nv !== localDateKey) {
        const [yy, mm, dd] = nv.split('-').map(Number);
        const nd = new Date(yy, mm - 1, dd, createdAt.getHours(), createdAt.getMinutes(), createdAt.getSeconds());
        patch.created_at = nd.toISOString();
      }
      await api.updateOrder(o.id, patch);
      await loadOrders(); closeModal(); render(); toast('订单已更新 ✅');
    } catch (e) { toast('保存失败：' + e.message); }
  });
}

/* ---------- 收藏列表 ---------- */
function favListHtml() {
  const favs = state.dishes.filter((d) => state.favorites.has(d.id));
  if (!favs.length) return `<div class="chart-empty">还没有收藏，看到喜欢的菜点心心吧 ❤️</div>`;
  return favs.map((d) => `
    <div class="fav-item">
      ${dishImgHtml(d.image)}
      <div class="ci-info">
        <div class="ci-name">${esc(d.name)}</div>
        <div class="dish-intro">${esc(d.intro || '')}</div>
      </div>
      <button class="btn btn-primary btn-sm" data-action="fav-add-cart" data-id="${d.id}">＋购物车</button>
      <button class="fav-btn faved" data-action="toggle-fav" data-id="${d.id}">${ico('heartFill', 20)}</button>
    </div>`).join('');
}

/* ---------- 编辑资料 ---------- */
function openEditProfile() {
  const m = state.member;
  let avatar = m.avatar;
  const sheet = openModal(`
    <div class="modal-title">${ico('edit', 18)} 编辑资料</div>
    <div style="display:flex;justify-content:center;margin-bottom:10px" id="ep-preview">${avatarHtml(avatar)}</div>
    <div class="field-label">昵称</div>
    <input class="input" id="ep-name" value="${esc(m.name)}" maxlength="12">
    <div class="field-label">头像（点击选择 / 上传）</div>
    <div class="avatar-grid">${PRESET_AVATARS.map((a) => `<span class="avatar-item ${a === avatar ? 'selected' : ''}" data-av="${a}">${AVATAR_SVGS[a.slice(2)]}</span>`).join('')}</div>
    <div class="modal-actions">
      <button class="btn btn-outline" id="ep-upload">${ico('camera', 14)} 上传自定义头像</button>
      <button class="btn btn-primary" id="ep-save">保存</button>
    </div>
  `);
  const refresh = () => {
    sheet.querySelectorAll('.avatar-item').forEach((el) => el.classList.toggle('selected', el.dataset.av === avatar));
    sheet.querySelector('#ep-preview').innerHTML = avatarHtml(avatar);
  };
  sheet.querySelectorAll('.avatar-item').forEach((el) => el.addEventListener('click', () => { avatar = el.dataset.av; refresh(); }));
  sheet.querySelector('#ep-upload').addEventListener('click', async () => {
    try { avatar = await pickImage(300, 0.8); refresh(); } catch (e) { toast(e.message); }
  });
  sheet.querySelector('#ep-save').addEventListener('click', async () => {
    const name = sheet.querySelector('#ep-name').value.trim();
    if (!name) return toast('昵称不能为空');
    try {
      state.member = await api.updateMember(m.id, { name, avatar });
      await loadCore(); closeModal(); render(); toast('资料已更新 ✅');
    } catch (e) { toast('保存失败：' + e.message); }
  });
}

/* ---------- 管理员编辑模式（注册时已验证密码，此处直接进入） ---------- */
function enterEditMode() {
  state.editMode = true;
  render();
  toast('已进入编辑模式，可以开始管理啦 🔓');
}
function exitEditMode() { state.editMode = false; render(); toast('已退出编辑模式'); }

/* ---------- 编辑模式：管理员密码修改 ---------- */
function openChangePwd() {
  openModal(`
    <div class="modal-title">${ico('key', 18)} 修改管理员密码</div>
    <div class="field-label">原密码</div><input class="input pwd-input" id="cp-old" type="password" maxlength="20">
    <div class="field-label">新密码（至少 6 位）</div><input class="input pwd-input" id="cp-new" type="password" maxlength="20">
    <div class="field-label">确认新密码</div><input class="input pwd-input" id="cp-new2" type="password" maxlength="20">
    <div class="modal-actions">
      <button class="btn btn-outline" data-action="modal-close">取消</button>
      <button class="btn btn-primary" id="cp-save">保存</button>
    </div>
  `, { center: true });
  $('#cp-save').addEventListener('click', async () => {
    const oldP = $('#cp-old').value, newP = $('#cp-new').value, newP2 = $('#cp-new2').value;
    if (await sha256(oldP) !== state.settings.admin_password) return toast('原密码不对哦');
    if (newP.length < 6) return toast('新密码至少 6 位');
    if (newP !== newP2) return toast('两次输入的新密码不一致');
    try {
      await api.setSetting('admin_password', await sha256(newP));
      state.settings.admin_password = await sha256(newP);
      closeModal(); toast('密码已修改 ✅');
    } catch (e) { toast('修改失败：' + e.message); }
  });
}

/* ---------- 分类新增 / 编辑（名称 + 图标 + 马卡龙底色） ---------- */
function openCatForm(cat) {
  const isEdit = !!cat;
  let selIcon = isEdit ? (cat.icon || 'i:plate') : 'i:plate';
  let selColor = isEdit ? (cat.color || MACARON_COLORS[0]) : MACARON_COLORS[(state.categories.length) % MACARON_COLORS.length];
  const iconGrid = Object.keys(CAT_ICONS).map((k) => {
    const v = 'i:' + k;
    return `<span class="iconpick ${selIcon === v ? 'selected' : ''}" data-icon="${v}">${catIconInner(v, 30)}</span>`;
  }).join('');
  const customTile = selIcon.startsWith('data:') ? `<span class="iconpick selected" id="cat-icon-custom"><img src="${selIcon}"></span>` : '';
  const colorDots = MACARON_COLORS.map((c) => `<span class="colordot ${selColor === c ? 'selected' : ''}" data-color="${c}" style="background:${c}"></span>`).join('');
  const sheet = openModal(`
    <div class="modal-title">${ico('book', 18)} ${isEdit ? '编辑分类' : '新增分类'}</div>
    <div class="field-label">分类名称</div><input class="input" id="ca-name" placeholder="比如：甜品" maxlength="6" value="${isEdit ? esc(cat.name) : ''}">
    <div class="field-label">图标（简笔画风格，或上传图片）</div>
    <div class="iconpick-grid">${iconGrid}${customTile}<span class="iconpick" id="cat-icon-upload">${ico('camera', 20)}</span></div>
    <div class="field-label">底色（低饱和马卡龙色卡）</div>
    <div class="colordots">${colorDots}</div>
    <div class="modal-actions">
      <button class="btn btn-outline" data-action="modal-close">取消</button>
      <button class="btn btn-primary" id="ca-save">保存</button>
    </div>
  `, { center: true });
  const refreshIconSel = () => {
    sheet.querySelectorAll('.iconpick[data-icon]').forEach((el) => el.classList.toggle('selected', el.dataset.icon === selIcon));
    const custom = sheet.querySelector('#cat-icon-custom');
    if (custom) custom.classList.toggle('selected', selIcon.startsWith('data:'));
  };
  sheet.querySelectorAll('.iconpick[data-icon]').forEach((el) => el.addEventListener('click', () => { selIcon = el.dataset.icon; refreshIconSel(); }));
  sheet.querySelector('#cat-icon-upload').addEventListener('click', async () => {
    try {
      selIcon = await pickImage(300, 0.82);
      const grid = sheet.querySelector('.iconpick-grid');
      const old = sheet.querySelector('#cat-icon-custom');
      if (old) old.remove();
      grid.querySelector('#cat-icon-upload').insertAdjacentHTML('beforebegin', `<span class="iconpick selected" id="cat-icon-custom"><img src="${selIcon}"></span>`);
      sheet.querySelector('#cat-icon-custom').addEventListener('click', () => { selIcon = selIcon; });
      toast('图片已选择，记得点保存');
    } catch (e) { toast(e.message); }
  });
  sheet.querySelectorAll('.colordot').forEach((el) => el.addEventListener('click', () => {
    selColor = el.dataset.color;
    sheet.querySelectorAll('.colordot').forEach((d) => d.classList.toggle('selected', d === el));
  }));
  sheet.querySelector('#ca-save').addEventListener('click', async () => {
    const name = sheet.querySelector('#ca-name').value.trim();
    if (!name) return toast('分类名不能为空');
    try {
      if (isEdit) {
        await api.updateCategory(cat.id, { name, icon: selIcon, color: selColor });
      } else {
        await api.insertCategory({ name, icon: selIcon, color: selColor, sort_order: Math.max(0, ...state.categories.map((c) => c.sort_order)) + 1 });
      }
      await loadCore(); closeModal(); render(); toast(isEdit ? '分类已更新' : '分类已添加');
    } catch (e) { toast('保存失败：' + e.message); }
  });
}

/* ---------- 分享（二维码） ---------- */
function openShare() {
  const url = location.origin === 'null' ? location.href : location.origin + location.pathname;
  const sheet = openModal(`
    <div class="modal-title">${ico('link', 18)} 分享给家人</div>
    <div class="qr-box">
      <div id="qr-canvas"></div>
      <div class="link-text" id="share-link">${esc(url)}</div>
      <button class="btn btn-primary btn-block" id="copy-link">复制链接</button>
    </div>
  `, { center: true });
  if (window.QRCode && QRCode.toCanvas) {
    QRCode.toCanvas(sheet.querySelector('#qr-canvas'), url, { width: 210, margin: 2, color: { dark: '#3d4a35' } }, (err) => {
      if (err) sheet.querySelector('#qr-canvas').textContent = '二维码生成失败';
    });
  }
  sheet.querySelector('#copy-link').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(url); toast('链接已复制 📋'); }
    catch { toast('复制失败，请长按链接手动复制'); }
  });
}

/* =========================================================
   事件委托
   ========================================================= */
document.addEventListener('click', async (e) => {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const action = el.dataset.action;
  const id = el.dataset.id ? Number(el.dataset.id) : null;

  switch (action) {
    case 'modal-close': closeModal(); break;
    // 导航
    case 'goto-order': state.orderActiveCat = null; switchTab('order'); break;
    case 'goto-cat': state.orderActiveCat = id; switchTab('order'); break;
    // 首页
    case 'bg-settings': openBgSettings(); break;
    case 'cat-add': openCatForm(null); break;
    case 'cat-edit': {
      const c = state.categories.find((x) => x.id === id);
      if (c) openCatForm(c);
      break;
    }
    case 'cat-up': case 'cat-down': {
      const idx = state.categories.findIndex((c) => c.id === id);
      const swapIdx = action === 'cat-up' ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= state.categories.length) break;
      const a = state.categories[idx], b = state.categories[swapIdx];
      try {
        await api.updateCategory(a.id, { sort_order: b.sort_order });
        await api.updateCategory(b.id, { sort_order: a.sort_order });
        await loadCore(); render(); toast('排序已调整');
      } catch (err) { toast('操作失败：' + err.message); }
      break;
    }
    case 'cat-del': {
      const c = state.categories.find((x) => x.id === id);
      const n = state.dishes.filter((d) => d.category_id === id).length;
      if (!confirm(`删除分类「${c.name}」？其下 ${n} 道菜会一起删除，不可恢复！`)) break;
      try { await api.deleteCategory(id); await loadCore(); render(); toast('分类已删除'); }
      catch (err) { toast('删除失败：' + err.message); }
      break;
    }
    // 点单
    case 'pick-cat': state.orderActiveCat = id; render(); break;
    case 'open-dish': openDishDetail(id); break;
    case 'dish-edit': e.stopPropagation(); openDishDetail(id); break;
    case 'dish-add': openDishAdd(id); break;
    case 'toggle-fav': await toggleFav(id); if (state.tab === 'me') render(); break;
    case 'add-cart': e.stopPropagation(); addToCart(id); break;
    // 购物车
    case 'cart-plus': state.cart[el.dataset.idx].qty += 1; LS.saveCart(); updateCartBadge(); render(); break;
    case 'cart-minus': {
      const item = state.cart[el.dataset.idx];
      if (item.qty <= 1) state.cart.splice(el.dataset.idx, 1); else item.qty -= 1;
      LS.saveCart(); updateCartBadge(); render(); break;
    }
    case 'cart-del': state.cart.splice(el.dataset.idx, 1); LS.saveCart(); updateCartBadge(); render(); break;
    case 'cart-clear':
      if (confirm('确定清空购物车吗？')) { state.cart = []; LS.saveCart(); updateCartBadge(); render(); }
      break;
    case 'edit-item-note': {
      const item = state.cart[el.dataset.idx];
      openNoteModal({
        title: `${item.name} · 备注`, initialText: item.note,
        onSave: (note) => { item.note = note; LS.saveCart(); render(); },
      });
      break;
    }
    case 'submit-order': submitOrder(); break;
    // 我的
    case 'edit-profile': openEditProfile(); break;
    case 'toggle-calendar': state.calMode = !state.calMode; state.calSelected = null; render(); break;
    case 'cal-prev': case 'cal-next': {
      const cur = new Date(state.calMonth || dayKey(new Date()));
      cur.setMonth(cur.getMonth() + (action === 'cal-next' ? 1 : -1));
      state.calMonth = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, '0')}-01`;
      state.calSelected = null; render(); break;
    }
    case 'cal-pick': state.calSelected = el.dataset.key; render(); break;
    case 'order-edit': openOrderEdit(id); break;
    case 'order-del':
      if (confirm('确定删除这笔订单吗？不可恢复！')) {
        try { await api.deleteOrder(id); await loadOrders(); render(); toast('订单已删除'); }
        catch (err) { toast('删除失败：' + err.message); }
      }
      break;
    case 'fav-add-cart': addToCart(id); break;
    case 'admin-view-member': state.adminViewMember = el.dataset.id ? Number(el.dataset.id) : null; render(); break;
    case 'share': openShare(); break;
    case 'logout':
      if (confirm('切换身份将退出当前账号（数据不会丢失），确定吗？')) {
        state.member = null; state.editMode = false; LS.memberId = null;
        showRegister();
      }
      break;
    case 'enter-edit': enterEditMode(); break;
    case 'exit-edit': exitEditMode(); break;
    case 'change-pwd': openChangePwd(); break;
    case 'dog-settings': openDogSettings(); break;
  }
});

// 订单状态下拉（change 事件）
document.addEventListener('change', async (e) => {
  const el = e.target.closest('[data-action="order-status"]');
  if (!el) return;
  try { await api.updateOrderStatus(Number(el.dataset.id), el.value); await loadOrders(); toast('状态已更新为「' + el.value + '」'); }
  catch (err) { toast('更新失败：' + err.message); }
});

// 保存整单备注草稿，避免重渲染丢失
document.addEventListener('input', (e) => {
  if (e.target.id === 'order-note') state.orderNoteDraft = e.target.value;
});

function bindTabbar() {
  document.querySelectorAll('.tab-btn').forEach((b) => {
    if (b._bound) return;
    b._bound = true;
    b.addEventListener('click', async () => {
      switchTab(b.dataset.tab);
      if (b.dataset.tab === 'me') {
        try { await loadOrders(); if (state.tab === 'me') render(); } catch {}
      }
    });
  });
}

/* ---------- 初始化 ---------- */
function bindTabIcons() {
  const map = { home: 'home', order: 'order', cart: 'cart', me: 'me' };
  document.querySelectorAll('.tab-btn').forEach((b) => {
    const span = b.querySelector('.tab-icon');
    if (span && !span._svg) { span._svg = true; span.innerHTML = ico(map[b.dataset.tab] || 'plate', 24); }
  });
}

(async function init() {
  bindTabbar();
  bindTabIcons();
  try {
    await loadCore();
    applyBackground();
    if (LS.memberId) {
      state.member = state.members.find((m) => m.id === Number(LS.memberId)) || null;
    }
    if (!state.member) {
      showRegister();
      return;
    }
    state.cart = LS.loadCart();
    updateCartBadge();
    await loadOrders();
    switchTab('home');
  } catch (e) {
    $('#main').innerHTML = `<div class="empty-tip" style="padding-top:120px">
      <span class="empty-ico">🥲</span>${esc(e.message || '加载失败')}<br><br>
      <button class="btn btn-primary" onclick="location.reload()">重新加载</button></div>`;
  }
})();
