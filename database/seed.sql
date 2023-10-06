create table users (
  id int primary key,
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
  id int primary key references users(id),
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
  location_id uuid references locations(id),
  coach_id uuid references employees(id),
  duration int not null,
  price int not null,
  created_at timestamptz not null default current_timestamp,
  updated_at timestamptz not null default current_timestamp
);

create table operating_rules (
  id uuid primary key default uuid_generate_v4(),
  coach_id uuid not null references employees(id),
  day text not null check (day in ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'weekdays', 'weekends')),
  start_time time not null,
  end_time time not null,
  created_at timestamptz not null default current_timestamp,
  updated_at timestamptz not null default current_timestamp
);

create table bookings (
  id uuid primary key default uuid_generate_v4(),
  activity_id uuid not null references activities(id),
  user_id int not null references users(id),
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

-- Uncomment the following lines to insert sample data
-- insert into locations (name, description, address) values ('Sample location', 'Description of sample location', 'Test Address');
