create or replace function create_activity(
  requestor_id integer,
  activity_name text,
  activity_duration integer,
  activity_price integer,
  activity_description text default null,
  activity_location_id uuid default null,
  activity_employee_id integer default null
) returns record as $$
declare
  activity record;
begin
  if exists (select 1 from employees where id = requestor_id and role = 'administrator')
    -- TODO: Add validation that the provided employee_id is an employee with role 'coach'
    then
      insert into activities (name, duration, price, description, location_id, employee_id) values (activity_name, activity_duration, activity_price, activity_description, activity_location_id, activity_employee_id) returning * into activity;
      return activity;
  else
    raise exception 'Unauthorized';
  end if;
end
$$ language plpgsql;

-- select create_activity(
--   1,
--   'Name',
--   60,
--   25000,
--   -- the following are optional
--   'Some description',
--   'd0c2c0e0-2b0a-4b9a-8b9a-0e0b0c2d0e0f', -- location_id
--   1 -- employee_id
-- )
