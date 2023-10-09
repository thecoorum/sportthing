create or replace function update_user(
  requestor_id bigint,
  requestor_name text,
  requestor_username text default null,
  requestor_description text default null,
  operating_rules operating_rule[] default null
) returns record as $$
declare
  user_record record;
  employee_record record;
  operating_rules_records operating_rule[];
begin
  -- Check if user exists
  select * into user_record from users where id = requestor_id;

  -- If user does not exist, return error
  if not found then
    raise exception 'User not found';
  end if;

  -- Update user
  update users set
    name = requestor_name,
    username = requestor_username,
    updated_at = now()
  where id = requestor_id;

  -- If employee with requestor id exists, update employee
  select * into employee_record from employees where id = requestor_id;

  if found then
    update employees set
      description = requestor_description,
      updated_at = now()
    where id = requestor_id;
  end if;

  -- If operating rules are provided, upsert them
  if operating_rules is not null then
    select upsert_operating_rules(requestor_id, operating_rules) into operating_rules_records;
  end if;

  -- Return user
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

  return user_record;
end
$$ language plpgsql;

-- select update_user(
--   1,
--   'John Doe',
--   'johndoe',
--   'I am a software engineer',
--   array[
--     row('d0c2c0e0-2b0a-4b9a-8b9a-0e0b0c2d0e0f', 1, 'monday', '09:00', '17:00')::operating_rule,
--     row(null, 1, 'tuesday', '09:00', '17:00')::operating_rule
--   ]
-- )