### API
- [x] Add API for available timeslots
- [x] Add API for booking activities
- [x] Connect editing operating rules to API
- [x] Enable operating rules on profile page only to role `coach`
- [ ] Do not allow coaches without `location_id`
- [ ] Allow coaches to create activities only for their location
- [ ] Enforce bookings to have `location_id`
- [ ] Add mechanism for required payment before booking

### UI
- [ ] Add external user page
- [ ] Add location selection during booking process
- [ ] Conditionally show activities if the locations amount is 1 (hide locations in that case)
- [x] Load all bookings, activities for that user (also operating rules if the user role is `coach`)
- [x] Add welcome page where data collection is explained
- [x] Make edit profile form footer sticky

### Other
- [ ] Debug payment handler Postgres function, so it doesn't run before the set interval
