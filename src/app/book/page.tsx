"use client";

import { useState } from "react";

import { ServerCrash, ChevronLeft } from "lucide-react";
import { Skeleton } from "./skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PlainActivity } from "@/components/ui/activity";
import { Calendar } from "@/features/book/calendar";
import { Employees } from "@/features/book/employee";

import Link from "next/link";

import { useActivity } from "@/hooks/activities";
import { useSearchParams } from "next/navigation";

const Page = () => {
  const [selected, setSelected] = useState<number | null>(null);

  const searchParams = useSearchParams();

  const {
    data: activity,
    error,
    loading,
  } = useActivity(searchParams.get("activity"));

  const handleSelectEmployee = (id: number) => {
    setSelected(id);
  };

  const handleDeselectEmployee = () => {
    setSelected(null);
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
          selected={selected}
        />
      )}
      {selected && <Calendar onDateSelect={(date) => {}} />}
    </div>
  );
};

export default Page;
