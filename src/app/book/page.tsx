"use client";

import { useCallback, useEffect, useState } from "react";

import { ServerCrash } from "lucide-react";
import { Skeleton } from "./skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PlainActivity } from "@/components/ui/activity";
import { Calendar } from "@/features/book/calendar";
import { Employees } from "@/features/book/employee";
import { Timeslots } from "@/features/book/timeslots";

import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatISO, isEqual, isSameDay, format } from "date-fns";

import { useActivity } from "@/hooks/activities";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useApi } from "@/hooks/useApi";
import { useToast } from "@/components/ui/use-toast";
import { useBackButton, useMainButton } from "@twa.js/sdk-react";

const schema = zod.object({
  id: zod.string().uuid(),
  employee_id: zod.number().int(),
  date: zod.date(),
  timeslot: zod.string().regex(/^\d{2}:\d{2}:\d{2}$/),
});

const Page = () => {
  const [descriptionCollapsed, setDescriptionCollapsed] =
    useState<boolean>(true);

  const searchParams = useSearchParams();

  const api = useApi();
  const backButton = useBackButton();
  const mainButton = useMainButton();
  const { toast } = useToast();

  const router = useRouter();

  const {
    data: activity,
    error,
    loading,
  } = useActivity(searchParams.get("activity"));

  useEffect(() => {
    const handleGoBack = () => {
      router.back();
    };

    backButton.show();
    backButton.on("click", handleGoBack);

    return () => {
      backButton.off("click", handleGoBack);
      backButton.hide();
    };
  }, [backButton, router]);

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

  const handleBookActivity = useCallback(() => {
    mainButton.showProgress();

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
        mainButton.hideProgress();
      });
  }, [api, employee, id, date, timeslot, toast, router, mainButton]);

  useEffect(() => {
    if (canSubmit) {
      mainButton.enable();
      mainButton.setText("Book activity");
      mainButton.show();
      mainButton.on("click", handleBookActivity);
    } else {
      mainButton.disable();
      mainButton.hide();
      mainButton.off("click", handleBookActivity);
    }

    return () => {
      mainButton.hide();
      mainButton.off("click", handleBookActivity);
    };
  }, [mainButton, canSubmit, handleBookActivity]);

  const handleToggleDescription = () => {
    setDescriptionCollapsed((prev) => !prev);
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
      <PlainActivity
        data={activity}
        collapsed={descriptionCollapsed}
        onClick={handleToggleDescription}
        collapsible
        hideEmployee
      />
      <Employees
        onSelect={handleSelectEmployee}
        onDeselect={handleDeselectEmployee}
        selected={employee}
      />
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
    </div>
  );
};

export default Page;
