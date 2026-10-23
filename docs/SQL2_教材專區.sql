-- 自學教材的「專區」(例如 高中、國中、國小、國家考試):老師可在後台自己新增、改名、排序,並把教材放進不同專區。
create table if not exists public.product_categories (
  id         text primary key,
  name       text not null check (char_length(name) between 1 and 20),
  subtitle   text check (subtitle is null or char_length(subtitle) <= 60),
  sort       int  not null default 0,
  created_at timestamptz not null default now()
);
alter table public.product_categories enable row level security;
drop policy if exists cats_read on public.product_categories;
create policy cats_read on public.product_categories for select to anon, authenticated using (true);
drop policy if exists cats_admin on public.product_categories;
create policy cats_admin on public.product_categories for all to authenticated using (public.is_admin()) with check (public.is_admin());
revoke all on public.product_categories from anon, authenticated;
grant select on public.product_categories to anon, authenticated;
grant insert, update, delete on public.product_categories to authenticated;

-- 教材屬於哪個專區(專區被刪除時,教材不會消失,只是變成「未分類」)
alter table public.products
  add column if not exists category_id text references public.product_categories(id) on delete set null;

-- 原本的兩個專區與教材歸屬
insert into public.product_categories (id, name, subtitle, sort) values
  ('high',   '高中', '學測國文、國寫與古文', 1),
  ('junior', '國中', '會考作文:功法篇與素材篇', 2)
on conflict (id) do nothing;

update public.products set category_id = 'high'   where id in ('tulong', 'yitian', 'notes', 'gaokao') and category_id is null;
update public.products set category_id = 'junior' where id in ('jhfa', 'jhsu') and category_id is null;
