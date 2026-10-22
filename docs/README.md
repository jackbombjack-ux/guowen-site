# 國文滿級分專業工作室 官網(正式版)

靜態網站(GitHub Pages)+ Supabase(登入、資料庫、檔案、後端函式)+ 綠界(收款)。

```
docs/               網站成品(GitHub Pages 發佈這個資料夾)
supabase/
  migrations/       資料庫(依檔名順序執行)
  seed.sql          教材、課程、方案、資源的初始資料
  functions/        4 個後端函式:建立訂單、綠界通知 ×2、取消訂閱
  tests/            資料庫權限測試、綠界簽章與付款流程測試
web-tests/          前端整合測試(假 Supabase + 真瀏覽器)
SETUP.md            上線步驟(請照順序做)
```

## 運作方式

- 所有「誰能看什麼」由資料庫規則(RLS)決定,不是靠前端藏起來:會員直播連結、課程影片代碼、作文照片、訂單都只有該有權限的人讀得到。
- 價格一律在後端函式重新計算,瀏覽器傳來的金額不會被採用。
- 綠界付款成功通知 → 後端驗證簽章與金額 → 自動開通(會員 / 課程 / 教材出貨單)。同一筆通知重送不會重複開通。
- 付費會員:信用卡定期定額。每期扣款成功,有效期往後延長;扣款失敗有 3 天寬限。
- 老師後台:`admin_emails` 表內的 Google 帳號第一次登入就成為老師。

## 本機測試

```bash
# 資料庫權限(需要本機 PostgreSQL)
PGHOST=/tmp PGPORT=5433 PGUSER=postgres bash supabase/tests/run.sh
# 綠界簽章與付款流程
node --test --experimental-strip-types supabase/tests/*.test.ts
# 前端整合(需要 playwright + chromium)
python3 web-tests/e2e.py
```
