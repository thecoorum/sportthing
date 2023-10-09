create or replace function get_or_create_user(
  requestor_id bigint,
  name text,
  username text,
  photo_url text default null
) returns record as $$
declare
  user_record record;
  employee_record record;
  operating_rules_records operating_rule[];
begin
  -- Check if user exists
  select * into user_record from users where id = requestor_id;

  -- If user does not exist, create user and return it
  if not found THEN
    insert into users (id, name, username, photo_url) values (requestor_id, name, username, photo_url);
    select * into user_record from users where id = requestor_id;
    return user_record;
  end if;

  -- Find employee
  select * into employee_record from employees where id = requestor_id;

  -- If employee exists search for operating rules by employee id, then join all data with user
  if found then
    select array_agg((id, employee_id, day, start_time, end_time)::operating_rule) into operating_rules_records from operating_rules where employee_id = requestor_id;

    select
        u.id,
        u.name,
        u.username,
        u.photo_url,
        e.description,
        e.role,
        e.location_id,
        operating_rules_records as operating_rules,
        u.created_at,
        u.updated_at
      into user_record
      from users u
      left join employees e on u.id = e.id
      where u.id = requestor_id;
  end if;

  return user_record;
end
$$ language plpgsql;

-- select get_or_create_user(
--   1,
--   'John Doe',
--   'johndoe',
--   'https://t.me/i/userpic/320/johndoe.jpg'
-- )
