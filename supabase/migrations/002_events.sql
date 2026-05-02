create table if not exists events (
  id           bigserial primary key,
  event_type   text        not null,
  platform     text,
  version      text,
  from_version text,
  to_version   text,
  install_hash text,
  source       text,
  user_agent   text,
  metadata     jsonb       not null default '{}'::jsonb,
  created_at   timestamptz not null default now(),
  constraint events_event_type_check check (
    event_type in (
      'download_redirect',
      'app_launch',
      'update_check',
      'update_started',
      'update_completed',
      'update_failed'
    )
  )
);

create index if not exists events_event_type_idx   on events (event_type);
create index if not exists events_platform_idx     on events (platform);
create index if not exists events_version_idx      on events (version);
create index if not exists events_from_version_idx on events (from_version);
create index if not exists events_to_version_idx   on events (to_version);
create index if not exists events_install_hash_idx on events (install_hash);
create index if not exists events_created_at_idx   on events (created_at);

insert into events (event_type, platform, version, source, created_at)
select 'download_redirect', platform, version, 'legacy_downloads', created_at
from downloads d
where not exists (
  select 1
  from events e
  where e.event_type = 'download_redirect'
    and e.source = 'legacy_downloads'
    and e.platform = d.platform
    and e.version = d.version
    and e.created_at = d.created_at
);

create or replace function get_event_stats()
returns json
language sql
security definer
as $$
  with latest_launch as (
    select distinct on (install_hash)
      install_hash,
      coalesce(version, from_version, 'unknown') as version,
      created_at
    from events
    where event_type = 'app_launch'
      and install_hash is not null
      and created_at >= now() - interval '30 days'
    order by install_hash, created_at desc
  )
  select json_build_object(
    'total', (
      select count(*) from events where event_type = 'download_redirect'
    ),
    'total_download_redirects', (
      select count(*) from events where event_type = 'download_redirect'
    ),
    'by_platform', (
      select coalesce(json_object_agg(platform, cnt), '{}'::json)
      from (
        select coalesce(platform, 'unknown') as platform, count(*) as cnt
        from events
        where event_type = 'download_redirect'
        group by coalesce(platform, 'unknown')
      ) t
    ),
    'by_version', (
      select coalesce(
        json_agg(json_build_object('version', version, 'count', cnt) order by cnt desc),
        '[]'::json
      )
      from (
        select coalesce(version, 'unknown') as version, count(*) as cnt
        from events
        where event_type = 'download_redirect'
        group by coalesce(version, 'unknown')
      ) t
    ),
    'by_combo', (
      select coalesce(
        json_agg(
          json_build_object('platform', platform, 'version', version, 'count', cnt)
          order by cnt desc
        ),
        '[]'::json
      )
      from (
        select
          coalesce(platform, 'unknown') as platform,
          coalesce(version, 'unknown') as version,
          count(*) as cnt
        from events
        where event_type = 'download_redirect'
        group by coalesce(platform, 'unknown'), coalesce(version, 'unknown')
      ) t
    ),
    'daily_last_30', (
      select coalesce(
        json_agg(json_build_object('day', day, 'count', cnt) order by day),
        '[]'::json
      )
      from (
        select date_trunc('day', created_at)::date as day, count(*) as cnt
        from events
        where event_type = 'download_redirect'
          and created_at >= now() - interval '30 days'
        group by day
      ) t
    ),
    'events_by_type', (
      select coalesce(
        json_agg(json_build_object('event_type', event_type, 'count', cnt) order by event_type),
        '[]'::json
      )
      from (
        select event_type, count(*) as cnt
        from events
        group by event_type
      ) t
    ),
    'update_funnel', (
      select coalesce(
        json_agg(json_build_object('event_type', event_type, 'count', cnt) order by sort_order),
        '[]'::json
      )
      from (
        select event_type, sort_order, count(e.id) as cnt
        from (
          values
            ('update_check', 1),
            ('update_started', 2),
            ('update_completed', 3),
            ('update_failed', 4)
        ) expected(event_type, sort_order)
        left join events e using (event_type)
        group by event_type, sort_order
      ) t
    ),
    'update_checks', (
      select coalesce(
        json_agg(
          json_build_object(
            'from_version', from_version,
            'to_version', to_version,
            'count', cnt
          )
          order by cnt desc
        ),
        '[]'::json
      )
      from (
        select
          coalesce(from_version, version, 'unknown') as from_version,
          coalesce(to_version, 'unknown') as to_version,
          count(*) as cnt
        from events
        where event_type = 'update_check'
        group by
          coalesce(from_version, version, 'unknown'),
          coalesce(to_version, 'unknown')
      ) t
    ),
    'updates_completed_by_version', (
      select coalesce(
        json_agg(json_build_object('version', version, 'count', cnt) order by cnt desc),
        '[]'::json
      )
      from (
        select coalesce(to_version, version, 'unknown') as version, count(*) as cnt
        from events
        where event_type = 'update_completed'
        group by coalesce(to_version, version, 'unknown')
      ) t
    ),
    'updates_completed_by_combo', (
      select coalesce(
        json_agg(
          json_build_object(
            'from_version', from_version,
            'to_version', to_version,
            'count', cnt
          )
          order by cnt desc
        ),
        '[]'::json
      )
      from (
        select
          coalesce(from_version, 'unknown') as from_version,
          coalesce(to_version, version, 'unknown') as to_version,
          count(*) as cnt
        from events
        where event_type = 'update_completed'
        group by
          coalesce(from_version, 'unknown'),
          coalesce(to_version, version, 'unknown')
      ) t
    ),
    'active_installs_total', (
      select count(*) from latest_launch
    ),
    'active_by_version', (
      select coalesce(
        json_agg(json_build_object('version', version, 'count', cnt) order by cnt desc),
        '[]'::json
      )
      from (
        select version, count(*) as cnt
        from latest_launch
        group by version
      ) t
    )
  );
$$;

create or replace function get_download_stats()
returns json
language sql
security definer
as $$
  select get_event_stats();
$$;
