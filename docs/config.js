/* ===== 站台設定:上線前請在這裡填入(都是可以公開的值) =====
 * supabaseUrl       Supabase 專案網址,例如 https://abcdxyz.supabase.co
 * supabaseAnonKey   Supabase 的 anon public key(可公開,權限由資料庫規則控管)
 * gaId              Google Analytics 4 代碼,例如 G-XXXXXXXXXX(可留空)
 * vapidPublicKey    手機推播的公開金鑰(留空則會員專區不顯示「手機通知」)
 * LINE 與 YouTube 連結不用寫在這裡,老師可在後台「設定」自行修改
 * 注意:絕對不要把 service_role 金鑰或綠界的 HashKey / HashIV 放在這裡。
 */
window.GW = window.GW || {};
window.GW.config = {
  supabaseUrl: 'https://tnzzsxftjekxevkzhadc.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuenpzeGZ0amVreGV2a3poYWRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI2NDgyNDcsImV4cCI6MjEwODIyNDI0N30.wP8VcLKhM5H-u79M51Ii9R8TnInaJcjyLEQK7zQM46E',
  gaId: '',
  vapidPublicKey: 'BGmWfBG9nvtbDyBLGhR-1GrxGKsEG_9Bi6d05OSX2VrmkQEgJzwz82tg_cd13tUFNUCQVsd_bjbeHw6GZdqU-hw',  // 手機推播用的公開金鑰(可公開;私鑰只放在 Supabase 後台)
  lineUrl: '',
  youtubeUrl: ''
};
