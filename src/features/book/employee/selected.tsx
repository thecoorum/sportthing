import { ServerCrash, Trash, UserCircle2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";

import { useEmployee } from "@/hooks/employees";

type Props = {
  id: number;
  onDeselect: () => void;
};

export const Selected = ({ id, onDeselect }: Props) => {
  const { data, error, loading } = useEmployee(id);

  if (error) {
    return (
      <Alert>
        <ServerCrash className="w-4 h-4" />
        <AlertTitle>Oops, something went wrong</AlertTitle>
        <AlertDescription>
          There was an error during fetching the employee, please try again. If
          the problem persists, please contact the support.
        </AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return (
      <div className="space-y-3">
        <h2 className="text-lg font-medium leading-none tracking-tight">
          Employee
        </h2>
        <div className="flex items-center gap-2 w-full px-4 py-3 rounded-md border">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-[18px] w-[100px]" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <Alert>
        <UserCircle2 className="w-4 h-4" />
        <AlertTitle>Oops, something went wrong</AlertTitle>
        <AlertDescription>
          The employee with the given id does not exist. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-medium leading-none tracking-tight">
        Employee
      </h2>
      <div className="flex items-center justify-between gap-2 w-full px-4 py-3 border rounded-md bg-slate-50">
        <div className="flex items-center gap-2 font-medium text-sm">
          <Avatar name={data.user.name} image={data.user.photo_url} />
          <p>{data.user.name}</p>
        </div>
        <Button onClick={onDeselect} variant="ghost">
          <Trash className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
