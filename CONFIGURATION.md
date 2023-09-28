### Database

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'coach', 'admin')),
  username TEXT NOT NULL
);

CREATE TABLE locations (
  id UUID PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT
);

CREATE TABLE activities (
  id UUID PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  location_id UUID NOT NULL REFERENCES locations(id),
  coach_id INTEGER NOT NULL REFERENCES coaches(id),
  duration INTEGER NOT NULL,
  price INTEGER NOT NULL
);

CREATE TABLE coaches (
  id INTEGER PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  location_id UUID NOT NULL REFERENCES locations(id)
);

CREATE TABLE operating_rules (
  id UUID PRIMARY KEY NOT NULL,
  coach_id INTEGER NOT NULL REFERENCES coaches(id),
  day TEXT NOT NULL CHECK (day IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'weekdays', 'weekends', 'all')),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL
);

CREATE TABLE bookings (
  id UUID PRIMARY KEY NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users(id),
  activity_id UUID NOT NULL REFERENCES activities(id),
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled'))
);
```