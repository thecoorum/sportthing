export type Timeslot = {
  timeslot: string;
};

export type TimeslotsResponse = {
  data: {
    timeslots: Timeslot[];
  };
};

export type TimeslotsFetcherResponse = {
  timeslots: Timeslot[];
};

export type TimeslotsParams = {
  activity_id: string;
  employee_id: number;
  date: string;
};
