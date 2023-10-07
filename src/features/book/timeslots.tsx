import { ServerCrash } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { motion } from "framer-motion";

import { useTimeslots } from "@/hooks/timeslots";
import { formatISO } from "date-fns";

type Props = {
  activityId: string;
  employeeId: number;
  date: Date;
  selected: string | null;
  onTimeslotSelect: (timeslot: string) => void;
};

const MotionButton = motion(Button);

export const Timeslots = ({
  activityId,
  employeeId,
  date,
  selected,
  onTimeslotSelect,
}: Props) => {
  const {
    data: timeslots,
    error,
    loading,
  } = useTimeslots({
    activity_id: activityId,
    employee_id: employeeId,
    date: formatISO(date),
  });

  if (error) {
    return (
      <Alert>
        <ServerCrash className="w-4 h-4" />
        <AlertTitle>Oops, something went wrong</AlertTitle>
        <AlertDescription>
          There was an error during fetching the timeslots, please try again. If
          the problem persists, please contact the support.
        </AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 9 }).map((_, index) => (
          <Skeleton key={`skeleton-${index}`} className="w-full h-[35px]" />
        ))}
      </div>
    );
  }

  if (!timeslots?.length) {
    return (
      <div className="flex items-center justify-center border rounded-sm py-20">
        <span className="text-sm text-muted-foreground tracking-tight leading-none">
          No timeslots available for selected date
        </span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {timeslots.map(({ timeslot }, index) => (
        <MotionButton
          key={`${formatISO(date)}-${timeslot}`}
          onClick={() => onTimeslotSelect(timeslot)}
          variant={timeslot === selected ? "default" : "outline"}
          className="w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.05 * index }}
        >
          <span className="text-sm tracking-tight leading-none">
            {timeslot}
          </span>
        </MotionButton>
      ))}
    </div>
  );
};
