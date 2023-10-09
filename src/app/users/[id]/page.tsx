import { ServerCrash, UserX2 } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Avatar } from "@/components/ui/avatar";

import { useExternalUser } from "@/hooks/users";

const Page = ({ params }: { params: { id: string } }) => {
  const { data: user, error, loading } = useExternalUser(params.id);

  if (error) {
    return (
      <Alert>
        <ServerCrash className="w-4 h-4" />
        <AlertTitle>Oops, something went wrong</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return null;
  }

  if (!user) {
    return (
      <Alert>
        <UserX2 className="w-4 h-4" />
        <AlertTitle>Oops, something went wrong</AlertTitle>
        <AlertDescription>
          The user you are looking for does not exist.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Avatar name={user.name} image={user.photo_url} />
        <h2 className="text-3xl font-semibold leading-none tracking-tight">
          {user.name}
        </h2>
        {user.username && (
          <span className="text-sm text-muted-foreground tracking-tight leading-none">
            @{user.username}
          </span>
        )}
      </div>
    </div>
  );
};
