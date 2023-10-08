create or replace function get_timeslots(p_activity_id uuid, p_employee_id int, p_date timestamp)
returns table(timeslot time) as $$
declare
    r_activity record;
    r_rules record;
    r_booking record;
    r_start_time time;
    r_end_time time;
    r_day_of_week int;
    r_day_name text;
begin
    -- Get the activity from the activities table
    select * into r_activity from activities where id = p_activity_id;

    -- Get the day of the week
    r_day_of_week := extract(dow from p_date);
    r_day_name := lower(trim(to_char(p_date, 'Day')));

    -- Get the operating rules for the given employee and date
    select * into r_rules from operating_rules 
    where operating_rules.employee_id = p_employee_id and operating_rules.day = r_day_name;

    -- If no operating rules found, try 'weekdays' and 'weekends'
    if not found then
        if r_day_of_week between 1 and 5 then
            select * into r_rules from operating_rules 
            where operating_rules.employee_id = p_employee_id and operating_rules.day = 'weekdays';
        else
            select * into r_rules from operating_rules 
            where operating_rules.employee_id = p_employee_id and operating_rules.day = 'weekends';
        end if;
    end if;

    -- If there are still no operating rules, return nothing
    if r_rules is null then
        return;
    end if;

    -- Calculate timeslots with interval 30 minutes
    r_start_time := greatest(r_rules.start_time, 
                              (date_trunc('hour', p_date) + 
                               ceil(date_part('minute', p_date)::float / 30) * interval '30 minutes')::time);
    r_end_time := r_rules.end_time;

    while r_start_time < r_end_time loop
        -- Check if the timeslot plus activity duration is within operating hours
        if r_start_time + r_activity.duration * interval '1 minute' > r_end_time then
            exit;
        end if;

        -- Check if the timeslot is unavailable due to a booking
        select * into r_booking from bookings 
        where bookings.employee_id = p_employee_id and bookings.booking_date = date_trunc('day', p_date)
        and bookings.status != 'cancelled' 
        and ((r_start_time >= bookings.start_time and r_start_time < bookings.end_time) 
        or (r_start_time + r_activity.duration * interval '1 minute' > bookings.start_time and r_start_time + r_activity.duration * interval '1 minute' <= bookings.end_time));

        -- If the timeslot is not booked, return it
        if not found then
            timeslot := r_start_time;
            return next;
        end if;

        -- Move to the next timeslot
        r_start_time := r_start_time + interval '30 minutes';
    end loop;
end;
$$ language plpgsql;
