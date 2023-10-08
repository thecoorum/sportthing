"use client";

import { useEffect, useState } from "react";

import { ServerCrash, ChevronLeft, Loader2 } from "lucide-react";
import { Skeleton } from "./skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PlainActivity } from "@/components/ui/activity";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/features/book/calendar";
import { Employees } from "@/features/book/employee";
import { Timeslots } from "@/features/book/timeslots";

import Link from "next/link";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatISO, isEqual, isSameDay, format } from "date-fns";
import { motion } from "framer-motion";

import { useActivity } from "@/hooks/activities";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useApi } from "@/hooks/useApi";
import { useToast } from "@/components/ui/use-toast";

import { cn } from "@/utils";

const schema = zod.object({
  id: zod.string().uuid(),
  employee_id: zod.number().int(),
  date: zod.date(),
  timeslot: zod.string().regex(/^\d{2}:\d{2}:\d{2}$/),
});

const Page = () => {
  const [submitting, setSubmitting] = useState<boolean>(false);

  const searchParams = useSearchParams();

  const api = useApi();
  const { toast } = useToast();

  const router = useRouter();

  const {
    data: activity,
    error,
    loading,
  } = useActivity(searchParams.get("activity"));

  const form = useForm<zod.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: searchParams.get("activity") || "",
      employee_id: activity?.employee_id || undefined,
    },
    reValidateMode: "onChange",
  });

  const [id, employee, date, timeslot] = form.watch([
    "id",
    "employee_id",
    "date",
    "timeslot",
  ]);

  const canSubmit = !!id && !!employee && !!date && !!timeslot;

  useEffect(() => {
    if (activity) {
      form.reset({
        id: activity.id,
        employee_id: activity.employee_id || undefined,
        date: new Date(),
      });
    }
  }, [form, activity]);

  const handleBookActivity = () => {
    setSubmitting(true);

    api
      .post("/book", {
        employee_id: employee,
        activity_id: id,
        date: formatISO(date),
        timeslot,
      })
      .then(() => {
        toast({
          title: "Activity booked",
          description: `We will be waiting for you on ${format(
            date,
            "MMMM do yyyy"
          )} at ${timeslot}!`,
        });

        router.replace("/");
      })
      .catch((error: Error) => {
        toast({
          title: "Could not book activity",
          description: error.message,
        });
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const handleSelectEmployee = (id: number) => {
    form.setValue("employee_id", id);
  };

  const handleDeselectEmployee = () => {
    form.reset({
      id: activity?.id,
      date: new Date(),
    });
  };

  const handleSelectDate = (input: Date) => {
    if (!isEqual(input, date)) {
      form.setValue("timeslot", "");
    }

    if (isSameDay(input, new Date())) {
      input = new Date();
    }

    form.setValue("date", input);
  };

  const handleSelectTimeslot = (timeslot: string) => {
    form.setValue("timeslot", timeslot);
  };

  if (error) {
    return (
      <Alert>
        <ServerCrash className="w-4 h-4" />
        <AlertTitle>Oops, something went wrong</AlertTitle>
        <AlertDescription>
          There was an error during fetching the activity, please try again. If
          the problem persists, please contact the support.
        </AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return <Skeleton />;
  }

  if (!activity) {
    return (
      <Alert>
        <ServerCrash className="w-4 h-4" />
        <AlertTitle>Activity not found</AlertTitle>
        <AlertDescription>
          The activity you are looking for does not exist. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-3.5 pb-20">
      <Link
        href={`/activities/${searchParams.get("activity")}`}
        className="flex items-center space-x-1"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="text-sm">{activity.name}</span>
      </Link>
      <PlainActivity data={activity} />
      {!activity.employee_id && (
        <Employees
          onSelect={handleSelectEmployee}
          onDeselect={handleDeselectEmployee}
          selected={employee}
        />
      )}
      <div>
        {!!employee && (
          <Calendar selected={date} onDateSelect={handleSelectDate} />
        )}
        {!!date && !!employee && (
          <Timeslots
            activityId={id}
            employeeId={employee}
            date={date}
            selected={timeslot}
            onTimeslotSelect={handleSelectTimeslot}
          />
        )}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: canSubmit ? 1 : 0,
        }}
        transition={{ type: "spring" }}
        className={cn(
          "sticky bottom-0 py-4 bg-white/60 backdrop-blur-smp",
          !canSubmit && "pointer-events-none"
        )}
      >
        <Button
          disabled={!canSubmit || submitting}
          onClick={handleBookActivity}
          className="w-full"
          size="lg"
        >
          {submitting && (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Booking
            </>
          )}
          {!submitting && "Book activity"}
        </Button>
      </motion.div>
    </div>
  );
};

export default Page;
