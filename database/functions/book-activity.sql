create or replace function book_activity(
    requestor_id integer,
    p_employee_id integer,
    p_activity_id uuid,
    p_date date,
    p_start_time time
)
returns bookings as $$
declare
    v_overlap boolean;
    v_new_booking bookings%rowtype;
    v_duration integer;
    v_end_time time;
begin
    -- fetch the duration of the activity
    select duration into v_duration
    from activities
    where id = p_activity_id;

    -- calculate end time
    v_end_time := p_start_time + v_duration * interval '1 minute';

    -- check for overlapping bookings
    select exists (
        select 1
        from bookings
        where employee_id = p_employee_id
        and booking_date = p_date
        and (start_time, end_time) overlaps (p_start_time, v_end_time)
    ) into v_overlap;

    if v_overlap then
        raise exception 'The booking overlaps with an existing booking.';
    else
        -- create a new booking
        insert into bookings (
            user_id,
            employee_id,
            activity_id,
            booking_date,
            start_time,
            end_time,
            status
        )
        values (
            requestor_id,
            p_employee_id,
            p_activity_id,
            p_date,
            p_start_time,
            v_end_time,
            'pending'
        )
        returning * into v_new_booking;
    end if;

    return v_new_booking;
end;
$$ language plpgsql;

-- select book_activity(
--   1,
--   2,
--   'd0c2c0e0-2b0a-4b9a-8b9a-0e0b0c2d0e0f',
--   '2021-01-01',
--   '09:00'
-- )
