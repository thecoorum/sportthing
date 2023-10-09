create or replace function get_users(
  requestor_id bigint
) returns table (
  user_id bigint,
  name text,
  username text,
  photo_url text,
  description text,
  user_role text,
  location_id uuid,
  created_at timestamptz,
  updated_at timestamptz
) as $$
begin
  if exists (select 1 from employees where id = requestor_id and role = 'administrator') then
    return query
      select
        u.id,
        u.name,
        u.username,
        u.photo_url,
        e.description,
        e.role,
        e.location_id,
        u.created_at,
        u.updated_at
      from users u
      left join employees e on u.id = e.id;
  else
    raise exception 'Unauthorized';
  end if;
end
$$ language plpgsql;

-- select get_users(
--   1
-- )
