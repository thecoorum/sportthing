create or replace function get_or_create_user(
  requestor_id integer,
  name text,
  username text,
  photo_url text default null
) returns record as $$
declare
  user_record record;
  employee_record record;
begin
  -- Check if user exists
  select * into user_record from users where id = requestor_id;

  -- If user does not exist, create user
  if not found THEN
    insert into users (id, name, username, photo_url) values (requestor_id, name, username, photo_url);
  end if;

  -- Find employee
  select * into employee_record from employees where id = requestor_id;

  -- If employee exists join user with employee, else return just user
  if found THEN
    select u.*, e.* into user_record from users u join employees e on u.id = e.id where u.id = requestor_id;
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
