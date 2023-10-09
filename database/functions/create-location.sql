create or replace function create_location(
  requestor_id bigint,
  location_name text,
  location_description text default null,
  location_address text default null
) returns record as $$
declare
  location record;
begin
  if exists (select 1 from employees where id = requestor_id and role = 'administrator')
    then
      insert into locations (name, description, address) values (location_name, location_description, location_address) returning * into location;
      return location;
  else
    raise exception 'Unauthorized';
  end if;
end
$$ language plpgsql;

-- select create_location(
--   1,
--   'Name',
--   -- the following are optional
--   'Some description',
--   'Some address'
-- )