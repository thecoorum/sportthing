create type operating_rule as (
  id uuid,
  employee_id bigint,
  day text,
  start_time time,
  end_time time
);

create or replace function upsert_operating_rules(
  requestor_id bigint,
  upserted_operating_rules operating_rule[]
) returns operating_rule[] as $$
declare
  operating_rule_record operating_rule;
begin
  foreach operating_rule_record in array upserted_operating_rules LOOP
    if operating_rule_record.id is not null then
      update operating_rules set
        employee_id = requestor_id,
        day = operating_rule_record.day,
        start_time = operating_rule_record.start_time,
        end_time = operating_rule_record.end_time,
        updated_at = now()
      where id = operating_rule_record.id;
    else
      insert into operating_rules (employee_id, day, start_time, end_time)
      values (requestor_id, operating_rule_record.day, operating_rule_record.start_time, operating_rule_record.end_time);
    end if;
  end loop;
  return upserted_operating_rules;
end
$$ language plpgsql;

-- select upsert_operating_rules(1, array[
--   row('d0c2c0e0-2b0a-4b9a-8b9a-0e0b0c2d0e0f', 1, 'monday', '09:00', '17:00')::operating_rule,
--   row(null, 1, 'tuesday', '09:00', '17:00')::operating_rule
-- ])
