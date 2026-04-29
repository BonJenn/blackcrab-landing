create table if not exists downloads (
  id        bigserial primary key,
  platform  text        not null,
  version   text        not null,
  created_at timestamptz not null default now()
);

create index if not exists downloads_platform_idx   on downloads (platform);
create index if not exists downloads_version_idx    on downloads (version);
create index if not exists downloads_created_at_idx on downloads (created_at);

-- Aggregate stats returned in one RPC call to avoid N+1 queries from the admin page.
create or replace function get_download_stats()
returns json
language sql
security definer
as $$
  select json_build_object(
    'total', (
      select count(*) from downloads
    ),
    'by_platform', (
      select coalesce(json_object_agg(platform, cnt), '{}'::json)
      from (select platform, count(*) as cnt from downloads group by platform) t
    ),
    'by_version', (
      select coalesce(
        json_agg(json_build_object('version', version, 'count', cnt) order by cnt desc),
        '[]'::json
      )
      from (select version, count(*) as cnt from downloads group by version) t
    ),
    'by_combo', (
      select coalesce(
        json_agg(
          json_build_object('platform', platform, 'version', version, 'count', cnt)
          order by cnt desc
        ),
        '[]'::json
      )
      from (select platform, version, count(*) as cnt from downloads group by platform, version) t
    ),
    'daily_last_30', (
      select coalesce(
        json_agg(json_build_object('day', day, 'count', cnt) order by day),
        '[]'::json
      )
      from (
        select date_trunc('day', created_at)::date as day, count(*) as cnt
        from downloads
        where created_at >= now() - interval '30 days'
        group by day
      ) t
    )
  );
$$;
