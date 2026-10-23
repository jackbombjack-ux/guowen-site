-- 老師可在後台自行「新增教材」與「新增課程」:新增的項目由資料庫內容自動產生前台頁面。
alter table public.products
  add column if not exists meta    text,   -- 分類說明,例如「寫作素材・內文約 146 頁」
  add column if not exists tagline text;   -- 一句話標語

alter table public.courses
  add column if not exists intro      text,
  add column if not exists tagline    text,
  add column if not exists audience   text,
  add column if not exists cover_path text;

alter table public.products
  add constraint products_meta_len    check (meta    is null or char_length(meta)    <= 80),
  add constraint products_tagline_len check (tagline is null or char_length(tagline) <= 120);

alter table public.courses
  add constraint courses_intro_len    check (intro    is null or char_length(intro)    <= 1000),
  add constraint courses_tagline_len  check (tagline  is null or char_length(tagline)  <= 120),
  add constraint courses_audience_len check (audience is null or char_length(audience) <= 80);
