import { Calendar as CalendarComponent } from "@/components/ui/calendar";

import { motion } from "framer-motion";
import { addMonths, differenceInCalendarDays } from "date-fns";

type Props = {
  selected: Date | null;
  onDateSelect: (date: Date) => void;
};

const isPastDate = (date: Date) => {
  return differenceInCalendarDays(date, new Date()) < 0;
};

export const Calendar = ({ selected, onDateSelect }: Props) => (
  <motion.div
    initial={{ opacity: 0, translateY: 20 }}
    animate={{ opacity: 1, translateY: 0 }}
    exit={{ opacity: 0, translateY: 20 }}
    transition={{ duration: 0.3 }}
    className="space-y-3"
  >
    <h2 className="text-lg font-medium leading-none tracking-tight">
      Date and time
    </h2>
    <CalendarComponent
      mode="single"
      selected={selected || new Date()}
      fromDate={new Date()}
      toDate={addMonths(new Date(), 1)}
      hidden={isPastDate}
      onDayClick={onDateSelect}
      showOutsideDays={false}
    />
  </motion.div>
);
