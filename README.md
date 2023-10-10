## Introduction

Welcome to the sportthing repository. This is a Telegram Mini App that brings your neighborhood gym activities management to your favorite messaging app. The goal is to allow small gyms to manage their activities and members without the need of a dedicated app.

You can test already deployed version [here](https://t.me/sportthing_bot/app)

This app can offer the following features:
- Seamless authorization with Telegram (no need to create an account, all minimum required data is fetched from Telegram)
- Role managing (administrator, coach, user)
- Activities and locations management for administrators (add, edit, delete)
- Schedule management for coaches (add, edit, delete operating rules to calculate available timeslots)
- Activities booking for users (book, list (WIP), cancel (WIP))

and more to come...

## Configuration
The following instruction will help you deploy your Mini App using Vercel for hosting and Supabase for database

1. <b>Create Telegram Bot</b>

Create a Telegram bot using [Bot Father](https://t.me/botfather). Obtain and store the token for future use

2. <b>Create Vercel account</b>

Create a free Vercel accoun by visiting https://vercel.com/login

<details>
<summary>3. <b>Create and seed Supabase project</b></summary>

<br />

> **Note**<br />
> As the Supabase doesn't provide out-of-box authentication with Telegram all tables doesn't have RLS policies, but all endpoints are protected with verifying incoming query from Telegram, so this should be enough for now. If you have thoughts or suggestions on this topic reach me out at [X](https://x.com/thecoorum)

Create a [Supabase](https://supabase.com/dashboard/sign-in) account and create a new project. Obtain your supabase project URL and anon public key for future use.

As soon as your new project is ready go to SQL editor https://supabase.com/dashboard/project/(your-project-id)/sql/new to seed the database.

Use the following seed to create the required database structure
```sql
create table users (
  id bigint primary key,
  name text not null,
  username text,
  photo_url text,
  created_at timestamptz not null default current_timestamp,
  updated_at timestamptz not null default current_timestamp
);

create table locations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  address text,
  created_at timestamptz not null default current_timestamp,
  updated_at timestamptz not null default current_timestamp
);

create table employees (
  id bigint primary key references users(id) on delete cascade,
  role text not null check (role in ('administrator', 'coach')),
  description text,
  location_id uuid references locations(id),
  created_at timestamptz not null default current_timestamp,
  updated_at timestamptz not null default current_timestamp
);

create table activities (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  location_id uuid references locations(id) on delete set null,
  employee_id bigint references employees(id) on delete set null,
  duration int not null,
  price int not null,
  created_at timestamptz not null default current_timestamp,
  updated_at timestamptz not null default current_timestamp
);

create table operating_rules (
  id uuid primary key default uuid_generate_v4(),
  employee_id bigint not null references employees(id) on delete cascade,
  day text not null check (day in ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'weekdays', 'weekends')),
  start_time time not null,
  end_time time not null,
  created_at timestamptz not null default current_timestamp,
  updated_at timestamptz not null default current_timestamp
);

create table bookings (
  id uuid primary key default uuid_generate_v4(),
  activity_id uuid not null references activities(id) on delete cascade,
  employee_id bigint not null references employees(id) on delete cascade,
  user_id bigint not null references users(id) on delete cascade,
  booking_date date not null,
  start_time time not null,
  end_time time not null,
  status text not null check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz not null default current_timestamp,
  updated_at timestamptz not null default current_timestamp
);

-- Replace insertable values with the ones from https://t.me/userinfobot
insert into users (id, name, username) values (1, 'John Doe', 'johndoe');
insert into employees (user_id, role) values (1, 'administrator');
```

This project is using PostgreSQL database functions for some endpoints and operations like calculating available timeslots, confirming booking, doing administrator only actions.

You need to execute each function in SQL editor in order to make app fully functioning, else the errors will be thrown at certain API endpoints

Here is the list of the functions with links:
- `book_activity` - function used to book the activity and verify that the new booking is not overlapping with another ones (if they were created during your booking process) - [link](https://github.com/thecoorum/sportthing/blob/main/database/functions/book-activity.sql)
- `create_activity` - function used to create activities by administrator. If the function will be executed by user with non-administrator permissions the execution will be terminated with error - [link](https://github.com/thecoorum/sportthing/blob/main/database/functions/create-activity.sql)
- `create_location` - function used to create locations by administrator. If the function will be executed by user with non-administrator permissions the execution will be terminated with error - [link](https://github.com/thecoorum/sportthing/blob/main/database/functions/create-location.sql)
- `get_or_create_user` - function used for authentication purposes. If the user with the received from Telegram query ID exists, then it will be returned (joined with employee record if the one with given ID exists), else new user will be created and returned in the response - [link](https://github.com/thecoorum/sportthing/blob/main/database/functions/get-or-create-user.sql)
- `get_timeslots` - function used to calculate available timeslots for select activity at certain date. The timeslots are calculated for each 30 mins with 30 minutes padding time (that means if your current time is 14:49 you can't book activity at 15:00, but only at 15:30), but the configuration can be adjusted - [link](https://github.com/thecoorum/sportthing/blob/main/database/functions/get-timeslots.sql)
- `get_users` - function used to list all existing users by administrator - [link](https://github.com/thecoorum/sportthing/blob/main/database/functions/get-users.sql)
- `payment_handler` - function used to schedule cron job to monitor pending bookings. The function makes sense if you configured payments in your bot, in that case all bookings will be not confirmed automatically, but will require payment in 15 minutes after placing booking (the time can be configured at the API endpoint and in SQL function) - [link](https://github.com/thecoorum/sportthing/blob/main/database/functions/payment-handler.sql)
> **Note**<br />
> Currently there is an issue with the handler, so it will not work as expected. The issue is described [here](https://github.com/thecoorum/sportthing/issues/1)
- `update-user` - function used to update user information like Name, Username, Operating rules (for role coach) - [link](https://github.com/thecoorum/sportthing/blob/main/database/functions/update-user.sql)
- `upsert-operating-rules` - function used to create/update coach operating rules for timeslots calculation. Used in conjuction with `update-user` function described above - [link](https://github.com/thecoorum/sportthing/blob/main/database/functions/upsert-operating-rules.sql)

</details>
    
As soon as all listed above steps are completed you can deploy this project to Vercel using the button below. Fill in required `BOT_TOKEN`, `SUPABASE_URL` and `SUPABASE_ANON_KEY` obtained earlier. `BOT_PAYMENT_TOKEN` key used when you configured payments in your Telegram bot and want to receive payments before confirming booking. If the token is not set the bookings will be confirmed automatically

> **Note**<br />
> Enabling payment right now is not working correctly at 100% because of payment handler issue. Read more [here](https://github.com/thecoorum/sportthing/issues/1)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fthecoorum%2Fsportthing&env=BOT_TOKEN,SUPABASE_URL,SUPABASE_ANON_KEY&envDescription=You%20should%20provide%20require%20%60BOT_TOKEN%60%2C%20%60SUPABASE_URL%60%20and%20%60SUPABASE_ANON_KEY%60%20to%20be%20able%20to%20run%20your%20Telegram%20Mini%20App.%20The%20%60BOT_PAYMENT_TOKEN%60%20is%20optional%20and%20used%20to%20send%20payment%20invoices%20before%20confirming%20the%20bookings%2C%20else%20they%20will%20be%20auto-confirmed&demo-url=https%3A%2F%2Ft.me%2Fsportthing_bot%2Fapp)

After deploying of the project to Vercel, obtain assigned project URL and configure the menu button in the [Bot Father](https://t.me/botfather)
