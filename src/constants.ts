interface IStatusMap {
  [key: string]: string;
}

export const statuses: IStatusMap = {
  administrator: "Administrator",
  coach: "Coach",
  user: "User",
};

export const days = [
  { name: "Sunday", value: "sunday" },
  { name: "Monday", value: "monday" },
  { name: "Tuesday", value: "tuesday" },
  { name: "Wednesday", value: "wednesday" },
  { name: "Thursday", value: "thursday" },
  { name: "Friday", value: "friday" },
  { name: "Saturday", value: "saturday" },
  { name: "Weekdays", value: "weekdays" },
  { name: "Weekends", value: "weekends" },
];