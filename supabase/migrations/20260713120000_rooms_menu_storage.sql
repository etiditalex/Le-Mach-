-- Public storage buckets for room and menu item photos (uploads via service role API)

insert into storage.buckets (id, name, public, file_size_limit)
values ('rooms', 'rooms', true, 5242880)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit;

insert into storage.buckets (id, name, public, file_size_limit)
values ('menu-items', 'menu-items', true, 5242880)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit;
