create
or replace function upsert_operating_rules (rules operating_rules[]) returns table (
  inserted operating_rules[],
  updated operating_rules[]
) as $$
BEGIN
    INSERT INTO operating_rules (id, coach_id, day, start_time, end_time, created_at, updated_at)
    SELECT r.id, r.coach_id, r.day, r.start_time, r.end_time, r.created_at, r.updated_at
    FROM unnest(rules) AS r
    ON CONFLICT (id) DO UPDATE
    SET coach_id = excluded.coach_id,
        day = excluded.day,
        start_time = excluded.start_time,
        end_time = excluded.end_time,
        updated_at = excluded.updated_at
    RETURNING *
    INTO inserted;

    SELECT *
    FROM unnest(rules) AS r
    WHERE r.id IS NOT NULL
    INTO updated;

    RETURN;
END;
$$ language plpgsql;