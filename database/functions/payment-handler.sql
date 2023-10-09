create extension if not exists pg_cron with schema extensions;
create extension if not exists http with schema extensions;

create or replace function send_telegram_message(chat_id integer)
returns jsonb as $$
declare
  response jsonb;
begin
  -- Send the HTTP request to the Telegram bot
  select http_post(
    'https://api.telegram.org/bot<telegram-bot-token>/sendMessage',
    '{ "chat_id": "' || chat_id || '", "text": "Your booking has been cancelled because you did not pay within 15 minutes." }',
    'multipart/form-data'
  ) into response;

  return response;
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

    -- If the booking is more than 5 minutes old, cancel it and send a message to the Telegram bot
    if booking_age > interval '5 minutes' then
      update bookings set status = 'cancelled', updated_at = now() where id = booking_row.id;

      perform send_telegram_message(booking_row.user_id);
    end if;

    perform pg_sleep(1);
  end loop;
end;
$$ language plpgsql;

-- If you are going to change the schedule, you need to unschedule the old one first
select cron.unschedule('check_booking_status');

select cron.schedule(
  'check_booking_status',
  '*/2 * * * *',
  $$
    perform check_booking_status();
  $$
);
