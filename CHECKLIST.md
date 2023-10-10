### API
- [ ] Do not allow coaches without `location_id`
- [ ] Allow coaches to create activities
  - [ ] Allow to do this only for their own location
- [ ] Enforce bookings to have `location_id`
- [ ] Add mechanism for required payment before booking

### UI
- [ ] Add external user page
- [ ] Add location selection during booking process
- [ ] Conditionally show activities if the locations amount is 1 (hide locations in that case)
- [ ] Add user's bookings to the home page

### Other
- [ ] Debug payment handler Postgres function, so it doesn't run before the set interval
