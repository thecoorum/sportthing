import { ServerCrash } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar } from "@/components/ui/avatar";
import { Selected } from "./selected";

import { motion } from "framer-motion";

import { useEmployees } from "@/hooks/employees";
import { Button } from "@/components/ui/button";

const MotionButton = motion(Button);

type Props = {
  onSelect: (id: number) => void;
  onDeselect: () => void;
  selected: number | undefined;
};

export const Employees = ({ onSelect, onDeselect, selected }: Props) => {
  const { data: employees, error, loading } = useEmployees();

  if (error) {
    return (
      <Alert>
        <ServerCrash className="w-4 h-4" />
        <AlertTitle>Oops, something went wrong</AlertTitle>
        <AlertDescription>
          There was an error during fetching the employees, please try again. If
          the problem persists, please contact the support.
        </AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-[18px] w-[100px]" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-[18px] w-[100px]" />
        </div>
      </div>
    );
  }

  if (!employees?.length) {
    return (
      <Alert>
        <ServerCrash className="w-4 h-4" />
        <AlertTitle>No employees found</AlertTitle>
        <AlertDescription>
          There are no employees in this organization. Please come back later.
        </AlertDescription>
      </Alert>
    );
  }

  if (selected) {
    return <Selected id={selected} onDeselect={onDeselect} />;
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-medium leading-none tracking-tight">
        Employee
      </h2>
      <div className="space-y-2">
        {employees.map((employee, index) => (
          <MotionButton
            key={employee.id}
            onClick={() => onSelect(employee.id)}
            variant="ghost"
            className="w-full flex justify-start items-center gap-2 px-4 py-3 h-auto border"
            initial={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 0.2 * index, duration: 0.3 }}
          >
            <Avatar
              className="block"
              name={employee.user.name}
              image={employee.user.photo_url}
            />
            <p>{employee.user.name}</p>
          </MotionButton>
        ))}
      </div>
    </div>
  );
};
