import { Calendar as CalendarComponent } from "@/components/ui/calendar";

import { differenceInCalendarDays } from "date-fns";

type Props = {
  onDateSelect: (date: Date) => void;
};

const isPastDate = (date: Date) => {
  return differenceInCalendarDays(date, new Date()) < 0;
};

export const Calendar = ({ onDateSelect }: Props) => (
  <CalendarComponent
    mode="single"
    fromDate={new Date()}
    components={{
      Head: () => null
    }}
    hidden={isPastDate}
    onDayClick={onDateSelect}
    showOutsideDays={false}
  />
);
