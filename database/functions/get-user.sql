create or replace function get_user(
  requestor_id bigint,
  user_id bigint
) returns table  as $$
declare
  user json;
begin
  if exists (select 1 from employees where id = requestor_id and role = 'administrator') then
    -- query for user, join with employees, bookings, activities
    select
      json_build_object(
        'id', u.id,
        'name', u.name,
        'username', u.username,
        'photo_url', u.photo_url,
        'employee', json_build_object(
          'description', e.description,
          'role', e.role,
          'location_id', e.location_id
        ),
        'bookings', json_agg(
          json_build_object(
            'id', b.id,
            'activity_id', b.activity_id,
            'start_time', b.start_time,
            'end_time', b.end_time
          )
        ),
        'activities', json_agg(
          json_build_object(
            'id', a.id,
            'name', a.name,
            'description', a.description,
            'location_id', a.location_id
          )
        ),
        'operating_rules', json_agg(
          json_build_object(
            'id', opr.id,
            'day_of_week', opr.day_of_week,
            'start_time', opr.start_time,
            'end_time', opr.end_time
          )
        ),
        'created_at', u.created_at,
        'updated_at', u.updated_at
      )
      into user
      from users u
      left join employees e on u.id = e.id
      left join bookings b on u.id = b.user_id
      left join activities a on u.id = a.employee_id
      left join operating_rules opr on u.id = opr.employee_id
      where u.id = user_id
      group by u.id, e.id;
  else
    raise exception 'Unauthorized';
  end if;
end
$$ language plpgsql;

-- select get_user(
--   1,
--   1
-- )
