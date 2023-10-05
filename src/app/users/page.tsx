"use client";

import { UserX } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PageSkeleton } from "./skeleton";
import { columns } from "./columns";
import { DataTable } from "./data-table";

import { useUser } from "@/hooks/useUser";
import { useExternalUsers } from "@/hooks/users";

const UsersPage = () => {
  const user = useUser();

  const { data, error, loading } = useExternalUsers();

  if (!user) return;

  if (user.role !== "administrator") {
    return (
      <Alert>
        <UserX className="w-4 h-4" />
        <AlertTitle>Access denied</AlertTitle>
        <AlertDescription>
          You don&apos;t have enough permissions to view this page.
        </AlertDescription>
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert>
        <UserX className="w-4 h-4" />
        <AlertTitle>Oops, something went wrong</AlertTitle>
        <AlertDescription>
          There was an error during fetching the users, please try again. If the
          problem persists, please contact the support.
        </AlertDescription>
      </Alert>
    );
  }

  if (loading || !data) {
    return <PageSkeleton />;
  }

  return (
    <DataTable columns={columns} data={data} />
  );
};

export default UsersPage;
