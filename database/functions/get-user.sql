create type booking as (
  id uuid,
  activity_id uuid,
  booking_date date,
  start_time time,
  end_time time,
  status text,
  created_at timestamp,
  updated_at timestamp
);

create type activity as (
  id uuid,
  name text,
  description text,
  location_id uuid,
  duration integer,
  price integer,
  created_at timestamp,
  updated_at timestamp
);

create or replace function get_user(
  requestor_id bigint,
  user_id bigint
) returns record as $$
declare
  user_record record;
  user_activities activity[];
  user_bookings booking[];
  user_operating_rules operating_rule[];
begin
  if exists (select 1 from employees where id = requestor_id and role = 'administrator') then
    select array_agg((id, name, description, location_id, duration, price, created_at, updated_at)::activity) into user_activities from activities where employee_id = user_id;
    select array_agg((id, activity_id, booking_date, start_time, end_time, status, created_at, updated_at)::booking) into user_bookings from bookings where employee_id = user_id or user_id = user_id;
    select array_agg((id, day, start_time, end_time, created_at, updated_at)::operating_rule) into user_operating_rules from operating_rules where employee_id = user_id;

    select
        u.id,
        u.name,
        u.username,
        u.photo_url,
        e.description,
        e.role,
        e.location_id,
        user_activities as activities,
        user_bookings as bookings,
        user_operating_rules as operating_rules,
        u.created_at,
        u.updated_at
      into user_record
      from users u
      left join employees e on u.id = e.id
      where u.id = user_id;

    return user_record;
  else
    raise exception 'Unauthorized';
  end if;
end
$$ language plpgsql;

-- select get_user(
--   1,
--   1
-- )
