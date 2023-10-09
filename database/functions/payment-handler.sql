create
or replace function send_telegram_message (chat_id bigint) returns void as $$
begin
  -- Send the HTTP request to the Telegram bot
  perform http_post(
    'https://api.telegram.org/bot<your-bot-token>/sendMessage',
    jsonb_build_object(
      'chat_id', chat_id,
      'text', 'Your booking has been cancelled because you did not pay within 15 minutes.'
    )
  );
end;
$$ language plpgsql;

create or replace function check_booking_status()
returns void as $$
declare
  booking_row bookings%rowtype;
  booking_age interval;
begin
  -- Loop through all pending bookings
  for booking_row in select * from bookings where status = 'pending' loop
    -- Calculate the age of the booking
    booking_age := now() - booking_row.created_at;

    -- If the booking is more than 15 minutes old, cancel it and send a message to the Telegram bot
    if booking_age > interval '15 minutes' then
      update bookings set status = 'cancelled', updated_at = now() where id = booking_row.id;

      perform send_telegram_message(booking_row.user_id);
    end if;

    perform pg_sleep(1);
  end loop;

  return;
end;
$$ language plpgsql;

-- Uncomment the line if you are going to change the schedule or functions and want to remove the old schedule
-- select cron.unschedule('handle-stale-bookings');

select cron.schedule(
  'handle-stale-bookings',
  '*/2 * * * *',
  $$
    select check_booking_status();
  $$
);
