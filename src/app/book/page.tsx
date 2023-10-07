"use client";

import { useEffect } from "react";

import { ServerCrash, ChevronLeft } from "lucide-react";
import { Skeleton } from "./skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PlainActivity } from "@/components/ui/activity";
import { Calendar } from "@/features/book/calendar";
import { Employees } from "@/features/book/employee";

import Link from "next/link";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import format from "date-fns/format";

import { useActivity } from "@/hooks/activities";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

const schema = zod.object({
  id: zod.string().uuid(),
  employee_id: zod.number().int().or(zod.undefined()),
  date: zod.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  timeslot: zod.string().regex(/^\d{2}:\d{2}$/),
});

const Page = () => {
  const searchParams = useSearchParams();

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
  });

  useEffect(() => {
    if (activity) {
      form.reset({
        id: activity.id,
        employee_id: activity.employee_id || undefined,
      });
    }
  }, [form, activity]);

  const handleSelectEmployee = (id: number) => {
    form.setValue("employee_id", id);
  };

  const handleDeselectEmployee = () => {
    form.setValue("employee_id", undefined);
  };

  const handleSelectDate = (date: Date) => {
    form.setValue("date", format(date, "yyyy-MM-dd"));
  };

  console.log(form.watch("date"));

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
    <div className="space-y-3.5">
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
          selected={form.watch("employee_id")}
        />
      )}
      {!!form.watch("employee_id") && (
        <Calendar
          selected={new Date(form.watch("date"))}
          onDateSelect={handleSelectDate}
        />
      )}
    </div>
  );
};

export default Page;
